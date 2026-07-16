const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.mp3': 'audio/mpeg'
};

http.createServer((req, res) => {
    // Normalize URL path
    let reqPath = req.url.split('?')[0];
    let filePath = path.join(PUBLIC_DIR, reqPath === '/' ? 'index.html' : reqPath);
    
    // Safety check to prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Serve index.html as fallback for clean routing if needed, or simply 404
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
            res.end(content);
        }
    });
}).listen(PORT, () => {
    console.log(`Server successfully started at http://localhost:${PORT}/`);
});
