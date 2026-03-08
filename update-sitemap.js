const fs = require('fs');

const getAllHtmlFiles = (dir, baseDir = '') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  
  for (const entry of entries) {
    const fullPath = `${dir}/${entry.name}`;
    const relativePath = baseDir ? `${baseDir}/${entry.name}` : entry.name;
    
    if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules') {
      files = files.concat(getAllHtmlFiles(fullPath, relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(relativePath);
    }
  }
  
  return files;
};

const htmlFiles = getAllHtmlFiles('.');
const baseUrl = 'https://alexchalu.github.io/healthcalcs';

const urls = htmlFiles
  .filter(file => !file.includes('google'))
  .map(file => {
    const path = file === 'index.html' ? '' : file.replace('index.html', '');
    const url = `${baseUrl}/${path}`;
    const priority = file === 'index.html' ? '1.0' : file.startsWith('state/') ? '0.8' : '0.9';
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log(`✅ Sitemap updated with ${htmlFiles.length} pages`);
