import fs from 'fs-extra';
import { createCanvas } from 'canvas';

async function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw a simple colored rectangle with text
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = 'white';
  ctx.font = `${size/4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TI', size/2, size/2);

  // Ensure the directory exists
  await fs.ensureDir('public/icons');
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(`public/icons/icon${size}.png`, buffer);
}

async function generateAllIcons() {
  const sizes = [16, 48, 128];
  
  for (const size of sizes) {
    await generateIcon(size);
    console.log(`Generated icon${size}.png`);
  }
}

generateAllIcons().catch(console.error); 