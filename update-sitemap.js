const fs = require('fs');
const baseUrl = 'https://alexchalu.github.io/healthcalcs/';
const today = new Date().toISOString().split('T')[0];

const files = fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.html'))
  .sort();

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

files.forEach(file => {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${baseUrl}${file}</loc>\n`;
  sitemap += `    <lastmod>${today}</lastmod>\n`;
  sitemap += `    <changefreq>weekly</changefreq>\n`;
  sitemap += `    <priority>0.8</priority>\n`;
  sitemap += `  </url>\n`;
});

sitemap += '</urlset>';

fs.writeFileSync('sitemap.xml', sitemap);
console.log(`✅ Updated sitemap with ${files.length} pages`);
