'use client';

import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa'; // Placeholder icon
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Sample Mentor Data
// In a real application, this would likely come from a CMS or API
const mentorsData = [
  {
    id: 1,
    name: 'Praveen Gopal',
    role: 'CMD, Dream Provider Pvt. Ltd.',
    bio: 'Visionary leader driving innovation in student services and educational technology.',
    imageUrl: '/praveen.png', // Replace with actual image path
    // linkedinUrl: 'https://linkedin.com/in/praveengopal', // Optional
  },
  {
    id: 2,
    name: 'Avadhesh Chaudhary',
    role: 'CEO, Dream Provider',
    bio: 'Strategic thinker focused on operational excellence and scaling student-centric solutions.',
    imageUrl: '/avadesh.png', // Replace with actual image path
  },
  {
    id: 3,
    name: 'Kshitij Goel',
    role: 'Sales Head',
    bio: 'Dynamic sales strategist dedicated to expanding market reach and building strong partnerships.',
    imageUrl: '/kshitij.png', // Replace with actual image path
  }
];

const MentorCard = ({ mentor }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md p-8 text-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100">
      <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-300">
        {mentor.imageUrl ? (
          <Image
            src={mentor.imageUrl}
            alt={`Photo of ${mentor.name}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-full transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full">
            <FaUserCircle className="w-20 h-20 text-blue-400" />
          </div>
        )}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
        {mentor.name}
      </h3>
      <p className="text-blue-600 font-medium text-sm md:text-base mb-3">
        {mentor.role}
      </p>
      <p className="text-gray-600 text-sm leading-relaxed">
        {mentor.bio}
      </p>
      {/* Optional: LinkedIn Icon/Link
      {mentor.linkedinUrl && (
        <a
          href={mentor.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          aria-label={`${mentor.name}'s LinkedIn Profile`}
        >
          <FaLinkedin size={24} />
        </a>
      )}
      */}
    </div>
  );
};

const MeetOurMentors = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading
      gsap.from(headingRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        }
      });

      // Animate cards
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
      {/* Subtle Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-100/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
            Our <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Mentors</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Our team of seasoned professionals and visionary leaders are dedicated to empowering your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {mentorsData.map((mentor, index) => (
            <div
              key={mentor.id}
              ref={el => cardsRef.current[index] = el}
            >
              <MentorCard mentor={mentor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurMentors;