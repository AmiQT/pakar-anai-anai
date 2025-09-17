/* ========================================
   KME Pest Control - Local Test Server
   Simple HTTP server for local development and testing
======================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

// MIME types for different file extensions
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
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Handle root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Handle clean URLs (without .html extension)
    if (!path.extname(pathname) && pathname !== '/') {
        pathname += '.html';
    }
    
    // Construct file path
    const filePath = path.join(__dirname, pathname);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} -> ${filePath}`);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found - serve 404
            serve404(res);
            return;
        }
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
                console.error(`Error reading file ${filePath}:`, err);
                return;
            }
            
            // Set CORS headers for API testing
            if (pathname.includes('/api/') || ext === '.js') {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            }
            
            // Set caching headers
            if (['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2'].includes(ext)) {
                res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
            }
            
            // Serve file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
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
        }
        .error-code {
            font-size: 8rem;
            font-weight: 800;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .btn {
            display: inline-block;
            background: #FF8C00;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: transform 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1>Halaman Tidak Dijumpai</h1>
        <p>Maaf, halaman yang anda cari tidak wujud atau telah dipindahkan.</p>
        <a href="/" class="btn">Kembali ke Homepage</a>
    </div>
</body>
</html>`;
    
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(notFoundPage);
}

// Start server
server.listen(PORT, HOST, () => {
    console.log('\n🚀 KME Pest Control - Local Test Server');
    console.log('=====================================');
    console.log(`🌐 Server running at: http://${HOST}:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('📊 Access logs will appear below...');
    console.log('=====================================\n');
    
    // Open browser automatically (optional)
    if (process.env.OPEN_BROWSER !== 'false') {
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
                    console.log(`🌐 Browser opened automatically`);
                }
            });
        };
        
        // Delay to ensure server is ready
        setTimeout(() => {
            open(`http://${HOST}:${PORT}`);
        }, 1000);
    }
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n\n🛑 Server shutting down...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
