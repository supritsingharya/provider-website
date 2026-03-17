/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi-s3torage.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dreamprovider.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.shiksha.com',
        port: '',
        pathname: '/mediadata/images/**',
      },
      // --- ADD THIS NEW ONE ---
      {
        protocol: 'https',
        hostname: 'www.galgotiasuniversity.edu.in',
        port: '',
        pathname: '/public/uploads/media/**', // More specific pathname
      },
      // --- ADD THIS NEW ONE ---
      {
        protocol: 'https',
        hostname: 'www.classhud.com',
        port: '',
        pathname: '/assets/media/uploads/listing/cover_image/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kccitm.edu.in',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.collegedunia.com',
        port: '',
        pathname: '/public/**', // Using /public/** to catch all images under that path
      },
      {
        protocol: 'https',
        hostname: 'singheducation.co.in',
        port: '',
        pathname: '/images/CollegeImages/**',
      },
      {
        protocol: 'https',
        hostname: 'openthemagazine.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reviewadda.com',
        port: '',
        pathname: '/assets/uploads/article_images/**',
      }, {
        protocol: 'https',
        hostname: 'itsengg.edu.in',
        port: '',
        pathname: '/**', // Using a wildcard as it's at the root path
      },
      {
        protocol: 'https',
        hostname: 'www.helpforcareer.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.jagranjosh.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'sp-ao.shortpixel.ai',
        port: '',
        pathname: '/client/**',
      },
      {
        protocol: 'https',
        hostname: 'edufever.in',
        port: '',
        pathname: '/colleges/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.hindustantimes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nearestmetro.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.yourstory.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't4.ftcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.indianexpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.dreamprovider.in/:path*',
      },
    ];
  },
};

// Use module.exports for .js files

export default nextConfig; // This is correct for a .mjs file