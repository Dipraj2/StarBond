module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // Add your image domains here
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL, // Ensure to set this in your .env file
  },
};