'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import MaxWidthWrapper from '../../components/MaxWidthWrapper';
import Footer from '../../components/Footer';
import blogData from '../blogData.json';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const post = blogData.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-4xl text-gray-400">📝</span>
          </div>
          <p className="text-2xl text-gray-600 mb-4">Blog post not found</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section with Background Pattern */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300"></div>
        </div>
        
        <MaxWidthWrapper>
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="relative pt-8 pb-8"
          >
           

            {/* Article Header */}
            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={fadeIn}
                className="mb-2"
              >
                {/* Category Badge */}
                {post.category && (
                  <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full mb-4">
                    {post.category}
                  </span>
                )}
                
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-700 to-blue-700 leading-tight">
                  {post.title}
                </h1>

                {/* Subtitle/Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
                    {post.excerpt}
                  </p>
                )}
              </motion.div>

              {/* Meta Information */}
              <motion.div
                variants={fadeIn}
                className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4"
              >
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                )}
                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </div>

      {/* Main Content */}
      <MaxWidthWrapper>
        <div className="max-w-4xl mx-auto pb-20">
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative mb-16"
          >
            <div className="relative h-[28rem] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="priority"
              />
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Content Wrapper with Better Typography */}
            <div className="prose prose-lg lg:prose-xl max-w-none">
              <div 
                className="text-gray-700 leading-relaxed space-y-6"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {post.content?.split('\n\n').map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="mb-6"
                    dangerouslySetInnerHTML={{
                      __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-xl font-bold text-gray-900">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Article Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 pt-12 border-t border-gray-200"
          >
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to explore more?
              </h3>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Discover more insights and stories in our blog collection.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                  View All Posts
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </MaxWidthWrapper>

      <Footer />
    </div>
  );
};

export default BlogPost;