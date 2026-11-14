import { NextResponse } from 'next/server';
import fs from 'fs';
import type { Browser } from 'puppeteer';

export const runtime = 'nodejs';

// POST { resume: ResumeData, enabledSections?: SectionType[] } -> application/pdf
//
// The PDF is rendered from this app's own /public-preview page, which uses the same
// template components as the in-app preview, so the download matches what users see.
// Only resume data is accepted: arbitrary URLs/HTML are rejected so this endpoint
// cannot be used to make the server fetch other sites.

const MAX_BODY_BYTES = 1_000_000;

const PDF_OPTIONS = {
  format: 'A4' as const,
  printBackground: true,
  margin: { top: '10mm', right: '0mm', bottom: '10mm', left: '0mm' },
};

// Used when Puppeteer's bundled Chrome is missing (e.g. an interrupted download).
const SYSTEM_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const globalForPdf = globalThis as unknown as { __pdfBrowser?: Promise<Browser> };

async function launchBrowser(): Promise<Browser> {
  const puppeteer = (await import('puppeteer')).default;
  const args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
  try {
    return await puppeteer.launch({ args });
  } catch (bundledError) {
    const executablePath = SYSTEM_CHROME_PATHS.find((p) => fs.existsSync(p));
    if (!executablePath) throw bundledError;
    return puppeteer.launch({ args, executablePath });
  }
}

/** Reuses one headless browser across requests; relaunches it if it has died. */
async function getBrowser(): Promise<Browser> {
  const existing = globalForPdf.__pdfBrowser;
  if (existing) {
    try {
      const browser = await existing;
      if (browser.connected) return browser;
    } catch {
      /* fall through and relaunch */
    }
  }
  const launching = launchBrowser();
  globalForPdf.__pdfBrowser = launching;
  launching.catch(() => {
    if (globalForPdf.__pdfBrowser === launching) globalForPdf.__pdfBrowser = undefined;
  });
  return launching;
}

const toBase64 = (value: unknown) => Buffer.from(JSON.stringify(value), 'utf8').toString('base64');

export async function POST(request: Request) {
  let payload: { resume?: unknown; enabledSections?: unknown };
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Resume data is too large.' }, { status: 413 });
    }
    payload = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { resume, enabledSections } = payload || {};
  if (!resume || typeof resume !== 'object' || Array.isArray(resume)) {
    return NextResponse.json({ error: 'Missing resume data.' }, { status: 400 });
  }
  if (enabledSections !== undefined && !Array.isArray(enabledSections)) {
    return NextResponse.json({ error: 'enabledSections must be an array.' }, { status: 400 });
  }
  const exportPayload = { resume, enabledSections };

  const origin = process.env.APP_ORIGIN?.replace(/\/$/, '') || new URL(request.url).origin;
  const previewUrl = `${origin}/public-preview`;

  // Optional external worker (see docker-worker/). It renders the same page by URL.
  const workerBase = process.env.PDF_WORKER_URL;
  if (workerBase) {
    try {
      const url = `${previewUrl}?data=${encodeURIComponent(toBase64(exportPayload))}`;
      const res = await fetch(`${workerBase.replace(/\/$/, '')}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format: PDF_OPTIONS.format, margin: PDF_OPTIONS.margin }),
      });
      return new Response(await res.arrayBuffer(), {
        status: res.status,
        headers: {
          'Content-Type': res.headers.get('content-type') || 'application/pdf',
          'Content-Disposition': 'attachment; filename="resume.pdf"',
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: `PDF worker unavailable: ${message}` }, { status: 502 });
    }
  }

  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.evaluateOnNewDocument((data) => {
      (window as unknown as { __RESUME_EXPORT__: unknown }).__RESUME_EXPORT__ = data;
    }, exportPayload);
    await page.goto(previewUrl, { waitUntil: 'networkidle0', timeout: 30_000 });
    await page.waitForSelector('body[data-resume-ready="true"]', { timeout: 15_000 });
    await page.evaluate(() => document.fonts.ready);

    const pdf = await page.pdf(PDF_OPTIONS);
    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('PDF export failed:', message);
    const hint = /Could not find Chrome|Failed to launch/i.test(message)
      ? 'No Chrome browser available for PDF rendering. Run `npx puppeteer browsers install chrome`.'
      : message;
    return NextResponse.json({ error: hint }, { status: 500 });
  } finally {
    if (page) await page.close().catch(() => {});
  }
}
