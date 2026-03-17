// src/components/Filter.jsx

'use client';

import { Search, MapPin, Map, ChevronDown, SlidersHorizontal, X, Home, Users } from "lucide-react";
import { useFetchLocation } from "../../hooks/useFetchLocations";
import { useState, useEffect } from "react";

const Filter = ({
  onSelectLocation,
  location,
  onSearchProperties,
  searchError,
  propertyType,
  onPropertyTypeChange,
  gender,
  onGenderChange,
  priceRange,
  onPriceChange,
  seater,
  onSeaterChange,
  onClearFilters
}) => {
  const { data, error, isLoading, isSuccess } = useFetchLocation();
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentLocations, setCurrentLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchText, setSearchText] = useState("");

  const isFilterActive = location || searchText || propertyType || gender || priceRange || seater;

  useEffect(() => {
    if (isSuccess && data?.cities?.data) {
      setCities(data.cities.data);
    }
  }, [data, isSuccess]);

  const handleCitySelect = (event) => {
    const selectedCityName = event.target.value;
    setSelectedCity(selectedCityName);
    onSelectLocation("");

    if (!selectedCityName) {
      setCurrentLocations([]);
      return;
    }
    const selectedIndex = cities.findIndex(
      (city) => city.attributes.name === selectedCityName
    );
    if (selectedIndex !== -1) {
      setCurrentLocations(cities[selectedIndex]?.attributes?.locations?.data || []);
    }
  };

  const handleLocSelect = (event) => {
    const selectedLoc = event.target.value;
    onSelectLocation(selectedLoc);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let query = searchText;
    const seaterRegex = /(\d+)\s*seater/i;
    const seaterMatch = query.match(seaterRegex);
    if (seaterMatch) {
      onSeaterChange(`${seaterMatch[1]} Seater`);
      query = query.replace(seaterRegex, '').trim();
    }
    const priceRegex = /(?:under|below)?\s*(\d{4,})/i;
    const priceMatch = query.match(priceRegex);
    if (priceMatch) {
      const price = parseInt(priceMatch[1], 10);
      onPriceChange(`0-${price}`);
      query = query.replace(priceMatch[0], '').trim();
    }
    onSearchProperties(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleClear = () => {
    setSearchText("");
    setSelectedCity(null);
    setCurrentLocations([]);
    onClearFilters();
  }

  const propertyTypeOptions = ["Hostel", "PG", "Flat", "Room"];
  const genderOptions = ["Boys", "Girls", "Independent", "Family"];

  // Premium Glass Input Styles
  const glassInputClass = "w-full appearance-none pl-10 pr-8 py-3.5 text-sm text-gray-800 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white/80 transition-all placeholder:text-gray-500";

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl mx-auto max-w-6xl -mt-20 relative z-20 overflow-hidden">
      {/* Search Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-white/40 to-white/10 border-b border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-700">
            <SlidersHorizontal size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Find Your Place</h3>
        </div>
        {isFilterActive && (
          <button
            onClick={handleClear}
            className="group flex items-center px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-200/50"
          >
            <X size={14} className="mr-2 group-hover:rotate-90 transition-transform" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* Main Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            </div>
            <input
              type="search"
              placeholder="Search by name, price (e.g., under 8000), or seater (e.g., 2 seater)..."
              value={searchText}
              onKeyDown={handleKeyPress}
              onChange={(e) => setSearchText(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-white/50 rounded-xl leading-5 bg-white/70 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all duration-300 shadow-sm text-base"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Select */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="text-indigo-400 group-hover:text-indigo-600 transition-colors" size={18} />
              </div>
              <select
                aria-label="Select a city"
                className={glassInputClass}
                value={selectedCity ?? ""}
                onChange={handleCitySelect}
              >
                <option value="" disabled>Select City</option>
                {isLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  cities.map((city) => (
                    <option key={city.id} value={city.attributes.name}>
                      {city.attributes.name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="text-gray-400 group-hover:text-indigo-500 transition-colors" size={18} />
              </div>
            </div>

            {/* Location Select */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Map className="text-indigo-400 group-hover:text-indigo-600 transition-colors" size={18} />
              </div>
              <select
                aria-label="Select a location"
                className={`${glassInputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                value={location ?? ""}
                onChange={handleLocSelect}
                disabled={!selectedCity || currentLocations.length === 0}
              >
                <option value="" disabled>Select Location</option>
                {selectedCity && currentLocations.length > 0 ? (
                  currentLocations.map((loc) => (
                    <option key={loc.id} value={loc.attributes.name}>
                      {loc.attributes.name}
                    </option>
                  ))
                ) : selectedCity ? (
                  <option disabled>No locations</option>
                ) : null}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="text-gray-400 group-hover:text-indigo-500 transition-colors" size={18} />
              </div>
            </div>

            {/* Property Type */}
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Home className="text-indigo-400 group-hover:text-indigo-600 transition-colors" size={18} />
              </div>
              <select
                value={propertyType}
                onChange={(e) => onPropertyTypeChange(e.target.value)}
                className={glassInputClass}
              >
                <option value="">Property Type</option>
                {propertyTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="text-gray-400 group-hover:text-indigo-500 transition-colors" size={18} />
              </div>
            </div>

            {/* Gender */}
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Users className="text-indigo-400 group-hover:text-indigo-600 transition-colors" size={18} />
              </div>
              <select
                value={gender}
                onChange={(e) => onGenderChange(e.target.value)}
                className={glassInputClass}
              >
                <option value="">Select Gender</option>
                {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="text-gray-400 group-hover:text-indigo-500 transition-colors" size={18} />
              </div>
            </div>
          </div>
        </div>

        {searchError && (
          <div className="text-center mt-2 mb-4 animate-fade-in">
            <p className="text-red-500 font-medium text-sm bg-red-50 inline-block px-3 py-1 rounded-full">{searchError}</p>
          </div>
        )}

        <div className="px-6 pb-6 text-center">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full md:w-auto inline-flex items-center justify-center px-12 py-3.5 font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Search size={18} className="mr-2 stroke-[2.5px]" />
            Search Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;