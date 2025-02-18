import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOGImage() {
  // Создаем canvas с размерами для OG изображения (1200x630 - стандартный размер)
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Задаем градиентный фон
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#1a1a1a');
  gradient.addColorStop(1, '#2d2d2d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Добавляем текст
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Руди Виктор', 600, 280);

  ctx.font = '36px Arial';
  ctx.fillText('Frontend Developer', 600, 350);

  // Создаем папку public, если её нет
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Сохраняем изображение
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), buffer);

  console.log('OG image generated successfully!');
}

generateOGImage().catch(console.error);
