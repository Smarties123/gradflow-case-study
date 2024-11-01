// generate-sitemap.js (CommonJS version)
const fs = require('fs');
const path = require('path');
const builder = require('xmlbuilder');

// Replace these with actual data from your app or database
const pages = [
  { url: 'https://gradflow.org/', lastmod: new Date().toISOString(), priority: 1.0 },
  { url: 'https://gradflow.org/#panel', lastmod: new Date().toISOString(), priority: 0.9 },
  { url: 'https://gradflow.org/#insights', lastmod: new Date().toISOString(), priority: 0.8 },
  { url: 'https://gradflow.org/#faq', lastmod: new Date().toISOString(), priority: 0.7 },
];

// Build the XML for the sitemap
const xml = builder.create('urlset', { encoding: 'UTF-8' })
  .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

pages.forEach(page => {
  xml.ele('url')
    .ele('loc', page.url).up()
    .ele('lastmod', page.lastmod).up()
    .ele('changefreq', 'weekly').up()
    .ele('priority', page.priority).up();
});

// Write the XML to the build folder as sitemap.xml
const buildDir = path.resolve('./build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir); // Ensure the build folder exists
}
fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), xml.end({ pretty: true }));
console.log('Sitemap has been generated successfully in the build folder!');
