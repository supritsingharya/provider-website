'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Data for Testimonials ---
const testimonialsData = [
  {
    id: 1,
    name: 'Ritesh',
    photoUrl: "/images/testimonials/unnamed.webp",
    location: 'KP2, Greater Noida',
    rating: 5,
    text: 'This app has truly been a lifesaver! Finding a good hostel can be a stressful and time-consuming task, but this app made the entire process smooth and hassle-free. The interface is clean, user-friendly, and packed with useful features like filters, real images, verified reviews, and instant booking options.',
  },
  {
    id: 2,
    name: 'Ayush Raj',
    photoUrl: null,
    location: 'Delta',
    rating: 5,
    text: "This application is great for college students to find a house warming hostel near by your own college. My own experience from this application is great, I took hostel recommended by this app for my 2nd year and it was perfect and cheaper than my own college Residencial Hostels. I got clean room with friendly roommate and staff, tasty food and 24×7 wifi and security and the best thing was unlimited laundry and transportation. I would definitely recommend this app to other college students.",
  },
  {
    id: 3,
    name: 'Rudra Gupta',
    photoUrl: '/images/testimonials/image1.png',
    location: 'Noida',
    rating: 5,
    text: "This app is fantastic for anyone in need of reliable hostel accommodations and quality stationery items. The interface is user-friendly, making it easy to browse and book hostels, as well as purchase stationery supplies. I love how both services are seamlessly integrated in one place. The booking process is quick and straightforward, and the stationery selection is impressive with great prices. Highly recommend this app for anyone looking for convenience and variety!",
    youtubeVideoId: 'LxbNqLgDEgM', // Example: Using a generic student life video ID. Replace with actual.
  },
  {
    id: 4,
    name: 'Vaani Krishnan',
    photoUrl: null,
    location: 'Alpha 2',
    rating: 5,
    text: "Smooth Experience So Far! ⭐⭐⭐⭐⭐ The Provider app made it super easy to find good hostels in Noida. The options look great, and they even offer discounts. My experience using the app has been 10/10 so far!",
  },
  {
    id: 5,
    name: 'Yashi Gupta', // Changed for variety
    photoUrl: null,
    location: null,
    rating: 5,
    text: "The Provider app revolutionizes travel accommodation with its affordability and convenience. With a user-friendly interface and seamless booking process, it simplifies the experience for budget-conscious travelers. Manage bookings effortlessly and explore comprehensive hostel listings for a hassle-free hostel hunting experience.",
  }
];
// --- End of Data ---

const StarRating = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        return starNumber <= rating ? (
          <FaStar key={index} className="text-amber-400 w-4 h-4" />
        ) : (
          <FaRegStar key={index} className="text-amber-400 w-4 h-4" />
        );
      })}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100">
    <div className="flex items-center mb-6">
      {testimonial.photoUrl ? (
        <Image
          src={testimonial.photoUrl}
          alt={testimonial.name}
          width={64}
          height={64}
          className="rounded-full mr-4 object-cover ring-2 ring-blue-50"
          onError={(e) => { e.target.style.display = 'none'; /* Hide if image fails */ }}
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-4">
          <FaUserCircle className="w-10 h-10 text-blue-400" />
        </div>
      )}
      <div>
        <h4 className="font-bold text-lg text-gray-900 tracking-tight">{testimonial.name}</h4>
        <p className="text-sm text-gray-600 font-medium">{testimonial.location}</p>
      </div>
    </div>
    <div className="mb-4">
      <StarRating rating={testimonial.rating} />
    </div>
    <p className="text-gray-700 flex-grow text-lg leading-relaxed font-light">
      "{testimonial.text}"
    </p>
  </div>
);


const StudentTestimonials = () => {
  const videoTestimonial = testimonialsData.find(t => t.youtubeVideoId);
  const textTestimonials = testimonialsData.filter(t => !t.youtubeVideoId);

  // For 4x4 grid cycling
  const [currentIndex, setCurrentIndex] = useState(0);
  const gridSize = 4; // 2x2
  // If there are less than 16, repeat testimonials
  const allTestimonials = [];
  while (allTestimonials.length < gridSize) {
    allTestimonials.push(...textTestimonials);
    if (allTestimonials.length > gridSize) allTestimonials.length = gridSize;
  }

  // For cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(allTestimonials.length / gridSize));
    }, 5000);
    return () => clearInterval(interval);
  }, [allTestimonials.length]);

  // Get the current 16 testimonials for the grid, cycling through all if more than 16
  const start = currentIndex * gridSize;
  const gridTestimonials = allTestimonials.slice(start, start + gridSize).length === gridSize
    ? allTestimonials.slice(start, start + gridSize)
    : allTestimonials.slice(0, gridSize);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/60 to-purple-50/80">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-200/40 to-indigo-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-purple-200/40 to-pink-300/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-100/40 to-purple-200/40 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#6366f1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">What Students Say About Provider App</span>
          </h2>
          <p className="text-lg md:text-xl text-indigo-700 max-w-2xl mx-auto font-medium">
            Join thousands of satisfied students who found their perfect accommodation with us
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Video Testimonial (Left) */}
          {videoTestimonial && (
            <div className="md:w-2/5 w-full mb-8 md:mb-0 flex flex-col items-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col border border-blue-100">
                <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/8Q9o2Tp3epQ?si=kXw-9GsMjOlWJ8ql?rel=0`}
                    title={`${videoTestimonial.name}'s Testimonial Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-xl w-full h-full"
                  ></iframe>
                </div>
                <div className="flex items-center mb-2">
                  {videoTestimonial.photoUrl ? (
                    <Image
                      src={videoTestimonial.photoUrl}
                      alt={videoTestimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-3 object-cover ring-2 ring-blue-50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-3">
                      <FaUserCircle className="w-7 h-7 text-blue-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-base text-gray-900 tracking-tight">{videoTestimonial.name}</h4>
                    <p className="text-xs text-gray-600 font-medium">{videoTestimonial.location}</p>
                  </div>
                </div>
                <StarRating rating={videoTestimonial.rating} />
                <p className="text-gray-700 mt-2 text-base leading-relaxed font-light flex-grow">
                  "{videoTestimonial.text}"
                </p>
              </div>
            </div>
          )}

          {/* 2x2 Grid of Reviews (Right) */}
          <div className="md:w-3/5 w-full grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 min-h-[320px]">
            {gridTestimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id + '-' + idx}
                className={
                  `rounded-xl p-4 shadow-md border border-indigo-100 bg-gradient-to-br flex flex-col justify-between h-48 md:h-56 xl:h-60 ` +
                  (idx % 2 === 0 ? 'from-blue-50 to-indigo-100' : 'from-purple-50 to-pink-100')
                }
              >
                <div className="flex items-center mb-2">
                  {testimonial.photoUrl ? (
                    <Image
                      src={testimonial.photoUrl}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-3 object-cover ring-2 ring-blue-50"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-3">
                      <FaUserCircle className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-base text-gray-900 tracking-tight">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">{testimonial.location}</p>
                  </div>
                </div>
                <StarRating rating={testimonial.rating} />
                <p className="text-gray-700 mt-2 text-base leading-snug font-normal">
                  "{testimonial.text.length > 120 ? testimonial.text.slice(0, 117) + '...' : testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;