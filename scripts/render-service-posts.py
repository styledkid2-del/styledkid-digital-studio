from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "service-posts"
OUT.mkdir(parents=True, exist_ok=True)

posts = [
    {
        "file": "brand-basics.png",
        "eyebrow": "01 / BRAND BASICS",
        "title": "Make your\nfirst impression\nfeel like you.",
        "copy": "Clear words. A thoughtful visual direction. A business people can recognise.",
        "cta": "BUILD MY BASICS",
        "asset": "assets/service-previews/brand-direction.svg",
        "alt": "Kioo Studio original illustrative brand moodboard sample",
        "tint": "#e5e8da",
    },
    {
        "file": "social-content.png",
        "eyebrow": "02 / SOCIAL CONTENT",
        "title": "Show up\nwith a plan.",
        "copy": "Useful post ideas and clear captions, shaped around what your business offers.",
        "cta": "PLAN MY CONTENT",
        "asset": "assets/service-previews/social-content.svg",
        "alt": "Kioo Studio original social-content post-design samples",
        "tint": "#f0e5da",
    },
    {
        "file": "digital-starter.png",
        "eyebrow": "03 / DIGITAL STARTER",
        "title": "A simple\nonline home\nfor your business.",
        "copy": "One focused page, a clear contact path, and a practical way to launch.",
        "cta": "GET LAUNCH-READY",
        "asset": "assets/service-previews/digital-launch.svg",
        "alt": "Kioo Studio illustrative one-page website concept, clearly marked as a sample",
        "tint": "#e4e9df",
    },
    {
        "file": "web-development.png",
        "eyebrow": "04 / WEB DEVELOPMENT",
        "title": "A website\nfor what\ncomes next.",
        "copy": "Responsive digital experiences, shaped around your goals and your customers.",
        "cta": "LET'S SCOPE IT",
        "asset": "assets/case-studies/menwe-primary-junior-homepage.webp",
        "alt": "Actual Menwe Primary and Junior School website homepage by Kioo Studio",
        "tint": "#e4e7e2",
    },
]

template = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
* { box-sizing: border-box; }
@page { size: 1200px 800px; margin: 0; }
html, body { width: 1200px; height: 800px; margin: 0; }
body { background: #f3f0e7; color: #172a24; font-family: Arial, Helvetica, sans-serif; }
.post { width: 1200px; height: 800px; padding: 48px 56px; overflow: hidden; position: relative; background: #f3f0e7; }
.topline { height: 46px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(23,42,36,.2); }
.brand { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; letter-spacing: 2.7px; }
.mark { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: #172a24; color: #f3f0e7; font-family: Georgia,serif; font-size: 20px; font-weight: normal; letter-spacing: 0; }
.tag { font-size: 10px; letter-spacing: 2px; color: #56655a; text-transform: uppercase; }
.content { position: absolute; left: 56px; right: 56px; top: 126px; bottom: 105px; display: grid; grid-template-columns: 1fr 0.93fr; gap: 44px; align-items: center; }
.copy { position: relative; z-index: 2; padding: 0 0 20px; }
.eyebrow { margin: 0 0 22px; color: #8b4b33; font-size: 11px; font-weight: bold; letter-spacing: 2.5px; }
h1 { margin: 0; max-width: 600px; font-family: Georgia, 'Times New Roman', serif; font-size: 70px; line-height: .99; font-weight: 400; letter-spacing: -2.4px; white-space: pre-line; }
.rule { margin: 27px 0 17px; height: 1px; width: 92%; background: rgba(23,42,36,.2); }
.description { max-width: 430px; font-size: 18px; line-height: 1.5; color: #45544a; }
.cta { display: inline-flex; margin-top: 13px; padding: 15px 20px; background: #172a24; color: #fffdf7; font-size: 10px; font-weight: bold; letter-spacing: 1.7px; }
.visual { margin: 0; height: auto; aspect-ratio: 3 / 2; position: relative; background: TINT; padding: 22px; display: flex; align-items: center; justify-content: center; }
.visual:before { content: ''; position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; border: 1px solid rgba(23,42,36,.12); }
.visual img { z-index: 1; display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; }
.footer { position: absolute; left: 56px; right: 56px; bottom: 43px; border-top: 1px solid rgba(23,42,36,.2); padding-top: 13px; display: flex; justify-content: space-between; color: #56655a; font-size: 9px; letter-spacing: 1.8px; text-transform: uppercase; }
</style></head><body><main class="post"><div class="topline"><div class="brand"><span class="mark">K</span>KIOO STUDIO</div><span class="tag">Thoughtful digital, made clear</span></div><div class="content"><section class="copy"><p class="eyebrow">EYEBROW</p><h1>TITLE</h1><div class="rule"></div><p class="description">COPY</p><span class="cta">CTA&nbsp; ↗</span></section><figure class="visual"><img src="ASSET" alt="ALT"></figure></div><div class="footer"><span>Clear, practical, online-first</span><span>Made for small businesses in Kenya</span></div></main></body></html>'''

for post in posts:
    html = (template.replace("EYEBROW", post["eyebrow"])
            .replace("TITLE", post["title"])
            .replace("COPY", post["copy"])
            .replace("CTA", post["cta"])
            .replace("ASSET", (ROOT / post["asset"]).as_uri())
            .replace("ALT", post["alt"])
            .replace("TINT", post["tint"]))
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html)
        source = Path(f.name)
    try:
        dest = OUT / post["file"]
        subprocess.run([
            "chromium", "--headless", "--no-sandbox", "--disable-gpu",
            "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
            "--run-all-compositor-stages-before-draw", "--virtual-time-budget=1500",
            "--window-size=1200,800", f"--screenshot={dest}", source.as_uri()
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"Rendered {dest.relative_to(ROOT)}")
    finally:
        source.unlink(missing_ok=True)
