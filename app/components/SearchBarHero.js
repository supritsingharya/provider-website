"use client";

import React, { useState } from "react";
import { Search, Home, Users, MapPin } from "lucide-react"; // Added more icons

const propertyTypes = ["Hostel", "PG", "Room", "Flat"];
const genders = ["Male", "Female", "Independent"];

export default function SearchBarHero() {
  const [selectedPropertyType, setSelectedPropertyType] = useState(
    propertyTypes[0]
  );
  const [selectedGender, setSelectedGender] = useState(genders[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({
      propertyType: selectedPropertyType,
      gender: selectedGender,
      term: searchTerm,
    });
    alert(
      `Searching for: ${selectedPropertyType}, ${selectedGender}, "${searchTerm}"`
    );
  };

  return (
    // Refined gradient for a richer look, extending to a darker indigo
    <section className="bg-gradient-to-br from-purple-700 via-indigo-600 to-indigo-900 py-20 md:py-28 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Perfect Stay</span>
        </h1>
        <p className="text-lg md:text-xl text-indigo-200 mb-10 md:mb-12 max-w-2xl mx-auto">
          Search Hostels, PGs or Flats Across India with Ease
        </p>

        <form
          onSubmit={handleSearch}
          // Darker, more subtle form background with a slight border
          className="bg-black/30 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-purple-500/30 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Property Type Filter */}
            <div>
              <label className="flex items-center text-sm font-medium mb-2 text-left text-indigo-200">
                <Home size={18} className="mr-2 text-purple-400" />
                Property Type
              </label>
              {/* Darker background for the button group container */}
              <div className="flex bg-black/20 rounded-lg p-1.5 space-x-1.5">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedPropertyType(type)}
                    className={`w-full py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                      ${
                        selectedPropertyType === type
                          ? "bg-white text-purple-700 font-semibold shadow-lg transform scale-105"
                          : "text-slate-200 hover:bg-purple-500/30 hover:text-white"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="flex items-center text-sm font-medium mb-2 text-left text-indigo-200">
                <Users size={18} className="mr-2 text-purple-400" />
                Gender
              </label>
              <div className="flex bg-black/20 rounded-lg p-1.5 space-x-1.5">
                {genders.map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setSelectedGender(gender)}
                    className={`w-full py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                      ${
                        selectedGender === gender
                          ? "bg-white text-purple-700 font-semibold shadow-lg transform scale-105"
                          : "text-slate-200 hover:bg-purple-500/30 hover:text-white"
                      }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-8">
            <label
              htmlFor="searchInput"
              className="flex items-center text-sm font-medium mb-2 text-left text-indigo-200"
            >
              <MapPin size={18} className="mr-2 text-purple-400" />
              Property Name / Gender / City / Location
            </label>
            {/* Input with more contrast and better focus state */}
            <input
              type="text"
              id="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Girls Hostel, Greater Noida, Alpha I"             className="w-full p-3.5 rounded-lg text-purple-900 bg-slate-50 placeholder-slate-500 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm
                         transition-all duration-200 ease-in-out border border-transparent focus:bg-white"
            />
          </div>

          {/* Search Button - Using a vibrant gradient that fits the theme */}
          <button
            type="submit"
            className="w-full flex items-center justify-center 
                       bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 
                       hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700
                       text-white font-bold py-3.5 px-6 rounded-lg text-lg 
                       transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl
                       transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-900 focus:ring-pink-500"
          >
            <Search size={22} className="mr-2.5" />
            Search Now
          </button>
        </form>
      </div>
    </section>
  );
}