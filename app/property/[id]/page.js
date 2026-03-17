'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { revealProperty, toggleSaveProperty } from '../../../lib/property';
import axios from 'axios';
import {
  FaArrowLeft, FaMapMarkerAlt, FaBed, FaCheckCircle,
  FaPhoneAlt, FaWhatsapp, FaHeart, FaRegHeart, FaShare, FaWifi, FaTshirt,
  FaShieldAlt, FaBus, FaDumbbell, FaParking, FaBook, FaSnowflake,
  FaChevronLeft, FaChevronRight, FaExpand,
  FaChevronDown, FaChevronUp, FaPlay, FaMap, FaTimes,
  FaUniversity, FaSubway, FaHospital, FaShoppingBag, FaSearch
} from 'react-icons/fa';
import { BASE_URL } from '../../../lib/endpoints';
import { motion, AnimatePresence } from 'framer-motion';
import MaxWidthWrapper from '../../../app/components/MaxWidthWrapper';

const PropertyDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, token } = useAuth();

  const facilityIconMapping = {
    'Free Unlimited WiFi': FaWifi, 'CCTV': FaShieldAlt, 'Unlimited Laundry with iron': FaTshirt,
    'Transportation': FaBus, 'Gym': FaDumbbell, 'AC': FaSnowflake, 'Parking': FaParking,
    'Fully Furnished': FaBed, 'Library': FaBook, 'Housekeeping (3-4times/week)': FaCheckCircle,
    'Food (Breakfast, Lunch, Snacks & Dinner)': FaCheckCircle,
  };

  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPriceRevealed, setIsPriceRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Nearby Locations State
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [showAllNearby, setShowAllNearby] = useState(false);
  const [nearbySearchText, setNearbySearchText] = useState('');


  // Schedule Visit State
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');

  const handleConfirmVisit = () => {
    if (!visitDate || !visitTime) {
      alert('Please select both a date and time for your visit.');
      return;
    }
    const dateObj = new Date(visitDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const message = `Hello, I would like to schedule a visit for ${property?.attributes?.name} (${id}) on ${formattedDate} at ${visitTime}.`;
    const phoneNumber = '+917303831326';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsVisitModalOpen(false);
    setVisitDate(''); setVisitTime('');
  };

  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const datesList = getDates();
  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM",
    "07:00 PM"
  ];

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://api.dreamprovider.in/api/properties/${id}?populate=*`);
        if (!response.data?.data) throw new Error('Property data not found');
        setProperty(response.data.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Haversine distance calculation
  const computeHaversineDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch nearby locations after property loads
  useEffect(() => {
    if (!property) return;
    const cityId = property.attributes?.city?.data?.id;
    if (!cityId) return;

    const fetchNearbyLocations = async () => {
      try {
        setNearbyLoading(true);
        const response = await axios.get(
          `https://api.dreamprovider.in/api/nearby-locations?filters[city][id]=${cityId}&pagination[limit]=50&populate=*`
        );
        const locations = response.data?.data || [];

        const propLat = property.attributes?.latlng?._latitude;
        const propLon = property.attributes?.latlng?._longitude;

        // Compute distance for each location and sort by closest
        const withDistance = locations.map((loc) => {
          const locLat = loc.attributes?.latlng?.latitude;
          const locLon = loc.attributes?.latlng?.longitude;
          const distance = computeHaversineDistance(propLat, propLon, locLat, locLon);
          return { ...loc, distance };
        });

        withDistance.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });

        setNearbyLocations(withDistance);
      } catch (err) {
        console.error('Error fetching nearby locations:', err);
      } finally {
        setNearbyLoading(false);
      }
    };

    fetchNearbyLocations();
  }, [property]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user?.id || !id || !token) return;
      try {
        const response = await axios.get(`${BASE_URL}api/users/${user.id}?populate=saved_properties`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          const savedProperties = response.data.saved_properties?.data || response.data.saved_properties || [];
          const isAlreadySaved = savedProperties.some((prop) => parseInt(prop.id || prop) === parseInt(id));
          setIsSaved(isAlreadySaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };
    checkSavedStatus();
  }, [user, id, token]);

  useEffect(() => {
    if (!property || isHovered || isFullscreen) return;

    const attr = property.attributes;
    const images = [attr.main_image?.data?.attributes?.url, ...(attr.images?.data?.map(img => img.attributes.url) || [])].filter(Boolean);

    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [property, isHovered, isFullscreen]);


  const handleReveal = async (action, callback) => {
    if (!token) {
      if (confirm('Authentication Required. Please sign in to reveal property information.')) {
        router.push('/login');
      }
      return;
    }
    try {
      await dispatch(revealProperty(JSON.stringify({
        data: { property: parseInt(id), users_permissions_user: user?.id, action: action, token: token }
      }))).unwrap();
      if (callback) callback();
    } catch (error) {
      alert('Failed to process request. Please try again.');
    }
  };

  const handleToggleSave = async () => {
    if (!token) {
      if (confirm('Please sign in to save properties.')) router.push('/login');
      return;
    }
    try {
      const response = await dispatch(toggleSaveProperty({ propertyId: id, token: token, userId: user?.id })).unwrap();
      if (response) setIsSaved(response.isSaved);
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share && property) {
      navigator.share({
        title: property.attributes.name,
        text: `Check out this property: ${property.attributes.name}`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleOpenMap = () => {
    const latlng = property?.attributes?.latlng;
    if (latlng && latlng._latitude && latlng._longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latlng._latitude},${latlng._longitude}`, '_blank');
    } else {
      alert("Location not available on map.");
    }
  };

  // Helper to change image in fullscreen
  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  }

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
  if (isError || !property) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center px-4"><div className="bg-white p-8 rounded-2xl shadow-xl max-w-md"><h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1><Link href="/property" className="text-indigo-600 font-semibold hover:underline">Back to Properties</Link></div></div>;

  const attr = property.attributes;
  const galleryImages = [attr.main_image?.data?.attributes?.url, ...(attr.images?.data?.map(img => img.attributes.url) || [])].filter(Boolean);

  const PropertyHeaderCard = () => (
    <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700"></div>

      <div className="relative z-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {attr.genders?.data?.[0] && <span className="bg-blue-500/10 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">{attr.genders.data[0].attributes.name}</span>}
          <span className="bg-purple-500/10 text-purple-600 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">{attr.property_types}</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight leading-tight">{attr.name}</h1>
        <div className="flex items-start text-gray-500 text-sm font-medium mb-6">
          <FaMapMarkerAlt className="mr-2 mt-1 text-indigo-500 shrink-0" />
          <span>{attr.address}</span>
        </div>

        <div className="flex justify-around items-center pt-6 border-t border-gray-100/50">
          {attr.video_url && <ActionButton icon={FaPlay} label="Video Tour" onClick={() => handleReveal('view_video', () => window.open(attr.video_url, '_blank'))} disabled={!attr.video_url} />}
          <ActionButton icon={FaPhoneAlt} label="Call Owner" onClick={() => handleReveal('call_owner(web)', () => window.location.href = `tel:${attr.owner_number}`)} />
          <ActionButton icon={FaMap} label="Get Directions" onClick={() => handleReveal('view_map(web)', handleOpenMap)} />
        </div>
      </div>
    </div>
  );

  const ActionButton = ({ icon: Icon, label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`flex flex-col items-center gap-2 group/btn ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 group-hover/btn:bg-indigo-600 group-hover/btn:text-white transition-all duration-300 group-hover/btn:shadow-indigo-500/30 group-hover/btn:scale-110">
        <Icon size={18} />
      </div>
      <span className="text-xs font-bold text-gray-500 group-hover/btn:text-indigo-600 transition-colors">{label}</span>
    </button>
  );

  // Helper: Icon and color for nearby location type
  const getLocationTypeConfig = (type) => {
    switch (type) {
      case 'college':
        return { icon: FaUniversity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700' };
      case 'metro':
        return { icon: FaSubway, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', badge: 'bg-purple-100 text-purple-700' };
      case 'bus_stop':
        return { icon: FaBus, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700' };
      case 'hospital':
        return { icon: FaHospital, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', badge: 'bg-red-100 text-red-700' };
      case 'market':
        return { icon: FaShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' };
      default:
        return { icon: FaMapMarkerAlt, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', badge: 'bg-indigo-100 text-indigo-700' };
    }
  };

  const NearbyLocationsCard = () => {
    const filtered = nearbyLocations.filter((loc) =>
      loc.attributes?.name?.toLowerCase().includes(nearbySearchText.toLowerCase())
    );
    const displayed = showAllNearby ? filtered : filtered.slice(0, 6);
    const hasMore = filtered.length > 6;

    if (nearbyLoading) {
      return (
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-lg p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>What&apos;s Nearby
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (nearbyLocations.length === 0) return null;

    return (
      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>What&apos;s Nearby
          </h3>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search locations..."
              value={nearbySearchText}
              onChange={(e) => setNearbySearchText(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 w-full sm:w-56 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayed.map((loc) => {
            const config = getLocationTypeConfig(loc.attributes?.type);
            const Icon = config.icon;
            const typeName = loc.attributes?.type
              ? loc.attributes.type.replace('_', ' ')
              : 'Location';

            return (
              <div
                key={loc.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${config.bg} border ${config.border} hover:shadow-md transition-all duration-200 group/loc`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${config.color} group-hover/loc:scale-110 transition-transform duration-200`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{loc.attributes?.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${config.badge}`}>
                      {typeName}
                    </span>
                    {loc.distance !== null && (
                      <span className="text-xs font-semibold text-gray-500">
                        {loc.distance < 1
                          ? `${Math.round(loc.distance * 1000)} m`
                          : `${loc.distance.toFixed(1)} km`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-6">No locations match your search.</p>
        )}

        {hasMore && (
          <button
            onClick={() => setShowAllNearby(!showAllNearby)}
            className="mt-4 w-full py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            {showAllNearby ? (
              <><FaChevronUp size={10} /> Show Less</>
            ) : (
              <><FaChevronDown size={10} /> Show All {filtered.length} Locations</>
            )}
          </button>
        )}
      </div>
    );
  };

  const PropertyPriceReveal = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-lg overflow-hidden mb-6">
        <button onClick={() => { if (!isPriceRevealed) handleReveal('view_price(web)', () => { setIsPriceRevealed(true); setIsOpen(true); }); else setIsOpen(!isOpen); }} className="w-full flex justify-between items-center p-6 bg-transparent hover:bg-white/50 transition-colors">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><div className="w-1 h-6 bg-emerald-500 rounded-full"></div>Pricing Details</h3>
          {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 pt-0">
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50 text-center">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Monthly Rent</p>
              <div className="flex flex-col items-center gap-2">
                {Array.isArray(attr.price) && attr.price.length > 0 ? (
                  attr.price.map((p, idx) => (
                    <div key={idx} className="flex flex-col items-center w-full py-2 border-b border-emerald-200/50 last:border-0">
                      <span className="text-3xl font-black text-emerald-900">₹{parseInt(p.price).toLocaleString('en-IN')}</span>
                      <span className="text-sm text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md mt-1">{p.value} {p.duration}</span>
                    </div>
                  ))
                ) : <span className="text-3xl font-black text-emerald-900">₹{attr.price ? attr.price.toLocaleString('en-IN') : 'N/A'}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Restored Schedule Visit Component
  const ScheduleVisitCard = ({ mobile = false }) => (
    <div className={`${mobile ? 'block' : 'hidden lg:block'} bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-lg p-6`}>
      <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
        <FaCheckCircle className="mr-2 text-indigo-500" /> Schedule a Visit
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select Date</label>
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-2 px-2">
            {datesList.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = visitDate === dateStr;
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = date.getDate();
              return (
                <button key={index} onClick={() => setVisitDate(dateStr)} className={`flex flex-col items-center justify-center min-w-[50px] h-[60px] rounded-xl border transition-all flex-shrink-0 ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
                  <span className={`text-[10px] uppercase ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>{dayName}</span>
                  <span className="text-sm font-bold">{dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select Time</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot, index) => (
              <button key={index} onClick={() => setVisitTime(slot)} className={`py-2 px-1 rounded-lg text-[10px] font-bold border transition-all ${visitTime === slot ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
                {slot}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleConfirmVisit} disabled={!visitDate || !visitTime} className={`w-full py-3 text-sm font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${!visitDate || !visitTime ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-green-200'}`}>
          <FaWhatsapp size={18} /> Confirm via WhatsApp
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-50 pb-12">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <MaxWidthWrapper>
        <div className="relative z-10 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Gallery */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="h-[50vh] sm:h-[65vh] relative cursor-pointer" onClick={() => setShowThumbnails(!showThumbnails)}>
                  <Image src={galleryImages[currentImageIndex]} alt={attr.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Watermark Restored */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span className="text-white text-5xl sm:text-7xl font-bold opacity-10 select-none transform -rotate-12">Provider App</span>
                  </div>

                  {/* Controls Overlay */}
                  <div className="absolute top-4 left-4 z-20"><button onClick={(e) => { e.stopPropagation(); router.back() }} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"><FaArrowLeft /></button></div>
                  <div className="absolute top-4 right-4 z-20 flex gap-3">
                    <button onClick={(e) => { e.stopPropagation(); handleToggleSave() }} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">{isSaved ? <FaHeart className="text-red-500" /> : <FaRegHeart />}</button>
                    <button onClick={(e) => { e.stopPropagation(); handleShare() }} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"><FaShare /></button>
                  </div>
                  <div className="absolute bottom-4 right-4 z-20"><button onClick={(e) => { e.stopPropagation(); setIsFullscreen(true) }} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"><FaExpand /></button></div>
                </div>
                {showThumbnails && (
                  <div className="absolute bottom-4 left-4 right-16 flex gap-2 overflow-x-auto pb-2 scrollbar-hide z-20 px-2 mask-linear">
                    {galleryImages.map((img, idx) => (
                      <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx) }} className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentImageIndex ? 'border-white scale-110 shadow-lg' : 'border-white/50 opacity-70'}`}>
                        <Image src={img} alt="thumb" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Layout Order Handling */}
              <div className="block lg:hidden space-y-6">
                <PropertyHeaderCard />
                <PropertyPriceReveal />
                {/* Mobile Schedule Visit Button that opens modal */}
                <button onClick={() => setIsVisitModalOpen(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-300 transform active:scale-95 transition-all">
                  Schedule a Visit
                </button>
              </div>

              {/* Description */}
              <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><div className="w-1 h-6 bg-indigo-500 rounded-full"></div>Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{attr.description || "No description available."}</p>
              </div>

              {/* Facilities */}
              <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><div className="w-1 h-6 bg-indigo-500 rounded-full"></div>Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {attr.facilities?.data?.map((facility) => {
                    const Icon = facilityIconMapping[facility.attributes.value] || FaCheckCircle;
                    return (
                      <div key={facility.id} className="flex items-center p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                        <Icon className="text-indigo-500 mr-3 shrink-0" />
                        <span className="text-sm font-semibold text-gray-700">{facility.attributes.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* What's Nearby */}
              <NearbyLocationsCard />
            </div>

            {/* Right Column: Sticky Sidebar */}
            {/* Right Column: Sidebar */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              {/* Non-Sticky Part */}
              <div className="space-y-6">
                <PropertyHeaderCard />
                <PropertyPriceReveal />
              </div>

              {/* Sticky Part */}
              <div className="sticky top-24 space-y-6 z-1000">
                <ScheduleVisitCard />

                {/* Quick Details Card */}
                <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Details</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Property Type', value: attr.property_types },
                      { label: 'Gender', value: attr.genders?.data?.[0]?.attributes?.name },
                      { label: 'Location', value: attr.location?.data?.attributes?.name }
                    ].map((item, i) => (
                      item.value && <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"><span className="text-gray-500 text-sm">{item.label}</span><span className="font-bold text-gray-800 text-sm">{item.value}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Mobile Visit Modal */}
      <AnimatePresence>
        {isVisitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVisitModalOpen(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full">
              <div className="bg-white rounded-t-3xl p-6 shadow-2xl">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule Visit</h3>
                <ScheduleVisitCard mobile={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Restored & Fixed Fullscreen Image Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-all duration-300" // Highest z-index
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button - Enhanced Visibility */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[10002] backdrop-blur-md shadow-lg"
              aria-label="Close"
            >
              <FaTimes size={28} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              {/* Navigation Buttons - Enhanced */}
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-6 p-4 text-white hover:bg-white/10 rounded-full transition-all z-[10001]"
              >
                <FaChevronLeft size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-6 p-4 text-white hover:bg-white/10 rounded-full transition-all z-[10001]"
              >
                <FaChevronRight size={32} />
              </button>

              <div className="relative w-full h-[80vh] sm:h-[85vh]">
                <Image
                  src={galleryImages[currentImageIndex]}
                  alt="Full"
                  fill
                  className="object-contain select-none"
                  priority
                  quality={100}
                />
                {/* Watermark in Fullscreen */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10000]">
                  <span className="text-white/10 text-5xl sm:text-8xl font-black transform -rotate-45 select-none whitespace-nowrap">Provider App</span>
                </div>
              </div>

              {/* Thumbnail Strip in Fullscreen */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 overflow-x-auto px-4 z-[10002] no-scrollbar py-2" onClick={(e) => e.stopPropagation()}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentImageIndex ? 'border-white scale-110 shadow-2xl' : 'border-white/30 opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetailPage;