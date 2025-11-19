import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(publicDir, url);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      serveFile(path.join(publicDir, 'index.html'), res);
      return;
    }
    serveFile(filePath, res);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`SecuroServ dashboard disponível em http://localhost:${port}`);
});
