const http = require('http');
const https = require('https');

const WORKER = 'cedofy-storefront.lokpemarcdonald.workers.dev';

const server = http.createServer((req, res) => {
  const host = req.headers['host'] || '';
  const opts = {
    hostname: WORKER,
    port: 443,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, 'host': host, 'x-forwarded-host': host }
  };
  const proxy = https.request(opts, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  proxy.on('error', (e) => { res.writeHead(502); res.end(e.message); });
  req.pipe(proxy);
});

server.listen(process.env.PORT || 3000, () => console.log('Proxy OK'));
