/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack is usually opted-in via CLI, but we can ensure experimental features are off
  experimental: {
    // turbo: false // This is not a standard config option yet, but keeping it simple
  }
};

module.exports = nextConfig;
