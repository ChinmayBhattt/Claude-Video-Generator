const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const FPS = 30;
const DURATION = 30.25;
const TOTAL_FRAMES = Math.ceil(DURATION * FPS);
const W = 1280;
const H = 720;
const FRAMES_DIR = path.join(__dirname, 'render_frames');

async function main() {
  // Ensure frames directory
  if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });

  console.log(`Rendering ${TOTAL_FRAMES} frames at ${FPS}fps (${DURATION}s)...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  // Navigate to the local file
  await page.goto(`file://${path.join(__dirname, 'player', 'index.html')}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for assets to load
  await page.waitForFunction('window.assetsReady === true', { timeout: 15000 });
  console.log('Assets loaded, starting frame render...');

  const startTime = Date.now();

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;

    // Call renderFrame directly
    await page.evaluate((time) => {
      window.renderFrame(time);
    }, t);

    // Grab canvas screenshot
    const canvasDataUrl = await page.evaluate(() => {
      return document.getElementById('stage').toDataURL('image/png');
    });

    // Save as PNG
    const base64Data = canvasDataUrl.replace(/^data:image\/png;base64,/, '');
    const frameNum = String(i + 1).padStart(5, '0');
    fs.writeFileSync(path.join(FRAMES_DIR, `frame_${frameNum}.png`), base64Data, 'base64');

    if ((i + 1) % 30 === 0 || i === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const pct = ((i + 1) / TOTAL_FRAMES * 100).toFixed(1);
      console.log(`  Frame ${i + 1}/${TOTAL_FRAMES} (${pct}%) - ${elapsed}s elapsed - t=${t.toFixed(2)}s`);
    }
  }

  await browser.close();
  console.log(`\nAll ${TOTAL_FRAMES} frames rendered in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  // Combine frames to MP4 with ffmpeg
  console.log('\nEncoding to MP4...');
  const outputPath = path.join(__dirname, 'Hackers_Unity_Promo_v2.mp4');
  const audioPath = path.join(__dirname, 'player', 'audio.aac');

  const ffmpegCmd = [
    'ffmpeg', '-y',
    '-framerate', String(FPS),
    '-i', path.join(FRAMES_DIR, 'frame_%05d.png'),
    '-i', audioPath,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    outputPath
  ].join(' ');

  console.log(`Running: ${ffmpegCmd}`);
  execSync(ffmpegCmd, { stdio: 'inherit' });

  console.log(`\n✅ Video saved to: ${outputPath}`);

  // Cleanup frames
  console.log('Cleaning up frames...');
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log('Done!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
