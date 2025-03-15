const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file if there's an error
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Pakistani women's shawl images from free stock photo sites
// Note: These URLs are examples and should be replaced with actual free-to-use Pakistani shawl images
const images = [
  // Hero images (larger, high quality)
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/hero/hero-1.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/hero/hero-2.jpg'
  },
  
  // Banner images (medium size)
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/banner/banner-1.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/banner/banner-2.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/banner/banner-3.jpg'
  },
  
  // Product images (smaller, product focused)
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-1.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-2.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-3.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-4.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-5.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-6.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-7.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-8.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-9.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-10.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-11.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-12.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-13.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product/product-14.jpg'
  },
  
  // Instagram images (square format)
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/instagram/instagram-1.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/instagram/instagram-2.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/instagram/instagram-3.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/instagram/instagram-4.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/instagram/instagram-5.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/instagram/instagram-6.jpg'
  },
  
  // Blog images
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/blog/blog-1.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/blog/blog-2.jpg'
  },
  { 
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/blog/blog-3.jpg'
  },
  
  // Product sale image
  {
    url: 'https://cdn.pixabay.com/photo/2019/12/24/08/25/pakistan-4716157_1280.jpg',
    path: 'img/shawls/product-sale.png'
  }
];

// Download all images
async function downloadAllImages() {
  for (const image of images) {
    try {
      await downloadImage(image.url, image.path);
    } catch (error) {
      console.error(`Error downloading ${image.path}:`, error.message);
    }
  }
  console.log('All downloads completed!');
}

downloadAllImages(); 