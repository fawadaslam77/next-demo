/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals = [...config.externals, "bcrypt"];
        return config;
    },
    experimental: {
        serverComponentsExternalPackages: ['bcrypt']
    }
};

module.exports = nextConfig;
