"use client";

import React from "react";
// GSAP and related refs are removed as they are not used in the current JSX.
// If you plan to add cards that use this, you can re-integrate it.

export default function Solutions() {
  return (
    <section className="bg-slate-50 py-12 md:py-20"> {/* Section background and padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 lg:gap-16 bg-white rounded-xl shadow-xl p-6 sm:p-8 md:p-10">
          {/* Image Section */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <img
              src="/team.jpg" // Ensure this image is in your public folder
              alt="Diverse group of students collaborating" // More descriptive alt text
              className="w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[450px] object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Text Content Section */}
          <div className="w-full md:w-7/12 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              What is <span className="text-purple-600">Provider</span>?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Provider is a student community marketplace helping students with
              accommodation, internships, stationery delivery, trip bookings,
              and college support.
            </p>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We handle your concerns so you can stay relaxed and live a
              hassle-free life.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex-shrink-0 bg-purple-500 p-2 rounded-full mt-1">
                  {/* Using a simple SVG checkmark for better color control than emoji */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700">AI-Powered Solutions</h4>
                  <p className="text-sm text-slate-500">
                    Optimizing operations with advanced technology.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-shrink-0 bg-green-500 p-2 rounded-full mt-1">
                  {/* Using a simple SVG arrow for better color control */}
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700">Growth & Support</h4>
                  <p className="text-sm text-slate-500">
                    Maximizing opportunities and student well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}