// Regenerates public/og-image-pt.png and public/og-image-en.png (1200x630) with headless Chrome.
// Usage: node scripts/make-og-images.mjs   (needs Google Chrome; set CHROME=/path to override)
// The key content sits in the centre 630x630 square so WhatsApp's 1:1 crop keeps it.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const cards = {
  pt: { lines: ['Minha', 'Próxima', 'Faixa'], sub: 'Checklist de graduação de Jiu-Jitsu', facts: '205 técnicas · Grátis · Offline' },
  en: { lines: ['My Next', 'Belt'], sub: 'Jiu-Jitsu belt requirements checklist', facts: '205 techniques · Free · Offline' },
};

const html = (c) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Space+Mono:wght@700&family=Archivo:wght@800&display=swap">
<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background-color:#fff;background-image:linear-gradient(#f0e4e4 1px,transparent 1px),linear-gradient(90deg,#f0e4e4 1px,transparent 1px);background-size:44px 44px;color:#0a0a0a;position:relative;font-family:Archivo,sans-serif}
.safe{position:absolute;left:285px;top:0;width:630px;height:630px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.kicker{font:700 22px 'Space Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:#a60a14;margin-bottom:14px}
h1{margin:0;font:900 132px/.86 'Big Shoulders Display',Impact,sans-serif;text-transform:uppercase;color:#0a0a0a}
h1 span{color:#e5121f}
.belts{display:flex;margin:26px 0 20px;border:3px solid #0a0a0a;box-shadow:6px 6px 0 #0a0a0a}
.belts i{display:block;width:70px;height:26px}
.sub{font:800 30px/1.15 Archivo,sans-serif;max-width:560px}
.facts{margin-top:14px;font:700 20px 'Space Mono',monospace;color:#6b6b6b;text-transform:uppercase;letter-spacing:.06em}
.corner{position:absolute;bottom:26px;font:700 20px 'Space Mono',monospace;letter-spacing:.14em;text-transform:uppercase}
.l{left:40px;color:#e5121f}.r{right:40px}
.bar{position:absolute;left:0;top:0;width:100%;height:14px;background:#e5121f}
</style></head><body>
<div class="bar"></div>
<div class="safe">
<div class="kicker">tatame0</div>
<h1>${c.lines.map((l, i) => (i === c.lines.length - 1 ? `<span>${l}</span>` : l)).join('<br>')}</h1>
<div class="belts"><i style="background:#1d4ed8"></i><i style="background:#7e22ce"></i><i style="background:#78350f"></i><i style="background:#0a0a0a"></i></div>
<div class="sub">${c.sub}</div>
<div class="facts">${c.facts}</div>
</div>
<div class="corner l">FIG.01</div><div class="corner r">graduacao.tatame0.com</div>
</body></html>`;

const tmp = mkdtempSync(join(tmpdir(), 'og-'));
for (const [lang, card] of Object.entries(cards)) {
  const src = join(tmp, `${lang}.html`);
  const out = join(publicDir, `og-image-${lang}.png`);
  writeFileSync(src, html(card));
  const r = spawnSync(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--disable-features=MacAppCodeSignClone',
    '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=8000', `--screenshot=${out}`, `file://${src}`], { stdio: 'pipe' });
  if (r.status !== 0) throw new Error(`Chrome failed: ${r.stderr}`);
  console.log(out, Math.round(statSync(out).size / 1024) + ' KB');
}
