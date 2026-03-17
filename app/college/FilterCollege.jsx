'use client';

import { FaSearch } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi"; // A better icon for "Clear"
import React, { useState } from 'react';

const Filter = ({ data, onFilterChange, onReset }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchQuery.trim() === "" && selectedLocation === "") {
      onReset();
    } else {
      let filteredData = data;
      
      // Filter by search query if present
      if (searchQuery.trim() !== "") {
        filteredData = filteredData.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by location if selected
      if (selectedLocation !== "") {
        filteredData = filteredData.filter((item) =>
          item.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }
      
      onFilterChange(filteredData);
    }
  };
  
  const handleClear = () => {
    setSearchQuery("");
    setSelectedLocation("");
    onReset();
  };

  // Check if any filter is applied
  const hasActiveFilters = searchQuery.trim() !== "" || selectedLocation !== "";

  return (
    // Section with a subtle background gradient for depth
    <section className="font-sans bg-gradient-to-b from-white via-slate-50 to-slate-100 py-6">
      <div className="container mx-auto px-4">
        
        {/* The main filter card with "Glassmorphism" effect */}
        <div className="bg-white/70 backdrop-blur-xl p-6 lg:p-8 rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
            
            {/* --- Search Input (takes up more space) --- */}
            <div className={`relative w-full ${hasActiveFilters ? 'lg:col-span-4' : 'lg:col-span-5'}`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-slate-400" />
              </div>
              <input
                type="search"
                placeholder="Search by college name, e.g., 'Amity'"
                value={searchQuery}
                onKeyDown={handleKeyPress}
                onChange={handleSearchInput}
                className="w-full pl-11 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-0 transition-all"
              />
            </div>
            
            {/* --- Location Dropdown --- */}
            <div className={`relative w-full ${hasActiveFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <select 
                value={selectedLocation}
                onChange={handleLocationChange}
                className="appearance-none w-full bg-slate-100 border-2 border-transparent rounded-lg py-3 px-4 text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-0 transition-all"
              >
                <option value="">Location</option>
                <option value="greater-noida">Greater Noida</option>
                <option value="ghaziabad">Ghaziabad</option>
                <option value="noida">Noida</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            
            {/* --- "Clear" Ghost Button - Only shown when filters are active --- */}
            {hasActiveFilters && (
              <div className="w-full lg:col-span-2 lg:text-center">
                <button
                    type="button"
                    onClick={handleClear}
                    className="w-full lg:w-auto py-3 px-4 text-slate-500 font-semibold hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
              </div>
            )}
            
            {/* --- Gradient Search Button --- */}
            <div className={`w-full ${hasActiveFilters ? 'lg:col-span-3' : 'lg:col-span-3'}`}>
              <button
                type="button"
                onClick={handleSearchClick}
                className="w-full flex items-center justify-center gap-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-wide px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <FaSearch />
                Search Colleges
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filter;