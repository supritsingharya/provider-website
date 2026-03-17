// src/components/TrustBadgesSection.jsx
import React from 'react';
import Image from 'next/image';

const trustData = [
  {
    icon: <Image src="/certificates/startupindia.png" alt="#startupindia" width={200} height={200} className="object-contain" />,
    text:null,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  {
    icon: <Image src="/certificates/startinup.png" alt="Start In UP" width={256} height={256} className="object-contain" />,
    text: null,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    icon: <Image src="/certificates/msme.png" alt="MSME" width={128} height={128} className="object-contain" />,
    text: null,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  {
    icon: <Image src="/certificates/DPIIT.png" alt="MSME" width={128} height={128} className="object-contain" />,
    text: null,
    bgColor: 'bg-red-50',
    textColor: 'text-yellow-700',
  },
 
];

const TrustBadgesSection = () => {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Enhanced Texture Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Additional subtle pattern */}
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

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight text-gray-900">
            Why Choose <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Us?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Our commitment to providing a safe, reliable, and student-focused experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {trustData.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center space-y-4"
            >
              <div className={`${item.bgColor} p-4 rounded-2xl ${item.textColor} group-hover:scale-110 transition-all duration-300`}>
                {item.icon}
              </div>
              
              <div className="space-y-2">
                <p className={`text-lg md:text-xl font-semibold ${item.textColor}`}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;