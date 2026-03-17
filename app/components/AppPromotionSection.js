// src/components/AppPromotionSection.jsx
"use client"; // Required for Swiper and useEffect

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules'; // Import EffectCoverflow

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow'; // Import Coverflow effect CSS

const appScreenshots = [
  { id: 1, src: '/ss1.jpg', alt: 'App Screenshot 1 - Hostel Listings' },
  { id: 2, src: '/ss2.jpg', alt: 'App Screenshot 2 - Internship Finder' },
  { id: 3, src: '/ss3.jpg', alt: 'App Screenshot 3 - Course Details' },
  { id: 4, src: '/ss4.jpg', alt: 'App Screenshot 4 - Stationery Order' }, // Add more if you have
  { id: 5, src: '/ss5.jpg', alt: 'App Screenshot 4 - Stationery Order' }, // Add more if you have
];

const AppPromotionSection = () => {
  return (
    <section className="relative py-16 md:py-24 text-gray-900 overflow-hidden">
      {/* Textured Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50">
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
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight">
            Why Use the <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Provider App</span>?
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Side: App Screenshots Carousel */}
          <div className="w-full md:w-1/2 lg:w-[45%] relative group">
            {/* Enhanced decorative background for the carousel */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-3xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

            <div className="relative p-2 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl">
              <Swiper
                modules={[Autoplay, Pagination, EffectCoverflow]}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                loop={true}
                coverflowEffect={{
                  rotate: 30,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                autoplay={{
                  delay: 1500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="mySwiper w-full h-auto rounded-xl"
                style={{
                  // @ts-ignore
                  "--swiper-pagination-color": "#2563EB",
                  "--swiper-pagination-bullet-inactive-color": "#94A3B8",
                  "--swiper-pagination-bullet-inactive-opacity": "0.7",
                  "--swiper-pagination-bullet-size": "10px",
                  "--swiper-pagination-bullet-horizontal-gap": "6px"
                }}
              >
                {appScreenshots.map((screen) => (
                  <SwiperSlide key={screen.id} className="!w-[60%] sm:!w-[50%] md:!w-[270px] aspect-[384/758]">
                    <div className="relative w-full h-full bg-white rounded-lg md:rounded-xl overflow-hidden shadow-lg border border-gray-200">
                      <Image
                        src={screen.src}
                        alt={screen.alt}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-lg md:rounded-xl"
                        priority={screen.id === 1}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Right Side: Text Content & CTA */}
          <div className="w-full md:w-1/2 lg:w-[55%] text-center md:text-left">
            <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight">
              Your All-in-One <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Student Super App</span>
            </h3>
            <p className="text-xl text-gray-700 mb-4 font-medium">
              Discover verified <span className="font-bold text-blue-600">Hostels</span>,
              exclusive <span className="font-bold text-blue-600">Internships</span>,
              curated <span className="font-bold text-blue-600">Courses</span>,
              and free <span className="font-bold text-blue-600">Stationery</span> delivery.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience seamless booking, dedicated local support, and a community built for you.
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=provider.in&hl=en_IN"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span role="img" aria-label="download icon" className="mr-2 text-xl">📱</span>
              Download Now
            </a>
            <p className="text-sm text-gray-500 mt-4 font-medium">
              Available on iOS & Android
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromotionSection;