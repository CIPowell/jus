module.exports = {
    //server:
    //{
        options: {
            port: 8000,
            base: 'app',
            keepalive: true,
            middleware: function (connect, options) {
                 var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                 return [
                    // Include the proxy first
                    proxy,
                    // Serve static files.
                    connect.static(options.base),
                    // Make empty directories browsable.
                    connect.directory(options.base)
                 ];
            }
        },
        proxies: [
            {
                context : '/uploader',
                host: '127.0.0.1',
                port : 3000,
                https: false,
                changeOrigin: true,
                xforward: false,
            }
        ],
    //}
}


