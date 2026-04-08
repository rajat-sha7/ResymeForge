import { NextResponse } from 'next/server';

// NOTE: This route expects a POST request with a JSON body: { html: string }
// It uses Puppeteer to render the provided HTML and return a PDF buffer.
// Install puppeteer in your project to use this route:
// npm install puppeteer

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const html = body.html;
    const url = body.url;
    if (!html && !url) return NextResponse.json({ error: 'Missing html or url in request body' }, { status: 400 });
    // If an external PDF worker is configured, proxy the request to it to avoid CORS
    // and offload CPU-heavy rendering. Use server-side env var `PDF_WORKER_URL`.
    const workerBase = process.env.PDF_WORKER_URL || null;
    if (workerBase) {
      const target = `${workerBase.replace(/\/$/, '')}/generate-pdf`;
      try {
        const forwardRes = await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, html, format: body.format || 'A4', margin: body.margin }),
        });

        const contentType = forwardRes.headers.get('content-type') || 'application/octet-stream';
        const disposition = forwardRes.headers.get('content-disposition') || 'attachment; filename="resume.pdf"';

        const arrayBuffer = await forwardRes.arrayBuffer();
        return new Response(arrayBuffer, {
          status: forwardRes.status,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': disposition,
          },
        });
      } catch (err: any) {
        return NextResponse.json({ error: `Failed to proxy to PDF worker: ${err?.message || String(err)}` }, { status: 502 });
      }
    }

    // No external worker configured — fall back to local Puppeteer rendering.
    let puppeteer: any;
    try {
      puppeteer = await import('puppeteer');
    } catch (err) {
      return NextResponse.json({ error: 'Puppeteer not installed. Run `npm install puppeteer`.' }, { status: 500 });
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Provide a base URL so relative asset links resolve (if any).
    if (url) {
      // Navigate to the provided URL and let the page render fully.
      await page.goto(url, { waitUntil: 'networkidle0' });
      // Wait briefly for any client-side rendering to settle.
      await new Promise((resolve) => setTimeout(resolve, 250));
    } else {
      // Render the provided HTML directly.
      await page.setContent(html, { waitUntil: 'networkidle0' });
    }

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' } });
    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
