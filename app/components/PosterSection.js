"use client";

import React from "react";

const PosterSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Check Out Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Features</span>
          </h2>

        </div>

        {/* Posters Grid - 2 rows, 1 column */}
        <div className="flex flex-col gap-16 max-w-6xl mx-auto">
          {/* Poster 1 - First Row */}
          <div className="group relative">
            {/* Background Texture */}


            {/* Poster Container */}




            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
              <div className="aspect-[3/2] relative">
                <img
                  src="/img/poster-01.png"
                  alt="Poster 1"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    console.error("Failed to load poster1.png");
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>

          </div>

          {/* Poster 2 - Second Row */}
          <div className="group relative">
            {/* Background Texture */}




            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
              <div className="aspect-[3/2] relative">
                <img
                  src="/poster2.png"
                  alt="Poster 2"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    console.error("Failed to load poster2.png");
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default PosterSection; 