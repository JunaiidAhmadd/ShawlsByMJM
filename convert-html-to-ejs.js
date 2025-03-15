const fs = require('fs');
const path = require('path');

// List of HTML files to convert
const htmlFiles = [
  'about.html',
  'blog-details.html',
  'blog.html',
  'checkout.html',
  'contact.html',
  'shop-details.html',
  'shop.html',
  'shopping-cart.html'
];

// Function to convert HTML to EJS
const convertHtmlToEjs = (htmlFile) => {
  const fileName = path.basename(htmlFile, '.html');
  const ejsFile = `views/${fileName}.ejs`;
  
  // Read HTML file
  fs.readFile(htmlFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${htmlFile}:`, err);
      return;
    }
    
    // Extract main content (between header and footer)
    const headerEndPattern = /<\/header>[\s\S]*?<!-- Header Section End -->/i;
    const footerStartPattern = /<!-- Footer Section Begin -->/i;
    
    const headerEndMatch = data.match(headerEndPattern);
    const footerStartMatch = data.match(footerStartPattern);
    
    if (!headerEndMatch || !footerStartMatch) {
      console.error(`Could not extract main content from ${htmlFile}`);
      return;
    }
    
    const headerEndIndex = data.indexOf(headerEndMatch[0]) + headerEndMatch[0].length;
    const footerStartIndex = data.indexOf(footerStartMatch[0]);
    
    // Get main content
    let content = data.substring(headerEndIndex, footerStartIndex).trim();
    
    // Replace relative paths with absolute paths
    content = content.replace(/src="img\//g, 'src="/img/');
    content = content.replace(/src="css\//g, 'src="/css/');
    content = content.replace(/src="js\//g, 'src="/js/');
    content = content.replace(/href="css\//g, 'href="/css/');
    content = content.replace(/href="js\//g, 'href="/js/');
    content = content.replace(/data-setbg="img\//g, 'data-setbg="/img/');
    
    // Replace links to HTML files with EJS routes
    content = content.replace(/href="\.\/index.html"/g, 'href="/"');
    content = content.replace(/href="\.\/shop.html"/g, 'href="/shop"');
    content = content.replace(/href="\.\/shop-details.html"/g, 'href="/shop-details"');
    content = content.replace(/href="\.\/shopping-cart.html"/g, 'href="/shopping-cart"');
    content = content.replace(/href="\.\/checkout.html"/g, 'href="/checkout"');
    content = content.replace(/href="\.\/about.html"/g, 'href="/about"');
    content = content.replace(/href="\.\/blog.html"/g, 'href="/blog"');
    content = content.replace(/href="\.\/blog-details.html"/g, 'href="/blog-details"');
    content = content.replace(/href="\.\/contact.html"/g, 'href="/contact"');
    
    // Create EJS file with header and footer includes
    const ejsContent = `<%- include('partials/header') %>\n\n${content}\n\n<%- include('partials/footer') %>`;
    
    // Write EJS file
    fs.writeFile(ejsFile, ejsContent, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing ${ejsFile}:`, err);
        return;
      }
      console.log(`Converted ${htmlFile} to ${ejsFile}`);
    });
  });
};

// Convert each HTML file to EJS
htmlFiles.forEach(convertHtmlToEjs);

console.log('Conversion process started. Check the views directory for the EJS files.'); 