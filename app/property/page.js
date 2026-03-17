'use client'

import React, { useState } from 'react';
import Filter from './Filter';
import Banner from './Banner';
import Properties from './Properties';
import axios from 'axios';
import MaxWidthWrapper from '../components/MaxWidthWrapper';

const Property = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [gender, setGender] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [seater, setSeater] = useState('');
  const [searchedData, setSearchedData] = useState(null);
  const [query, setQuery] = useState("");
  const [searchError, setSearchError] = useState(null);

  const searchProperties = async (searchText) => {
    setQuery(searchText);
    setSearchError(null);

    if (!searchText || searchText.trim() === '') {
      setSearchedData(null);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.dreamprovider.in/api/properties?populate=main_image,price,genders,seaters,location&filters[name][$containsi]=${searchText}`
      );
      setSearchedData(response.data);
    } catch (error) {
      console.error("Search Error:", error);
      setSearchError("Failed to fetch search results. Please try again.");
      setSearchedData(null);
    }
  };

  const onReset = () => {
    setQuery("");
    setSearchedData(null);
    setSearchError(null);
  };

  const handleClearFilters = () => {
    onReset();
    setSelectedLocation('');
    setPropertyType('');
    setGender('');
    setPriceRange('');
    setSeater('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner is full width */}
      <Banner />

      {/* Filter and Content constrained by MaxWidthWrapper */}
      <MaxWidthWrapper>
        {/* Filter component which negatively overlaps the banner */}
        <Filter
          location={selectedLocation}
          onSelectLocation={setSelectedLocation}
          onSearchProperties={searchProperties}
          searchError={searchError}
          propertyType={propertyType}
          onPropertyTypeChange={setPropertyType}
          gender={gender}
          onGenderChange={setGender}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          seater={seater}
          onSeaterChange={setSeater}
          onClearFilters={handleClearFilters}
        />

        {/* Property Grid */}
        <div className="pt-12">
          <Properties
            selectedLocation={selectedLocation}
            sData={searchedData}
            query={query}
            onReset={onReset}
            propertyType={propertyType}
            gender={gender}
            priceRange={priceRange}
            seater={seater}
          />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Property;