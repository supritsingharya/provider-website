'use client';

import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import { FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Sample data for blog posts - now with imageUrl
// In a real application, this would likely come from a CMS or API
const blogPostsData = [
  {
    id: 1,
    title: 'Finding the Perfect Girls Hostel Near GL Bajaj Institute of Technology and Management: How a Provider App Can Helps',
    slug: '/blog',
    excerpt: 'Searching for suitable accommodation is a crucial aspect of a students life. Discover the importance of finding a suitable girls',
    imageUrl: '/blog1.avif', // Example image path
    imageAlt: 'Students in a hostel in Varanasi',
    category: 'Accommodation',
    gradient: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    id: 2,
    title: 'Unlocking the Best Girls Hostels near Galgotias University, Greater Noida: Your Path to Comfortable and Convenient Living',
    slug: '/blog',
    excerpt: 'Are you a student searching for the ideal girls hostel near Galgotias University? We delve into the world of provider apps and',
    imageUrl: '/blog2.png', // Example image path
    imageAlt: 'Map of Delhi with location pins',
    category: 'Safety Guide',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 3,
    title: 'The Ultimate Guide for owners to list their Hostel, PG, Flat, or Rooms: How to Grow Your Business with Minimal Effort',
    slug: '/blog',
    excerpt: 'As a hostel, PG, or room owner, finding tenants can be daunting. Learn how provider apps can help you stand out',
    imageUrl: '/blog3.jpg', // Example image path
    imageAlt: 'Students collaborating during an internship',
    category: 'Career',
    gradient: 'from-green-500/20 to-teal-500/20',
  },
];

const BlogCard = ({ post, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(card, {
        rotationY: ((x - rect.width / 2) / rect.width) * 10,
        rotationX: -((y - rect.height / 2) / rect.height) * 10,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={post.slug}>
        <div
          ref={cardRef}
          className="block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-left h-full flex flex-col overflow-hidden border border-gray-100 transform perspective-1000"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

          {/* Image Container with Gradient Overlay */}
          <div className="relative w-full h-48 sm:h-56 overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.imageAlt || post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-sm font-bold rounded-full">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content Container */}
          <div className="p-6 flex flex-col flex-grow relative">
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm flex-grow font-medium">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
              Read More
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const GuidesAndResources = () => {
  const postsToPreview = blogPostsData.slice(0, 3);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.floating-bg', {
        y: 30,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Background Elements */}
        <div className="floating-bg absolute top-20 left-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="floating-bg absolute bottom-20 right-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="floating-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
            Guides & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Resources</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Discover helpful guides and resources to make your student life easier
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {postsToPreview.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/blog">
            <button
              type="button"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FaBookOpen className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              View All Articles
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GuidesAndResources;