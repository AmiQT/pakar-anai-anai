#!/usr/bin/env node

/* ========================================
   KME Pest Control - Development Server
   Simple local server with proper routing
======================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Route mappings for clean URLs
const routes = {
    '/': '/index.html',
    '/about': '/pages/about.html',
    '/services': '/pages/services.html',
    '/contact': '/pages/contact.html',
    '/booking': '/pages/booking.html',
    '/testimoni': '/pages/testimoni.html',
    '/gallery': '/pages/gallery.html'
};

// Create server
const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    
    // Handle route mappings
    if (routes[pathname]) {
        pathname = routes[pathname];
    }
    
    // Construct file path
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Log request
    console.log(`${req.method} ${req.url} -> ${pathname}`);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Try with .html extension if not found
            if (!ext && pathname !== '/') {
                const htmlPath = filePath + '.html';
                fs.access(htmlPath, fs.constants.F_OK, (htmlErr) => {
                    if (htmlErr) {
                        serve404(res);
                    } else {
                        serveFile(htmlPath, 'text/html', res);
                    }
                });
            } else {
                serve404(res);
            }
            return;
        }
        
        serveFile(filePath, contentType, res);
    });
});

// Serve file function
function serveFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }
        
        // Set headers
        const headers = { 'Content-Type': contentType };
        
        // Add CORS headers for development
        if (contentType.includes('javascript') || contentType.includes('css')) {
            headers['Access-Control-Allow-Origin'] = '*';
        }
        
        // Cache static assets
        const ext = path.extname(filePath).toLowerCase();
        if (['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2'].includes(ext)) {
            headers['Cache-Control'] = 'public, max-age=3600';
        }
        
        res.writeHead(200, headers);
        res.end(data);
    });
}

// 404 handler
function serve404(res) {
    const notFoundPage = `
<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Halaman Tidak Dijumpai | KME Pest Control</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .error-code {
            font-size: 8rem;
            font-weight: 800;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            background: linear-gradient(45deg, #f97316, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #f97316, #f59e0b);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1>Halaman Tidak Dijumpai</h1>
        <p>Maaf, halaman yang anda cari tidak wujud atau telah dipindahkan.</p>
        <a href="/" class="btn">🏠 Kembali ke Homepage</a>
    </div>
</body>
</html>`;
    
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(notFoundPage);
}

// Start server
server.listen(PORT, HOST, () => {
    console.log('\n🚀 KME Pest Control - Development Server');
    console.log('==========================================');
    console.log(`🌐 Server: http://${HOST}:${PORT}`);
    console.log(`📁 Root: ${__dirname}`);
    console.log('🔄 Live reload: Manual refresh required');
    console.log('==========================================\n');
    
    // Auto-open browser
    const open = (url) => {
        const { exec } = require('child_process');
        const platform = process.platform;
        
        let command;
        if (platform === 'win32') {
            command = `start ${url}`;
        } else if (platform === 'darwin') {
            command = `open ${url}`;
        } else {
            command = `xdg-open ${url}`;
        }
        
        exec(command, (err) => {
            if (!err) {
                console.log(`🌐 Browser opened: ${url}\n`);
            }
        });
    };
    
    setTimeout(() => {
        open(`http://${HOST}:${PORT}`);
    }, 1000);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
