"""Serve the public static site on loopback. PHP mail needs a PHP host."""
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path,PurePosixPath
from urllib.parse import unquote,urlsplit
import argparse,os
parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8123);args=parser.parse_args()
os.chdir(Path(__file__).resolve().parent.parent)
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path=PurePosixPath(unquote(urlsplit(self.path).path))
        if any(p.startswith('.') for p in path.parts) or 'scripts' in path.parts or path.suffix.lower() not in ('','.html','.css','.js','.png','.jpg','.jpeg','.webp','.svg','.woff2','.ico','.xml','.txt'):
            self.send_error(404);return
        super().do_GET()
    def list_directory(self,path):
        self.send_error(404);return None
    def end_headers(self):
        self.send_header('Cache-Control','no-cache')
        super().end_headers()
print(f'LeisureWorld preview: http://127.0.0.1:{args.port}',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
