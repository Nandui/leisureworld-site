"""Read-only external destination checks; never submits forms or follows action buttons."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
import json
import re

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'docs/audit-2026-09-16'

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
        self.active = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'):
            self.active = {'url': attrs['href'], 'label': attrs.get('aria-label', ''), 'text': ''}
        elif tag == 'img' and self.active is not None:
            self.active['text'] += attrs.get('alt', '')
    def handle_data(self, text):
        if self.active is not None:
            self.active['text'] += text
    def handle_endtag(self, tag):
        if tag == 'a' and self.active is not None:
            self.items.append(self.active)
            self.active = None

def inventory():
    urls = {}
    for path in ROOT.rglob('*.html'):
        relative = path.relative_to(ROOT)
        if any(part.startswith('.') or part in ('docs', 'dist', 'node_modules') for part in relative.parts):
            continue
        parser = Links()
        parser.feed(path.read_text(encoding='utf-8'))
        for item in parser.items:
            url = item['url']
            parsed = urlsplit(url)
            if parsed.scheme not in ('http', 'https') or parsed.hostname in ('leisureworldcork.com', 'www.leisureworldcork.com'):
                continue
            urls.setdefault(url, []).append({'page': relative.as_posix(), 'label': item['label'] or ' '.join(item['text'].split())})
    for url in ['https://leisureworldcork.legendonlineservices.co.uk/enterprise/program/8699', 'https://ie.indeed.com/cmp/Leisureworld-Cork/jobs']:
        urls.setdefault(url, [])
    return urls

def check(item):
    url, references = item
    result = {'url': url, 'references': references, 'method': 'GET', 'status': None, 'final_url': None, 'title': '', 'outcome': 'unverified'}
    try:
        try:
            response = urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; LeisureWorldSiteAudit/1.0)', 'Accept': 'text/html,application/xhtml+xml'}), timeout=18)
        except HTTPError as error:
            response = error
        with response:
            result['status'] = response.status
            result['final_url'] = response.url
            html = response.read(1500000).decode('utf-8', 'replace')
        title = re.search(r'<title[^>]*>(.*?)</title>', html, flags=re.I | re.S)
        result['title'] = ' '.join(unescape(re.sub('<[^>]+>', '', title.group(1))).split()) if title else ''
        plain = ' '.join(unescape(re.sub('<[^>]+>', ' ', html)).split())
        result['identity_excerpt'] = next((plain[max(0, m.start()-80):m.end()+180] for m in re.finditer(r'Leisure\s?World|Gus Healy|Bishopstown|Churchfield', plain, re.I)), '')
        if response.status in (403, 429) or re.search(r'just a moment|access denied|security check|verify.*human|captcha|robot challenge', result['title'], re.I):
            result['outcome'] = 'unverified_challenge'
        elif response.status in (404, 410):
            result['outcome'] = 'dead_http'
        elif 200 <= response.status < 400:
            result['outcome'] = 'reachable_needs_context_review'
        else:
            result['outcome'] = 'unverified_http_error'
    except Exception as error:
        result['error'] = f'{type(error).__name__}: {error}'
        result['outcome'] = 'unverified_network'
    return result

if __name__ == '__main__':
    urls = inventory()
    with ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(check, sorted(urls.items())))
    report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'scope': 'Read-only GET checks of unique external navigation destinations. No sign-in, booking, purchase, application or message submitted.', 'results': results}
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / 'external-services.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    for result in results:
        print(result['status'], result['outcome'], result['url'], repr(result['title']))
