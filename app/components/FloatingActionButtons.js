'use client';

import { useState, useEffect } from 'react';

const FloatingActionButtons = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get all sections on the page
      const sections = document.querySelectorAll('section');
      
      if (sections.length >= 2) {
        // Get the second section
        const secondSection = sections[1];
        const secondSectionBottom = secondSection.offsetTop + secondSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // Show back to top button only when scrolled past the second section
        setShowBackToTop(scrollPosition > secondSectionBottom);
      } else {
        // Fallback: show after scrolling 100vh (2 viewport heights)
        setShowBackToTop(window.scrollY > window.innerHeight * 2);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Back to Top - Top of screen */}
      {showBackToTop && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-top-2 duration-300">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300"
            aria-label="Back to Top"
          >
            {/* Up Arrow SVG */}
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm font-medium text-slate-700 ">TO TOP</span>
          </button>
        </div>
      )}
      
      {/* Contact buttons - Bottom right */}
      <div className="fixed bottom-4 right-2 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 sm:gap-4">
        {/* WhatsApp */}
        <a
          href="https://wa.me/+917303831326" // TODO: Replace with WhatsApp link
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 shadow-lg rounded-full hover:bg-green-600 transition relative"
          aria-label="Talk on WhatsApp"
        >
          <span className="absolute -top-8 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs rounded px-2 py-1 transition pointer-events-none whitespace-nowrap">Talk on WhatsApp</span>
          {/* WhatsApp SVG */}
          <svg width="24" height="24" className="sm:w-7 sm:h-7" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.37L4 29l7.824-2.05A12.94 12.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.84-.58-5.4-1.58l-.38-.24-4.64 1.22 1.24-4.52-.25-.39A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.29-7.71c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2-.17-.29-.02-.44.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.19 2.03 3.1 4.93 4.22.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" className="text-white" />
          </svg>
        </a>
        {/* Call */}
        <a
          href="tel:+917303831326" // TODO: Replace with tel: link
          className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 shadow-lg rounded-full hover:bg-blue-600 transition relative"
          aria-label="Talk on Call"
        >
          <span className="absolute -top-8 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs rounded px-2 py-1 transition pointer-events-none whitespace-nowrap">Talk on Call</span>
          {/* Phone SVG */}
          <svg width="24" height="24" className="sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V21a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h4.09a2 2 0 012 1.72c.13 1.13.37 2.22.72 3.26a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c1.04.35 2.13.59 3.26.72A2 2 0 0122 16.92z" className="text-white" />
          </svg>
        </a>
      </div>
    </>
  );
};

export default FloatingActionButtons;