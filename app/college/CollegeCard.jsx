'use client';

import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";

// This component now uses Tailwind CSS for a modern, aesthetic look.
const CollegeCard = ({ item, colActiv }) => {

  // If the 'item' prop is not provided, we can render a placeholder or nothing.
  if (!item) {
    return null;
  }

  // Common Card Content for reusability between Grid and List views
  const CardContent = () => (
    <>
      {/* Image Section - The fix is applied here */}
      <div className={`relative overflow-hidden ${colActiv ? 'w-full aspect-[4/3]  md:w-1/3 md:aspect-[4/3] md:flex-shrink-0' : 'w-full aspect-video'}`}>
        <Image
          src={item.imgLink || "/fallback-image.jpg"} // Fallback image for safety
          width={400}
          height={225}
          alt={item.title || "College Image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Text Content Section */}
      <div className={`flex flex-1 flex-col p-4 sm:p-6 ${colActiv ? 'w-full md:w-2/3' : 'w-full'}`}>
        {/* Card Header */}
        <div className="flex-grow">
          <h4 className="text-xl font-bold text-gray-800 line-clamp-1 leading-tight" title={item.title}>
            {item.title}
          </h4>
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <FaMapMarkerAlt className="mr-2 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </p>
          <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-gray-600">Established: <span className="font-semibold text-gray-800">{item.year}</span></div>
          <div className="text-gray-600">NAAC Grade: <span className="font-semibold text-gray-800">{item.grade}</span></div>
          <div className="text-gray-600">Area: <span className="font-semibold text-gray-800">{item.area}</span></div>
        </div>

        {/* Footer with CTA */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <span className="inline-block px-8 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 group-hover:bg-indigo-700 transition-colors">
            View Details
          </span>
        </div>
      </div>
    </>
  );

  // Render based on the 'colActiv' prop (Grid vs. List view)
  return (
    <div className={`group ${colActiv ? 'w-full' : 'w-full'}`}>
      <Link href={`/college/${item.slug}`} className="block h-full">
        <div
          className={`bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex h-full cursor-pointer ${colActiv
              ? 'flex-col md:flex-row' // Always column on mobile, row on desktop for List view
              : 'flex-col' // Always stacked for Grid view
            }`}
        >
          <CardContent />
        </div>
      </Link>
    </div>
  );
};

export default CollegeCard;