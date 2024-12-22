import { createProxyMiddleware } from 'http-proxy-middleware';

export const apiProxy = createProxyMiddleware({
    target: 'https://recruitment-task.jakubcloud.pl',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '',
    },
});