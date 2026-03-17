// src/components/AchievementsSection.jsx
"use client"
import React from 'react';
import CountUp from 'react-countup';
import { FaHotel, FaMobileAlt, FaUsers, FaCity, FaBuilding, FaYoutube } from 'react-icons/fa';

const achievementsData = [
  {
    numericValue: 10000,
    displayValue: '10,000+',
    label: 'Hostel Bookings',
    icon: <FaHotel className="w-8 h-8" />,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    numericValue: 40000,
    displayValue: '40,000+',
    label: 'App Downloads',
    icon: <FaMobileAlt className="w-8 h-8" />,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  {
    numericValue: 50000,
    displayValue: '50,000+',
    label: 'Students Trust Us',
    icon: <FaUsers className="w-8 h-8" />,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    numericValue: 7,
    displayValue: '7+ Cities',
    label: 'Across 4 States',
    icon: <FaCity className="w-8 h-8" />,
    iconColor: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    numericValue: 50000,
    displayValue: '50,000+',
    label: 'Beds',
    icon: <FaBuilding className="w-8 h-8" />,
    iconColor: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
  {
    numericValue: 30000,
    displayValue: '30,000+',
    label: 'YouTube Subscribers',
    icon: <FaYoutube className="w-8 h-8" />,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
];

const AchievementsSection = () => {
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
            Our <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Milestones</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Numbers that showcase our commitment and the trust placed in us.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {achievementsData.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center space-y-3"
            >
              <div className={`${item.bgColor} p-4 rounded-2xl ${item.iconColor} group-hover:scale-110 transition-all duration-300`}>
                {item.icon}
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-black text-gray-900">
                  <CountUp end={item.numericValue} duration={2.5} separator="," />
                  {item.displayValue.replace(/[0-9,]/g, '')}
                </div>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;