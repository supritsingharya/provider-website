'use client'

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const gsapContext = useRef(null);

  const curveDepth = 15; // Pixels for the depth of the curve at the sides
  // Path for a curved bottom edge
  const clipPathValue = `path('M0 0 H100% Vcalc(100% - ${curveDepth}px) Q50% 100% 0 calc(100% - ${curveDepth}px) Z')`;

  // Initial Navbar Animation
  useEffect(() => {
    if (!navRef.current) return;

    gsapContext.current = gsap.context(() => {
      gsap.from(navRef.current, {
        // Ensure it animates from completely above, considering potential full height
        y: `-${navRef.current.getBoundingClientRect().height + curveDepth}px`,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    return () => {
      if (gsapContext.current) {
        gsapContext.current.revert();
      }
    };
  }, [curveDepth]); // Recalculate if curveDepth changes

  // Mobile Menu Animation
  useEffect(() => {
    if (!menuRef.current) return;

    const menuAnimation = gsap.to(menuRef.current, {
      height: isOpen ? 'auto' : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.4,
      ease: 'power2.out',
      onStart: () => {
        if (isOpen && menuRef.current) {
          menuRef.current.style.display = 'block';
        }
      },
      onComplete: () => {
        if (!isOpen && menuRef.current) {
          menuRef.current.style.display = 'none';
        }
      }
    });

    return () => {
      menuAnimation.kill();
    };
  }, [isOpen]);

  // Scroll Listener for Sticky Navbar Styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClasses = "cursor-pointer hover:text-purple-600 transition-colors duration-200";

  // Define drop shadow styles
  // These are simpler versions, you can make them more complex to match Tailwind's multi-part shadows if needed
  const shadowNormal = 'drop-shadow(0 4px 6px rgba(0,0,0,0.07))';
  const shadowScrolled = 'drop-shadow(0 10px 15px rgba(0,0,0,0.07))';

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleDownloadApp = () => {
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent || navigator.vendor || window.opera : '';
    if (/android/i.test(userAgent)) {
      window.open('https://play.google.com/store/apps/details?id=provider.in', '_blank');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.open('https://apps.apple.com/in/app/provider-app-search-hostel-pg/id1659063733', '_blank');
    } else {
      window.open('https://play.google.com/store/apps/details?id=provider.in', '_blank');
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <nav
      ref={navRef}
      style={{
        clipPath: clipPathValue,
        WebkitClipPath: clipPathValue, // For Safari compatibility
        filter: isScrolled ? shadowScrolled : shadowNormal,
      }}
      className={`
        sticky top-0 w-full
        py-1 px-4 sm:px-6 lg:px-8
        flex justify-between items-center
        z-[999] transition-all duration-300 ease-in-out
        rounded-t-xl 
        ${isScrolled
          ? 'bg-white/90 backdrop-blur-lg'
          : 'bg-white'
        }
      `}
    >
      {/* Logo */}
      <Link href="/" onClick={handleLinkClick}>
        <div>
          <img className="h-12 sm:h-14 transition-all duration-300" src="/lofo.png" alt="Provider Logo" />
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center">
        <ul className="flex gap-6 lg:gap-8 text-sm font-medium text-gray-700">
          <li><Link href="/" className={navLinkClasses}>Home</Link></li>
          <li><Link href="/property" className={navLinkClasses}>Properties</Link></li>
          <li><Link href="/college" className={navLinkClasses}>College</Link></li>
          <li><Link href="/blog" className={navLinkClasses}>Blogs</Link></li>
          <li><Link href="/about-us" className={navLinkClasses}>About Us</Link></li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <Link href="/profile">
            <button
              className="px-5 py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              style={{ filter: 'drop-shadow(0 2px 3px rgba(107,33,168,0.3))' }}
            >
              Profile
            </button>
          </Link>
        ) : (
          <button
            onClick={handleLogin}
            className="px-5 py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            style={{ filter: 'drop-shadow(0 2px 3px rgba(107,33,168,0.3))' }}
          >
            Login
          </button>
        )}
      </div>

      {/* Hamburger for Mobile */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-700 hover:text-purple-600 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        style={{ display: 'none', height: 0, opacity: 0 }}
        className="absolute top-full left-0 w-full bg-white md:hidden shadow-xl border-t border-gray-200 rounded-b-xl"
      >
        <ul className="flex flex-col items-center gap-5 py-8 text-base font-medium text-gray-700">
          <li><Link href="/" className={navLinkClasses} onClick={handleLinkClick}>Home</Link></li>
          <li><Link href="/property" className={navLinkClasses} onClick={handleLinkClick}>Property</Link></li>
          <li><Link href="/college" className={navLinkClasses} onClick={handleLinkClick}>College</Link></li>
          {/* <li><Link href="/blogs" className={navLinkClasses} onClick={handleLinkClick}>Blogs</Link></li> */}
          <li><Link href="/about-us" className={navLinkClasses} onClick={handleLinkClick}>About Us</Link></li>
          <div className="flex flex-col gap-4 w-4/5 max-w-xs pt-4 mt-4 border-t border-gray-200">
            {user ? (
              <Link href="/profile" onClick={handleLinkClick} className="w-full">
                <button
                  className="w-full px-5 py-3 text-sm font-semibold text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors duration-200"
                >
                  Profile
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full px-5 py-3 text-sm font-semibold text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;