import express from 'express';
import builder from 'xmlbuilder';

const router = express.Router();

// Route for dynamically generating the sitemap
router.get('/sitemap.xml', (req, res) => {
  // Replace these with actual data from your app or database
  const pages = [
    { url: 'https://gradflow.org/', lastmod: new Date().toISOString(), priority: 1.0 },
    { url: 'https://gradflow.org/#panel', lastmod: new Date().toISOString(), priority: 0.9 },
    { url: 'https://gradflow.org/#insights', lastmod: new Date().toISOString(), priority: 0.8 },
    { url: 'https://gradflow.org/#faq', lastmod: new Date().toISOString(), priority: 0.7 },
      // Add more URLs and priorities as needed
  ];

  // Build the XML for the sitemap
  const xml = builder.create('urlset', { encoding: 'UTF-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  // Loop through the pages and build each sitemap entry
  pages.forEach(page => {
    xml.ele('url')
      .ele('loc', page.url).up()
      .ele('lastmod', page.lastmod).up()
      .ele('changefreq', 'weekly').up()
      .ele('priority', page.priority).up();  // Use the priority from the page object
  });

  res.header('Content-Type', 'application/xml');
  res.send(xml.end({ pretty: true }));
});

export default router;  // Use ESM export
