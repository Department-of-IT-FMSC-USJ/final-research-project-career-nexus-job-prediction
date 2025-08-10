/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from specific IPs or hosts in development
  allowedDevOrigins: [
    "http://192.168.1.16", // Allow requests from this IP
    "http://localhost:3000", // Allow requests from localhost (common for dev)
    // Add other origins if needed, e.g., "http://192.168.1.x" or "http://your-domain.com"
  ],
  
};

module.exports = nextConfig;