import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
