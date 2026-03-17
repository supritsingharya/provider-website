'use client';

import CountUp from 'react-countup';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

const Hero = () => {
  const textRef = useRef(null);
  const statsRef = useRef(null);
  const imageContainerRef = useRef(null);
  const floatingRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Initialize animations only once
  useEffect(() => {
    setIsMounted(true);
    setIsLoaded(true);

    const tl = gsap.timeline({ 
      defaults: { ease: 'power3.out', duration: 1.2 }
    });

    if (textRef.current?.children) {
      tl.from(textRef.current.children, { 
        opacity: 0, 
        y: 60, 
        stagger: 0.15,
        clearProps: "all" 
      });
    }

    if (statsRef.current?.children) {
      tl.from(statsRef.current.children, { 
        opacity: 0, 
        y: 40, 
        scale: 0.8, 
        stagger: 0.1,
        clearProps: "all"
      }, '-=0.6');
    }

    if (imageContainerRef.current) {
      tl.from(imageContainerRef.current, { 
        opacity: 0, 
        scale: 0.85, 
        rotation: 3,
        clearProps: "all"
      }, '-=0.8');
    }

    // Floating animations
    if (floatingRef.current?.children) {
      gsap.to(floatingRef.current.children, {
        y: -20,
        rotation: 360,
        duration: 8,
        ease: 'none',
        repeat: -1,
        stagger: 0.5,
        yoyo: true
      });

      gsap.to(floatingRef.current.children, {
        scale: 1.1,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.2
      });
    }

    return () => {
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf("*");
      }
    };
  }, []); // Empty dependency array to run only once

  // Separate effect for mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update parallax effect when mouse moves
  useEffect(() => {
    if (isMounted) {
      gsap.to('.parallax-bg', {
        x: mousePosition.x,
        y: mousePosition.y,
        duration: 1,
        ease: 'power2.out'
      });
    }
  }, [mousePosition, isMounted]);

  const handleDownloadApp = () => {
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent || navigator.vendor || window.opera : '';
    if (/android/i.test(userAgent)) {
      // Redirect to Google Play Store
      window.open('https://play.google.com/store/apps/details?id=provider.in', '_blank');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // Redirect to Apple App Store
      window.open('https://apps.apple.com/in/app/provider-app-search-hostel-pg/id1659063733', '_blank');
    } else {
      // Desktop fallback: redirect to Play Store
      window.open('https://play.google.com/store/apps/details?id=provider.in', '_blank');
    }
  };

  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="flex items-center justify-center min-h-screen ">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 ">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden" ref={floatingRef}>
        <div className="parallax-bg absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200/40 to-indigo-300/40 rounded-full blur-xl transform transition-transform duration-300"></div>
        <div className="parallax-bg absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-300/40 rounded-full blur-2xl transform transition-transform duration-300"></div>
        <div className="parallax-bg absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-200/40 to-blue-400/30 rounded-full blur-xl transform transition-transform duration-300"></div>
        <div className="parallax-bg absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-indigo-300/50 to-purple-400/40 rounded-full blur-lg transform transition-transform duration-300"></div>
        
        {/* New animated elements */}
        <div className="parallax-bg absolute top-1/2 left-1/3 w-28 h-28 bg-gradient-to-br from-green-200/30 to-teal-300/40 rounded-full blur-xl animate-pulse"></div>
        <div className="parallax-bg absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-orange-200/30 to-red-300/40 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Enhanced Geometric Pattern Overlay */}
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
      
      <section className="relative pt-0 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div ref={textRef} className="relative z-10 space-y-6">
              
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-300 mt-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-700 tracking-wide">
                  🏠 India's #1 Student Housing Platform
                </span>
              </div>
              
              {/* Main Heading with enhanced animation */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                  <span className="block bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                 </span>
                  
                </h1>
                
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:w-28 transition-all duration-300"></div>
              </div>
              
              {/* Enhanced Subtitle */}
              <div className="space-y-3 max-w-2xl">
                {/* <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 leading-relaxed hover:text-blue-600 transition-colors duration-300">
                  Discover Verified Hostels, PGs & Flats Near Your College
                </h2> */}
                
                <div className="flex flex-wrap items-center gap-2 text-base md:text-lg font-medium">
                  <span className="text-gray-600">Find</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg font-semibold hover:scale-110 hover:shadow-lg transition-all duration-300">
                    Hostels
                  </span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-lg font-semibold hover:scale-110 hover:shadow-lg transition-all duration-300">
                    PGs
                  </span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded-lg font-semibold hover:scale-110 hover:shadow-lg transition-all duration-300">
                    Flats
                  </span>
                  <span className="text-gray-600 font-semibold">& More</span>
                </div>
              </div>
              
              {/* Enhanced Description */}
              <div className="space-y-3 text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                <div className="relative">
                  A one-stop solution to every{' '}
                  <span className="font-semibold text-blue-600 relative group inline-block">
                    student problem
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-transparent group-hover:w-full transition-all duration-300"></div>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>trusted by</span>
                  <span className="font-black text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                    <CountUp 
                      end={50000} 
                      duration={1.5} 
                      separator="," 
                      enableScrollSpy={false}
                      startOnMount={true}
                    />+
                  </span>
                  <span>students</span>
                  <span className="text-xl animate-bounce">🎉</span>
                </div>
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 items-center sm:items-start justify-center sm:justify-start">
                <button 
                  type="button"
                  onClick={handleDownloadApp}
                  suppressHydrationWarning
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Video and Feature Boxes Row */}
              <div className="flex flex-col md:flex-row gap-6 mt-6 items-center">
                {/* YouTube Video */}
                <div className="w-full md:w-[380px] aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/lINMiZrwbS0?si=ll3CxA54WA2R75SO&autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Feature Boxes */}
                <div className="flex flex-col gap-4 w-full md:w-auto">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-3 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🔒</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Verified Properties</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-3 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Best Price Guarantee</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-3 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">⭐</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">4.7/5 Rating</p>
                      <p className="text-xs text-gray-600">Based on 1k+ reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Right Content - Image */}
            <div className="relative lg:pl-6">
              <div
                className="relative w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500"
                ref={imageContainerRef}
              >
                {/* Enhanced Decorative Elements */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-blue-200/60 to-indigo-300/60 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-br from-purple-200/50 to-pink-300/50 rounded-full blur-3xl"></div>
                
                {/* Enhanced Main Image Container */}
                <div className="relative">
                  {/* Enhanced Glassmorphism Frame */}
                  <div className="relative aspect-square bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden p-6 hover:shadow-3xl transition-all duration-300">
                    {/* Enhanced inner gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/30 to-indigo-100/40 rounded-[2rem] animate-gradient"></div>
                    
                    <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-xl">
                      <Image
                        src="/hero.png"
                        alt="Modern Student Hostel Room"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        className="rounded-[1.5rem] hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Enhanced Floating UI Elements */}
                    {/* <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl font-bold">✓</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Enhanced Stats Section */}
          <div className="mt-16 pt-12 border-t border-gray-200/50">
            <div className="text-center mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                Trusted by Students Across India
              </h3>
              <p className="text-gray-600">Join thousands of students who found their perfect accommodation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto" ref={statsRef}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200/50 to-emerald-300/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">👥</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                      <CountUp 
                        end={50000} 
                        duration={1.5} 
                        separator="," 
                        enableScrollSpy={true}
                        scrollSpyOnce={true}
                        scrollSpyDelay={200}
                      />
                      <span className="text-green-500">+</span>
                    </p>
                    <p className="text-gray-600 font-semibold">Students Trust Us</p>
                    <div className="mt-2 text-sm text-green-600 font-medium">Verified Reviews</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/50 to-indigo-300/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">📱</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                      <CountUp 
                        end={40000} 
                        duration={1.5} 
                        separator="," 
                        enableScrollSpy={true}
                        scrollSpyOnce={true}
                        scrollSpyDelay={200}
                      />
                      <span className="text-blue-500">+</span>
                    </p>
                    <p className="text-gray-600 font-semibold">App Downloads</p>
                    <div className="mt-2 text-sm text-blue-600 font-medium">Growing Daily</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-pink-300/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🏠</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                      <CountUp 
                        end={10000} 
                        duration={1.5} 
                        separator="," 
                        enableScrollSpy={true}
                        scrollSpyOnce={true}
                        scrollSpyDelay={200}
                      />
                      <span className="text-purple-500">+</span>
                    </p>
                    <p className="text-gray-600 font-semibold">Hostel Bookings</p>
                    <div className="mt-2 text-sm text-purple-600 font-medium">Perfect Matches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;