import os, sys
from pathlib import Path
sys.path.insert(0,str(Path(os.environ['TEMP'])/'lw-site-audit-deps'))
from PIL import Image,ImageDraw,ImageFont
OUT=Path(__file__).parent
mode=sys.argv[1] if len(sys.argv)>1 else 'desktop'
files=sorted((OUT/'screenshots'/mode).glob('*.png'))
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20)
for start in range(0,len(files),4):
  batch=files[start:start+4]
  tiles=[]
  for f in batch:
    im=Image.open(f).convert('RGB')
    # Full page proportional image, capped to make each audit overview inspectable.
    w=430;h=round(im.height*w/im.width)
    im=im.resize((w,h))
    tiles.append((f,im))
  h=max(im.height for _,im in tiles)+70
  canvas=Image.new('RGB',(4*450,h),'#d8dde5');draw=ImageDraw.Draw(canvas)
  for idx,(f,im) in enumerate(tiles):
    draw.text((idx*450+10,10),f.stem[:31],font=font,fill='#132944')
    canvas.paste(im,(idx*450+10,50))
  target=OUT/'sheets';target.mkdir(exist_ok=True)
  canvas.save(target/f'{mode}-{start//4+1:02}.jpg',quality=88)
print(f'{len(files)} {mode} pages -> {(len(files)+3)//4} overview sheets')
