import { readFile } from 'fs/promises';
import http from 'http';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'src');

const server = http.createServer(async (req, res) => {
  // Simple static file server (so imports are from /)
  let file = req.url === '/' ? '/index.html' : req.url;
  if (file.startsWith('/tests')) {
    file = '../tests' + file.slice('/tests'.length);
  }
  const abs = path.join(root, file);
  try {
    const data = await readFile(abs);
    res.writeHead(200);
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise((resolve) => server.listen(8123, resolve));
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
page.on('console', (msg) => {
  const args = msg.args();
  Promise.all(args.map((a) => a.jsonValue())).then((vals) =>
    console[msg.type?.() || 'log'](...vals)
  );
});
await page.goto('http://localhost:8123/tests/qunit.html');
await page.waitForFunction(() => window.QUnit?.config?.doneCalled === true, { timeout: 30000 });
const result = await page.evaluate(() => ({
  failed: QUnit?.config?.stats?.bad || 0,
  passed: QUnit?.config?.stats?.all - QUnit?.config?.stats?.bad || 0,
  total: QUnit?.config?.stats?.all || 0,
}));
await browser.close();
server.close();
if (result.failed > 0 || result.total === 0) {
  console.error(`QUnit failed: ${result.failed}/${result.total} failing`);
  process.exit(1);
} else {
  console.log(`QUnit passed: ${result.passed}/${result.total}`);
}
