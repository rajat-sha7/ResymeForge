const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/generate-pdf', async (req, res) => {
  const { url, html, format = 'A4', margin } = req.body || {};
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    if (url) {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    } else {
      const content = html || '<html><body></body></html>';
      await page.setContent(content, { waitUntil: 'networkidle0' });
    }

    const pdfBuffer = await page.pdf({
      format,
      printBackground: true,
      margin: margin || { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: err?.message || String(err) });
  } finally {
    if (browser) {
      try { await browser.close(); } catch (e) { /* ignore */ }
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Resume PDF worker listening on port ${PORT}`);
});
