"""Create responsive WebP encodings of used images. Source assets stay intact.
No cropping, compositing, content editing or upscaling is performed.
"""
from pathlib import Path
import json
from bs4 import BeautifulSoup
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
out=ROOT/'Images/optimized';out.mkdir(exist_ok=True)
records={}
for page in sorted(ROOT.rglob('*.html')):
    if any(x.startswith('.') or x in {'dist','node_modules','docs'} for x in page.relative_to(ROOT).parts):continue
    soup=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
    for img in soup.select('img[src]'):
        src=img.get('data-original-src',img['src'])
        path=(page.parent/src).resolve()
        if not path.is_file() or path.suffix.lower() not in ['.png','.jpg','.jpeg'] or path.name in ['logo.png','leisureworld-logo-white.png','appstore.png','playstore.png']:continue
        if path.stat().st_size<45000:continue
        if path not in records:
            original=Image.open(path)
            original=original.convert('RGBA' if 'A' in original.getbands() else 'RGB')
            widths=sorted(set(min(w,original.width) for w in [480,960,1600]))
            variants=[]
            for width in widths:
                target=out/f'{path.stem}-{width}.webp'
                encoded=original.resize((width,round(original.height*width/original.width)),Image.Resampling.LANCZOS) if width!=original.width else original
                encoded.save(target,'WEBP',quality=86,method=6)
                variants.append((target,width))
            records[path]=variants
        variants=records[path]
        prefix='../'*(len(page.relative_to(ROOT).parts)-1)
        img['data-original-src']=src
        img['src']=prefix+variants[-1][0].relative_to(ROOT).as_posix()
        img['srcset']=', '.join(prefix+p.relative_to(ROOT).as_posix()+f' {width}w' for p,width in variants)
        if 'hero-image' in img.get('class',[]) or img.find_parent(class_='centre-panorama'):sizes='100vw'
        elif img.find_parent(class_='app-preview'):sizes='(max-width: 600px) 220px, 320px'
        else:sizes='(max-width: 600px) calc(100vw - 48px), (max-width: 1000px) 50vw, 640px'
        img['sizes']=sizes
        img['decoding']='async'
    page.write_text(str(soup).rstrip()+'\n',encoding='utf-8')
summary=[{'source':p.relative_to(ROOT).as_posix(),'original_bytes':p.stat().st_size,'largest_webp_bytes':v[-1][0].stat().st_size,'variants':[x.relative_to(ROOT).as_posix() for x,_ in v]} for p,v in records.items()]
(ROOT/'.impeccable/image-optimization.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps({'used_images_optimized':len(records),'original_bytes':sum(x['original_bytes'] for x in summary),'largest_variants_bytes':sum(x['largest_webp_bytes'] for x in summary)},indent=2))
