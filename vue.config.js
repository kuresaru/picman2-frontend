module.exports = {
    devServer: {
        port: 8089,
        proxy: {
            '/api': {
                target: 'http://localhost:8088',
                ws: true,
                changeOrigin: true,
                xfwd: true,
                headers: {
                    Host: "localhost:8089"
                }
            },
            '/login': {
                target: 'http://localhost:8088',
                xfwd: true,
                headers: {
                    Host: "localhost:8089"
                }
            }
        }
    }
}