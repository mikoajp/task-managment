import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },

    eslint: {
        ignoreDuringBuilds: true,
    },

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://recruitment-task.jakubcloud.pl/:path*',
            },
        ];
    },
};

export default nextConfig;
