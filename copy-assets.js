const fs = require('fs');
const path = require('path');

// Function to copy a directory recursively
const copyDir = (src, dest) => {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // Copy each entry
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Copy img directory to public/img
console.log('Copying img directory to public/img...');
copyDir('img', 'public/img');
console.log('Done copying img directory to public/img.');

// Check if other asset directories exist and copy them if they do
const assetDirs = ['css', 'js', 'fonts'];

assetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Copying ${dir} directory to public/${dir}...`);
    copyDir(dir, `public/${dir}`);
    console.log(`Done copying ${dir} directory to public/${dir}.`);
  } else {
    console.log(`${dir} directory not found.`);
  }
});

console.log('All assets copied to public directory.'); 