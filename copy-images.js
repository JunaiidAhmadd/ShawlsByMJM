const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const directories = [
  'img/shawls',
  'img/shawls/hero',
  'img/shawls/banner',
  'img/shawls/product',
  'img/shawls/instagram',
  'img/shawls/blog'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Function to copy a file
function copyFile(source, destination) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    
    readStream.on('error', err => reject(err));
    writeStream.on('error', err => reject(err));
    
    writeStream.on('finish', () => {
      console.log(`Copied: ${source} -> ${destination}`);
      resolve();
    });
    
    readStream.pipe(writeStream);
  });
}

// Files to copy
const filesToCopy = [
  // Hero images
  { source: 'img/hero/hero-1.jpg', destination: 'img/shawls/hero/hero-1.jpg' },
  { source: 'img/hero/hero-2.jpg', destination: 'img/shawls/hero/hero-2.jpg' },
  
  // Banner images
  { source: 'img/banner/banner-1.jpg', destination: 'img/shawls/banner/banner-1.jpg' },
  { source: 'img/banner/banner-2.jpg', destination: 'img/shawls/banner/banner-2.jpg' },
  { source: 'img/banner/banner-3.jpg', destination: 'img/shawls/banner/banner-3.jpg' },
  
  // Product images
  { source: 'img/product/product-1.jpg', destination: 'img/shawls/product/product-1.jpg' },
  { source: 'img/product/product-2.jpg', destination: 'img/shawls/product/product-2.jpg' },
  { source: 'img/product/product-3.jpg', destination: 'img/shawls/product/product-3.jpg' },
  { source: 'img/product/product-4.jpg', destination: 'img/shawls/product/product-4.jpg' },
  { source: 'img/product/product-5.jpg', destination: 'img/shawls/product/product-5.jpg' },
  { source: 'img/product/product-6.jpg', destination: 'img/shawls/product/product-6.jpg' },
  { source: 'img/product/product-7.jpg', destination: 'img/shawls/product/product-7.jpg' },
  { source: 'img/product/product-8.jpg', destination: 'img/shawls/product/product-8.jpg' },
  { source: 'img/product/product-9.jpg', destination: 'img/shawls/product/product-9.jpg' },
  { source: 'img/product/product-10.jpg', destination: 'img/shawls/product/product-10.jpg' },
  { source: 'img/product/product-11.jpg', destination: 'img/shawls/product/product-11.jpg' },
  { source: 'img/product/product-12.jpg', destination: 'img/shawls/product/product-12.jpg' },
  { source: 'img/product/product-13.jpg', destination: 'img/shawls/product/product-13.jpg' },
  { source: 'img/product/product-14.jpg', destination: 'img/shawls/product/product-14.jpg' },
  
  // Instagram images
  { source: 'img/instagram/instagram-1.jpg', destination: 'img/shawls/instagram/instagram-1.jpg' },
  { source: 'img/instagram/instagram-2.jpg', destination: 'img/shawls/instagram/instagram-2.jpg' },
  { source: 'img/instagram/instagram-3.jpg', destination: 'img/shawls/instagram/instagram-3.jpg' },
  { source: 'img/instagram/instagram-4.jpg', destination: 'img/shawls/instagram/instagram-4.jpg' },
  { source: 'img/instagram/instagram-5.jpg', destination: 'img/shawls/instagram/instagram-5.jpg' },
  { source: 'img/instagram/instagram-6.jpg', destination: 'img/shawls/instagram/instagram-6.jpg' },
  
  // Blog images
  { source: 'img/blog/blog-1.jpg', destination: 'img/shawls/blog/blog-1.jpg' },
  { source: 'img/blog/blog-2.jpg', destination: 'img/shawls/blog/blog-2.jpg' },
  { source: 'img/blog/blog-3.jpg', destination: 'img/shawls/blog/blog-3.jpg' },
  
  // Product sale image
  { source: 'img/product-sale.png', destination: 'img/shawls/product-sale.png' }
];

// Copy all files
async function copyAllFiles() {
  for (const file of filesToCopy) {
    try {
      await copyFile(file.source, file.destination);
    } catch (error) {
      console.error(`Error copying ${file.source}:`, error.message);
    }
  }
  console.log('All files copied!');
}

copyAllFiles(); 