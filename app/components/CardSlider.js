"use client";

import React, { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Verified Hostel Listings",
    description:
      "Find your perfect student home with our curated list of verified hostels. Each listing is checked for safety, comfort, and student-friendly amenities, ensuring peace of mind.",
    icon: "",
    image: "/1.png",
  },
  {
    title: "Direct Owner Contact",
    description:
      "Connect directly with hostel owners. No brokers, no hidden fees. Enjoy transparent communication, quick query resolution, and a hassle-free booking experience.",
    icon: "",
    image: "/owner.png",
  },
  {
    title: "No-Cost EMI",
    description:
      "Manage your finances smartly. Pay your hostel fees and other essential expenses in easy, interest-free monthly installments. Focus on your studies, not financial stress.",
    icon: "",
    image:
      "/emi.webp",
  },
  {
    title: "Free Stationery Delivery",
    description:
      "Get all your essential study supplies—Calculators, Pens, Files and more—delivered right to your doorstep, absolutely free delivery. Never run out of what you need to succeed.",
    icon: "",
    image:
      "https://img.freepik.com/free-photo/workplace-with-set-stationary_23-2147830026.jpg?semt=ais_hybrid&w=740",
  },
  {
    title: "Exclusive Internships",
    description:
      "Kickstart your career with access to exclusive internship opportunities curated for students on our platform. Gain valuable industry experience and build your professional network.",
    icon: "",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CardSlider() {
  const wrapperRef = useRef(null);
  const cardsRef = useRef([]);
  const firstCardRef = useRef(null);

  const [started, setStarted] = useState(false); // animations only after first card hits top
  const [activeIndex, setActiveIndex] = useState(0);

  // Observe when first card reaches the viewport top to "start" animations
  useEffect(() => {
    const onScroll = () => {
      if (!firstCardRef.current) return;
      const rect = firstCardRef.current.getBoundingClientRect();
      // When its top is at or above viewport top => start
      if (rect.top <= 0 && !started) setStarted(true);
      if (rect.top > 0 && started) setStarted(false); // if user scrolls back above
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [started]);

  // Highlight the most visible (active) sticky card
  useEffect(() => {
    if (!cardsRef.current.length) return;

    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          ratios.set(idx, entry.intersectionRatio);
        });
        // find the index with max ratio
        let maxIdx = 0;
        let maxVal = -1;
        ratios.forEach((val, key) => {
          if (val > maxVal) {
            maxVal = val;
            maxIdx = key;
          }
        });
        setActiveIndex(maxIdx);
      },
      {
        // Center-weighted visibility
        root: null,
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
      }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-blue-50">
      {/* HERO / STATIC INTRO */}
      <section className="relative w-full min-h-[85vh] my-10 flex flex-col items-center justify-center text-center gap-6 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 14"
            className="w-12 h-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
          </svg>
        </div>

        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
          Why Students{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Love Provider
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl text-lg">
          Discover a world of opportunities with our comprehensive student platform
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-[1.02]">
          Explore Benefits in App
        </button>
      </section>

      {/* STICKY STACKED CARDS */}
      <section ref={wrapperRef} className="relative">
        {features.map((feature, index) => (
          <div key={index} className="relative h-[100vh]">
            {/* Each wrapper adds scroll space; the card itself sticks at top */}
            <article
              ref={(el) => {
                if (index === 0) firstCardRef.current = el;
                cardsRef.current[index] = el;
              }}
              data-index={index}
              className={[
                "sticky top-0 mx-auto w-[92%] md:w-[88%] rounded-3xl",
                "bg-white shadow-xl",
                "transition-all duration-500 will-change-transform transform-gpu",
                "px-6 md:px-10 py-8 md:py-12",
                // Mobile-first: stack vertically, then horizontally on medium screens
                "flex flex-col md:flex-row items-center justify-center md:justify-between gap-8",
                "min-h-[60vh]",
                // Active vs inactive styling
                started
                  ? activeIndex === index
                    ? "opacity-100 scale-100"
                    : "opacity-70 md:opacity-80 scale-[0.97] md:scale-[0.98]"
                  : "opacity-100 scale-100",
              ].join(" ")}
              style={{
                scrollBehavior: "smooth",
              }}
            >
              {/* Left Text */}
              <div className="w-full md:max-w-2xl text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                    {feature.title}
                  </h1>
                </div>

                <p className="text-base md:text-xl leading-relaxed text-gray-700 mb-6 md:mb-8">
                  {feature.description}
                </p>

                <button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold md:font-bold text-base md:text-lg shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-[1.02]"
                  onClick={() => {
                    const faq = document.getElementById("faq");
                    if (faq) faq.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </button>
              </div>

              {/* Right Image - NOW VISIBLE ON ALL SCREENS */}
              <div className="w-full max-w-sm md:w-[22rem] shrink-0">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={feature.image}
                    alt={`Preview for ${feature.title}`}
                    className="w-full h-[12rem] md:h-[18rem] object-cover" // Responsive height for image
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.visibility = "hidden";
                    }}
                  />
                </div>
              </div>
            </article>
          </div>
        ))}
      </section>

      {/* Optional: FAQ anchor target */}
      <div id="faq" className="h-4" />
    </div>
  );
}