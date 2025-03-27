const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// URL of a high-quality tech-related image
const imageUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=100';

// Download the image
https.get(imageUrl, (response) => {
  const chunks = [];
  response.on('data', (chunk) => chunks.push(chunk));
  response.on('end', () => {
    const buffer = Buffer.concat(chunks);
    
    // Optimize the image using sharp
    sharp(buffer)
      .resize(1920, 1080, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 90,
        progressive: true
      })
      .toFile(path.join(imagesDir, 'hero-bg.jpg'))
      .then(() => {
        console.log('Hero background image downloaded and optimized successfully!');
      })
      .catch((err) => {
        console.error('Error processing image:', err);
      });
  });
}).on('error', (err) => {
  console.error('Error downloading image:', err);
}); 