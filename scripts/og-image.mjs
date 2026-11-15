// Renders assets-source/og/og-image.html with headless Chrome/Edge and writes
// public/og-image.jpg (1200x630). Run after changing the hero art: npm run og-image
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const template = resolve(root, 'assets-source/og/og-image.html');
const png = resolve(root, 'assets-source/og/og-image.png');
const jpg = resolve(root, 'public/og-image.jpg');

const browsers = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('og-image: no Chrome/Edge found; set CHROME_PATH');

execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--virtual-time-budget=8000',
  `--screenshot=${png}`,
  pathToFileURL(template).href,
], { stdio: 'inherit' });

// PNG -> progressive JPEG (Pillow), keeping the share image small.
execFileSync('python', ['-c',
  `from PIL import Image; Image.open(r"${png}").convert("RGB").save(r"${jpg}", "JPEG", quality=86, optimize=True, progressive=True)`,
], { stdio: 'inherit' });
rmSync(png, { force: true });
console.log(`og-image: wrote ${jpg}`);
