'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const features = [
  {
    title: 'Step 1 – Search & Explore',
    description: 'Select city, locality, property type and gender and explore various property.',
  },
  {
    title: 'Step 2 – Explore property',
    description: 'Check distance from your college, view on map, call owner, see facilities, pricing, images & video view.',
  },
  {
    title: 'Step 3 – Schedule visit',
    description: 'Select your preferred date and time to visit the property you like the most.',
  },
  {
    title: 'Step 4 – Book Hostel',
    description: 'Pay booking amount and confirm your booking instantly through the app.',
  },
];

const images = [
  {
    src: '/img/mockup-1.png',
    alt: 'Contact step',
  },
  {
    src: '/img/mockup-3.png',
    alt: 'Security step',
  },
  {
    src: '/img/mockup-2.png',
    alt: 'Compare step',
  },
  {
    src: '/img/mockup-3.png',
    alt: 'Compare step',
  },
];

const SLIDE_INTERVAL = 4000;

const Booking3DExplainer = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL);

    return () => {
      resetTimeout();
    };
  }, [current]);

  const handleFeatureClick = (index) => {
    setCurrent(index);
  };

  return (
    <section className="relative py-24 text-gray-900 overflow-hidden bg-white">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/60">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Animated Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-5 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-5 w-56 h-56 bg-indigo-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight font-display" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              How Booking Works on the App
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
            A simple, secure, and streamlined process to find and book your next property.
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl rounded-3xl shadow-2xl bg-white/60 backdrop-blur-xl border border-white/50 flex flex-col md:flex-row p-8 md:p-12 gap-12">

            {/* Left: Interactive Features */}
            <div className="flex-1 flex flex-col justify-center gap-6">
              {features.map((feature, idx) => (
                <div
                  key={feature.title}
                  onClick={() => handleFeatureClick(idx)}
                  className={`rounded-2xl p-6 cursor-pointer transition-all duration-500 ease-in-out transform hover:-translate-y-1 ${current === idx
                    ? 'bg-white shadow-lg border-2 border-indigo-500 scale-105'
                    : 'bg-white/70 shadow-md border-2 border-transparent hover:border-indigo-200/50 hover:shadow-lg'
                    }`}
                >
                  <h3 className="text-xl font-bold text-indigo-800 mb-2" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: 3D Image Slider with Cross-Fade */}
            <div className="flex-1 flex flex-col items-center justify-center [perspective:1000px]">
              <div className="relative w-[280px] h-[580px] md:w-[320px] md:h-[640px] transition-transform duration-700 ease-out transform-style-preserve-3d hover:[transform:rotateY(-5deg)_scale(1.05)] [transform:rotateY(-15deg)]">
                <div className="absolute inset-0 rounded-3xl shadow-2xl border-8 border-gray-800 bg-gray-800">
                  <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
                    {images.map((image, idx) => (
                      <Image
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        fill
                        className={`object-contain transition-opacity duration-700 ease-in-out ${current === idx ? 'opacity-100' : 'opacity-0'
                          }`}
                        priority={idx === 0}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8 gap-3">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${current === idx ? 'bg-indigo-600 scale-125' : 'bg-indigo-200 hover:bg-indigo-300'
                      }`}
                    onClick={() => handleFeatureClick(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking3DExplainer;