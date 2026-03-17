'use client'; // This component uses client-side state (useState)

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    id: 1,
    question: 'How is my booking confirmed?',
    answer:
      'Once you complete your booking and payment, you will receive a confirmation email and SMS with all the details of your booking, including the hostel address and contact information. You can also view your booking status in the "My Bookings" section of the app.',
  },
  {
    id: 2,
    question: 'Can I cancel my booking?',
    answer:
      'Yes, you can cancel your booking. The cancellation policy varies depending on the hostel. Please check the specific hostel\'s cancellation policy at the time of booking or in your confirmation details. Some bookings may be non-refundable or have a cancellation fee.',
  },
  {
    id: 3,
    question: 'What if the hostel denies entry?',
    answer:
      'In the rare event that a hostel denies entry despite a confirmed booking, please contact our customer support immediately. We will assist you in resolving the issue or finding alternative accommodation. Ensure you have your booking confirmation readily available.',
  },
  {
    id: 4,
    question: 'What is the refund process?',
    answer:
      'If your booking is eligible for a refund as per the cancellation policy, the refund will be processed to your original mode of payment. It typically takes 5-7 business days for the amount to reflect in your account, depending on your bank.',
  },
  {
    id: 5,
    question: 'Is it safe to pay online?',
    answer:
      'Absolutely. We use industry-standard encryption and secure payment gateways to ensure all your online transactions are safe and protected. Your financial information is never stored on our servers.',
  },
  {
    id: 6,
    question: 'Do I get contact details of the hostel?',
    answer:
      'You can easily access the owner’s contact details and the hostel’s GPS location directly in the app.',
  },
];

const FAQItem = ({ faq, isOpen, toggleFAQ }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-4 overflow-hidden border border-gray-100"
    >
      <button
        onClick={toggleFAQ}
        className="flex justify-between items-center w-full text-left p-6 focus:outline-none hover:bg-gray-50/50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {faq.question}
        </h3>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <FaChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <FaChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  // To manage which FAQ is open.
  // null means all are closed, or you can store the id of the open one.
  // For allowing multiple open, you'd need an array or object.
  // Here, we'll manage individual state within each mapped item for simplicity
  // OR, manage a single open item like this:
  const [openFAQId, setOpenFAQId] = useState(null);

  const handleToggleFAQ = (id) => {
    setOpenFAQId(openFAQId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-20 overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
      {/* Enhanced Background Texture */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-100/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Dots Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
            Frequently Asked <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services and booking process
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqData.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openFAQId === faq.id}
              toggleFAQ={() => handleToggleFAQ(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;