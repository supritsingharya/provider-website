// src/components/NewsHeadlinesSection.jsx
import React from 'react';
import Image from 'next/image';

const newsItems = [

  {
    id: 1,
    src: '/news2.jpeg',
    alt: 'Second news headline clipping',
    headline: 'Provider App valued at INR 50 Lakhs within a year of launch',
    rotation: 'rotate-1',
    zIndex: 'z-20', // Higher z-index to be on top
    margin: 'lg:scale-105', // Slightly larger and no x-margin for centering
  },
  {
    id: 2,
    src: '/news3.png',
    alt: 'Third news headline clipping',
    headline: 'Awarded by G.L. Bajaj for helping 5000+ Students',
    rotation: 'rotate-2',
    zIndex: 'z-10',
    margin: 'lg:ml-[-40px]', // Negative margin for overlap
  },
  {
    id: 3,
    src: '/images/news.png',
    alt: 'Third news headline clipping',
    headline: 'Featured on National Startup Day 2025',
    rotation: 'rotate-2',
    zIndex: 'z-10',
    margin: 'lg:ml-[-40px]', // Negative margin for overlap
  },
  {
    id: 4,
    src: '/IMG_4173.JPG',
    alt: 'Third news headline clipping',
    headline: 'Chief guest at GNIOT on session held for early stage founders',
    rotation: 'rotate-2',
    zIndex: 'z-10',
    margin: 'lg:ml-[-40px]', // Negative margin for overlap
  },

];

const NewsHeadlinesSection = () => {
  return (
    <section className="bg-slate-100 py-6 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            In The Headlines
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See what the press is saying about our innovative solutions for students.
          </p>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className={`
                w-full max-w-xs lg:w-1/4
                bg-white p-3 border border-gray-300 rounded-md shadow-xl 
                transform transition-all duration-300 ease-out
                hover:shadow-2xl hover:scale-105 hover:!rotate-0 hover:!z-30
                ${item.rotation} 
                ${item.zIndex}
                ${item.margin || ''}
                ${index === 1 ? 'lg:relative lg:bottom-[-10px]' : ''} // Slightly elevate middle item on large screens
              `}
            >
              <div className="relative w-full aspect-[1/1] overflow-hidden rounded bg-gray-100">
                {/* Use Next.js Image component */}
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  style={{ objectFit: 'contain' }} // Changed from "cover" to "contain" to show full image
                  className="rounded" // Ensure image itself is rounded if parent has overflow-hidden
                  priority={index === 1} // Prioritize loading the central image
                />
              </div>
              <div className="mt-3 px-1 py-2">
                <h3 className="font-semibold text-slate-700 text-sm md:text-base leading-tight">
                  {/* You can add a placeholder for the actual headline text here */}
                  {/* For now, using a generic style */}
                  <span className="bg-yellow-200 px-1 py-0.5 rounded-sm">Highlighted:</span> {item.headline}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            className="bg-[#5E4AE3] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4c3cc7] transition-colors"
          >
            Read More News
          </button>
        </div>

      </div>
    </section>
  );
};

export default NewsHeadlinesSection;