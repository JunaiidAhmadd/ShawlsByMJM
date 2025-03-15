const fs = require('fs');
const path = require('path');

// Function to copy a file
function copyFile(source, destination) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    
    readStream.on('error', err => reject(err));
    writeStream.on('error', err => reject(err));
    
    writeStream.on('finish', () => {
      console.log(`Replaced: ${destination} with ${source}`);
      resolve();
    });
    
    readStream.pipe(writeStream);
  });
}

// Files to replace
const filesToReplace = [
  // Hero images
  { source: 'img/shawls/hero/hero-1.jpg', destination: 'img/hero/hero-1.jpg' },
  { source: 'img/shawls/hero/hero-2.jpg', destination: 'img/hero/hero-2.jpg' },
  
  // Banner images
  { source: 'img/shawls/banner/banner-1.jpg', destination: 'img/banner/banner-1.jpg' },
  { source: 'img/shawls/banner/banner-2.jpg', destination: 'img/banner/banner-2.jpg' },
  { source: 'img/shawls/banner/banner-3.jpg', destination: 'img/banner/banner-3.jpg' },
  
  // Product images
  { source: 'img/shawls/product/product-1.jpg', destination: 'img/product/product-1.jpg' },
  { source: 'img/shawls/product/product-2.jpg', destination: 'img/product/product-2.jpg' },
  { source: 'img/shawls/product/product-3.jpg', destination: 'img/product/product-3.jpg' },
  { source: 'img/shawls/product/product-4.jpg', destination: 'img/product/product-4.jpg' },
  { source: 'img/shawls/product/product-5.jpg', destination: 'img/product/product-5.jpg' },
  { source: 'img/shawls/product/product-6.jpg', destination: 'img/product/product-6.jpg' },
  { source: 'img/shawls/product/product-7.jpg', destination: 'img/product/product-7.jpg' },
  { source: 'img/shawls/product/product-8.jpg', destination: 'img/product/product-8.jpg' },
  { source: 'img/shawls/product/product-9.jpg', destination: 'img/product/product-9.jpg' },
  { source: 'img/shawls/product/product-10.jpg', destination: 'img/product/product-10.jpg' },
  { source: 'img/shawls/product/product-11.jpg', destination: 'img/product/product-11.jpg' },
  { source: 'img/shawls/product/product-12.jpg', destination: 'img/product/product-12.jpg' },
  { source: 'img/shawls/product/product-13.jpg', destination: 'img/product/product-13.jpg' },
  { source: 'img/shawls/product/product-14.jpg', destination: 'img/product/product-14.jpg' },
  
  // Instagram images
  { source: 'img/shawls/instagram/instagram-1.jpg', destination: 'img/instagram/instagram-1.jpg' },
  { source: 'img/shawls/instagram/instagram-2.jpg', destination: 'img/instagram/instagram-2.jpg' },
  { source: 'img/shawls/instagram/instagram-3.jpg', destination: 'img/instagram/instagram-3.jpg' },
  { source: 'img/shawls/instagram/instagram-4.jpg', destination: 'img/instagram/instagram-4.jpg' },
  { source: 'img/shawls/instagram/instagram-5.jpg', destination: 'img/instagram/instagram-5.jpg' },
  { source: 'img/shawls/instagram/instagram-6.jpg', destination: 'img/instagram/instagram-6.jpg' },
  
  // Blog images
  { source: 'img/shawls/blog/blog-1.jpg', destination: 'img/blog/blog-1.jpg' },
  { source: 'img/shawls/blog/blog-2.jpg', destination: 'img/blog/blog-2.jpg' },
  { source: 'img/shawls/blog/blog-3.jpg', destination: 'img/blog/blog-3.jpg' },
  
  // Product sale image
  { source: 'img/shawls/product-sale.png', destination: 'img/product-sale.png' }
];

// Replace all files
async function replaceAllFiles() {
  for (const file of filesToReplace) {
    try {
      // Make a backup of the original file
      const backupPath = `${file.destination}.bak`;
      if (fs.existsSync(file.destination) && !fs.existsSync(backupPath)) {
        await copyFile(file.destination, backupPath);
        console.log(`Backup created: ${backupPath}`);
      }
      
      // Replace the file
      await copyFile(file.source, file.destination);
    } catch (error) {
      console.error(`Error replacing ${file.destination}:`, error.message);
    }
  }
  console.log('All files replaced!');
}

replaceAllFiles(); 