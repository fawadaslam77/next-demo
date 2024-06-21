/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.externals = [...config.externals, "bcrypt"];
        return config;
    },
    experimental: {
        serverComponentsExternalPackages: ['bcrypt', 'pg']
    },
    typescript: {
        ignoreBuildErrors: true
    }
};

module.exports = nextConfig;
