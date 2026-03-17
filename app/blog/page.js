'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import Footer from '../components/Footer';
import blogData from './blogData.json';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Get unique categories from blog data
  const categories = ['All', ...new Set(blogData.map(post => post.category).filter(Boolean))];
  
  // Filter posts based on search and category
  const filteredPosts = blogData.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      
      {/* Main content area that will grow to push the footer down */}
      <main className="flex-grow">
        
        {/* The container with the problematic styles is now just for the background */}
        <div className="relative overflow-hidden">
          {/* Background decorative elements (no longer affect the footer) */}
          <div className="absolute inset-0">
            <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-300"></div>
            <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
          </div>

      <MaxWidthWrapper>
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="py-20 relative z-10"
        >
          {/* Header Section */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                Latest Stories & Insights
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-700 to-blue-700 leading-tight">
                Our Blog
              </h1>
              <p className="text-xl md:text-2xl max-w-4xl mx-auto font-light text-gray-600 leading-relaxed">
                Discover insights, tips, and stories from the world of student accommodation and beyond.
              </p>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto mt-12"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  
                 
                </div>
              </div>
            </motion.div>
          </div>

          {/* Results Counter */}
          {(searchTerm || selectedCategory !== 'All') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <p className="text-gray-600">
                Found <span className="font-semibold text-purple-600">{filteredPosts.length}</span> article{filteredPosts.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
              </p>
            </motion.div>
          )}

          {/* Blog Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-300 border border-white/50"
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-sm font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 lg:p-8 flex flex-col flex-grow">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      {post.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                      )}
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} min</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300 leading-tight">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow line-clamp-3">
                      {post.snippet}
                    </p>
                    
                    {/* Author */}
                    {post.author && (
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {post.author.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">By {post.author}</span>
                      </div>
                    )}
                    
                    {/* Read More Button */}
                    <Link
                      href={`/blog/${post.id}`}
                      className="group/btn mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-base font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or browse all articles.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Clear filters
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          
        </motion.section>
      </MaxWidthWrapper>
       </div>
      </main>
      <Footer/>
    </div>
  );
};

export default Blog;