import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postProperty, fetchFacilities, fetchAllSeaterTypes, uploadImage } from '../../lib/property';
import { useAuth } from '../../hooks/useAuth';
import { useFetchLocation } from '../../hooks/useFetchLocations';
import {
    Loader, CheckCircle, AlertCircle, Building, MapPin, Phone, Home,
    ArrowLeft, ArrowRight, Image as ImageIcon, Upload, Trash2, Plus, DollarSign, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
    { id: 'basic', title: 'Basic Details' },
    { id: 'location', title: 'Location' },
    { id: 'images', title: 'Images' },
    { id: 'pricing', title: 'Pricing & Seaters' },
    { id: 'review', title: 'Review & Submit' }
];

const ListProperty = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const { user, token } = useAuth();
    const { data: locationData, isSuccess: locationSuccess } = useFetchLocation();

    const [currentStep, setCurrentStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Data Sources
    const [cities, setCities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [facilitiesList, setFacilitiesList] = useState([]);
    const [seaterTypes, setSeaterTypes] = useState([]);
    const [genders] = useState([
        { id: 1, name: 'Boys' },
        { id: 2, name: 'Girls' },
        { id: 3, name: 'Both' }
    ]);

    // Form State matching mobile app structure
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        property_types: '', // Hostel, PG, Room, Flat
        owner_number: '',
        with_owner: true,
        number_of_beds: '',
        genders: [], // Array of IDs

        city: '', // ID
        location: '', // ID

        facilities: [], // Array of IDs

        images: [], // Array of uploaded image IDs
        main_image: '', // ID of main image

        seaters_details: [], // Array of { id, name, price, duration, deposit, etc }
    });

    // Temp state for file selection before upload
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (locationSuccess && locationData?.cities?.data) {
            setCities(locationData.cities.data);
        }

        dispatch(fetchFacilities()).then((res) => {
            if (res.payload?.data) setFacilitiesList(res.payload.data);
        });

        dispatch(fetchAllSeaterTypes()).then((res) => {
            if (res.payload?.data) setSeaterTypes(res.payload.data);
        });
    }, [dispatch, locationData, locationSuccess]);


    // Update locations when city changes
    useEffect(() => {
        if (formData.city) {
            const selectedCityData = cities.find(city => city.id.toString() === formData.city.toString());
            if (selectedCityData) {
                setLocations(selectedCityData.attributes.locations?.data || []);
            } else {
                setLocations([]);
            }
        } else {
            setLocations([]);
        }
    }, [formData.city, cities]);


    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenderSelect = (id) => {
        setFormData(prev => {
            const current = prev.genders || [];
            if (current.includes(id)) {
                return { ...prev, genders: current.filter(g => g !== id) };
            } else {
                return { ...prev, genders: [...current, id] };
            }
        });
    };

    const handleFacilitySelect = (id) => {
        setFormData(prev => {
            const current = prev.facilities || [];
            if (current.includes(id)) {
                return { ...prev, facilities: current.filter(f => f !== id) };
            } else {
                return { ...prev, facilities: [...current, id] };
            }
        });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        const validFiles = files.filter(file => {
            if (file.size > MAX_SIZE) {
                setError(`File ${file.name} is too large. Max size is 5MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setError(null); // Clear previous errors if we have valid files
            setSelectedFiles(prev => [...prev, ...validFiles]);
        }
    };

    const handleUploadImages = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        try {
            const res = await dispatch(uploadImage({ images: selectedFiles, token })).unwrap();

            // Assume res is array of uploaded file objects with 'id'
            const uploadedIds = res.map(img => img.id);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedIds],
                main_image: prev.main_image || uploadedIds[0] // Set first image as main if not set
            }));
            setSelectedFiles([]); // Clear queue
        } catch (err) {
            console.error("Upload failed", err);
            setError("Failed to upload images: " + err);
        } finally {
            setIsUploading(false);
        }
    };

    // Seater Logic
    const [availableSeaters, setAvailableSeaters] = useState([]);

    useEffect(() => {
        // Filter seater types based on property type if needed
        // For now, show all applicable
        let filtered = seaterTypes;
        const type = formData.property_types?.toLowerCase();

        if (type === 'hostel') {
            filtered = seaterTypes.filter(s => s.attributes.value.includes('Seater'));
        } else if (type === 'flat') {
            filtered = seaterTypes.filter(s => s.attributes.value.includes('BHK'));
        }

        setAvailableSeaters(filtered);
    }, [formData.property_types, seaterTypes]);

    const handleAddSeater = (typeId, typeName) => {
        // Check if already exists
        if (formData.seaters_details.find(s => s.id === typeId)) return;

        const newSeater = {
            id: typeId,
            name: typeName,
            price: '',
            duration: 'monthly', // default
            deposit_amount: '',
            refundable: true
        };

        setFormData(prev => ({
            ...prev,
            seaters_details: [...prev.seaters_details, newSeater]
        }));
    };

    const handleRemoveSeater = (id) => {
        setFormData(prev => ({
            ...prev,
            seaters_details: prev.seaters_details.filter(s => s.id !== id)
        }));
    };

    const handleSeaterUpdate = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            seaters_details: prev.seaters_details.map(s =>
                s.id === id ? { ...s, [field]: value } : s
            )
        }));
    };


    // Navigation Logic
    const nextStep = () => {
        // Validation per step
        setError(null);
        if (currentStep === 0) { // Basic
            if (!formData.name || !formData.property_types || !formData.owner_number || !formData.genders.length) {
                setError("Please fill all required basic details.");
                return;
            }
        }
        if (currentStep === 1) { // Location
            if (!formData.city || !formData.location || !formData.address) {
                setError("Please complete location details.");
                return;
            }
        }
        if (currentStep === 2) { // Images
            // Ensure at least one image uploaded?? Mobile doesn't strictly enforce but good practice
            if (formData.images.length === 0 && selectedFiles.length === 0) {
                // Allow but maybe warn? Let's enforce 1 image
                setError("Please upload at least one image.");
                return;
            }
            if (selectedFiles.length > 0) {
                setError("Please click 'Upload' to confirm your selected images.");
                return;
            }
        }
        if (currentStep === 3) { // Pricing
            if (formData.seaters_details.length === 0) {
                setError("Please add at least one room/seater configuration.");
                return;
            }
            // Validate prices
            const invalid = formData.seaters_details.find(s => !s.price);
            if (invalid) {
                setError(`Please set a price for ${invalid.name}`);
                return;
            }
        }

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setError(null);
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!user || !token) {
            setError("You must be logged in.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            // Format Data for API (matching mobile logic)
            // mobile: seaters: propertyData.seaters_details.map(s => parseInt(s.id))
            // mobile: property_pricing: [{ name: 'All', price_json: [...] }]

            const payload = {
                ...formData,
                seaters: formData.seaters_details.map(s => s.id),
                property_pricing: [
                    {
                        name: 'All',
                        price_json: formData.seaters_details.map(s => ({
                            price: s.price,
                            sharing_name: s.name,
                            duration: s.duration || 'monthly',
                            deposit_amount: s.deposit_amount,
                            refundable: s.refundable,
                            id: s.id // needed? mobile app just mapped price/sharing_name in one view, but stored ID in seaters array
                        }))
                    }
                ],
                // Ensure IDs are integers
                city: parseInt(formData.city),
                location: parseInt(formData.location),
                token,
                userData: user
            };

            await dispatch(postProperty(payload)).unwrap();

            setSuccess(true);
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error("Submission failed", err);
            // Handle error object if it's not a string
            const errorMsg = typeof err === 'object' && err?.message ? err.message : (err || "Failed to list property.");
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };


    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="text-green-600 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Listed Successfully!</h2>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setCurrentStep(0);
                        setFormData({
                            name: '', description: '', address: '', property_types: '', owner_number: '',
                            with_owner: true, number_of_beds: '', genders: [], city: '', location: '',
                            facilities: [], images: [], main_image: '', seaters_details: []
                        });
                    }}
                    className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                    List Another Property
                </button>
            </div>
        );
    }

    // --- Render Steps ---

    const renderBasicStep = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Property Name</label>
                    <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. Sunshine Residency" />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Property Type</label>
                    <select value={formData.property_types} onChange={(e) => handleChange('property_types', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <option value="">Select Type</option>
                        <option value="Hostel">Hostel</option>
                        <option value="PG">PG</option>
                        <option value="Flat">Flat</option>
                        <option value="Room">Room</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Owner Number</label>
                    <input type="tel" value={formData.owner_number} onChange={(e) => handleChange('owner_number', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="10-digit number" />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Number of Beds</label>
                    <input type="number" value={formData.number_of_beds} onChange={(e) => handleChange('number_of_beds', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
            </div>

            <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24" placeholder="Describe your property..." />
            </div>

            <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Property For (Gender)</label>
                <div className="flex gap-3">
                    {genders.map(g => (
                        <button key={g.id} type="button"
                            onClick={() => handleGenderSelect(g.id)}
                            className={`px-4 py-2 rounded-lg border ${formData.genders.includes(g.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {facilitiesList.map(f => (
                        <button key={f.id} type="button"
                            onClick={() => handleFacilitySelect(f.id)}
                            className={`p-2 rounded-lg border text-sm flex items-center justify-center text-center h-12 ${formData.facilities.includes(f.id) ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                            {f.attributes.value}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderLocationStep = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">City</label>
                    <select value={formData.city} onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.attributes.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Location / Area</label>
                    <select value={formData.location} onChange={(e) => handleChange('location', e.target.value)} disabled={!formData.city}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl disabled:opacity-50">
                        <option value="">Select Location</option>
                        {locations.map(l => <option key={l.id} value={l.id}>{l.attributes.name}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Full Address</label>
                <textarea value={formData.address} onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24" placeholder="Enter complete address..." />
            </div>
        </div>
    );

    const renderImagesStep = () => (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <input type="file" multiple onChange={handleFileSelect} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center">
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <p className="font-bold text-gray-700">Click to Select Images</p>
                    <p className="text-sm text-gray-400">JPG, PNG supported</p>
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2">Selected for Upload: {selectedFiles.length} files</h4>
                    <div className="flex flex-wrap gap-2 text-sm text-blue-600">
                        {selectedFiles.map((f, i) => <span key={i} className="bg-white px-2 py-1 rounded border border-blue-200">{f.name}</span>)}
                    </div>
                    <button onClick={handleUploadImages} disabled={isUploading}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2">
                        {isUploading ? <Loader className="animate-spin" size={14} /> : <Upload size={14} />}
                        {isUploading ? 'Uploading...' : 'Upload Now'}
                    </button>
                </div>
            )}

            {formData.images.length > 0 && (
                <div>
                    <h4 className="font-bold text-gray-700 mb-4">Uploaded Images ({formData.images.length})</h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                        {formData.images.map(id => (
                            <div key={id} className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                {/* We don't have URL immediately easily without re-fetching, so just show a placeholder or success state */}
                                <ImageIcon className="text-gray-400" />
                                <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1 rounded">ID: {id}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderPricingStep = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div>
                    <h3 className="font-bold text-indigo-900">Add Room Types</h3>
                    <p className="text-sm text-indigo-700">Select available room/seater types</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {availableSeaters.map(s => {
                    const isAdded = formData.seaters_details.find(d => d.id === s.id);
                    return (
                        <button key={s.id} onClick={() => handleAddSeater(s.id, s.attributes.value)} disabled={isAdded}
                            className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1 ${isAdded ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'}`}>
                            {isAdded ? <CheckCircle size={14} /> : <Plus size={14} />}
                            {s.attributes.value}
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {formData.seaters_details.map(seater => (
                    <div key={seater.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <Home size={16} className="text-indigo-600" /> {seater.name}
                            </h4>
                            <button onClick={() => handleRemoveSeater(seater.id)} className="text-red-400 hover:text-red-600">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Price (₹)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2 top-2.5 text-gray-400" size={14} />
                                    <input type="number" value={seater.price} onChange={(e) => handleSeaterUpdate(seater.id, 'price', e.target.value)}
                                        className="w-full pl-7 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="e.g. 5000" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Duration</label>
                                <div className="relative">
                                    <Calendar className="absolute left-2 top-2.5 text-gray-400" size={14} />
                                    <select value={seater.duration} onChange={(e) => handleSeaterUpdate(seater.id, 'duration', e.target.value)}
                                        className="w-full pl-7 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                        <option value="session">Session</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Security Deposit (₹)</label>
                                <input type="number" value={seater.deposit_amount} onChange={(e) => handleSeaterUpdate(seater.id, 'deposit_amount', e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="e.g. 2000" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderReviewStep = () => (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">{formData.property_types}</p>
                </div>
                <div>
                    <p className="text-gray-500">City</p>
                    <p className="font-medium">{cities.find(c => c.id == formData.city)?.attributes.name}</p>
                </div>
                <div>
                    <p className="text-gray-500">Room Types</p>
                    <p className="font-medium">{formData.seaters_details.length} configured</p>
                </div>
            </div>
            <div className="pt-4 text-center">
                <p className="text-xs text-gray-500 mb-4">By submitting, you allow us to list this property on your behalf.</p>
                <button onClick={handleSubmit} disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                    {submitting ? <Loader className="animate-spin" /> : <CheckCircle />}
                    {submitting ? 'Submitting...' : 'Confirm & Post Property'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building className="text-indigo-600" />
                    List Your Property
                </h2>

                {/* Stepper */}
                <div className="flex flex-wrap items-center mt-6 gap-2">
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${idx === currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : idx < currentStep ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">{idx + 1}</span>
                                <span className="hidden sm:inline">{step.title}</span>
                            </div>
                            {idx < STEPS.length - 1 && <div className="w-4 h-0.5 bg-gray-200 mx-1"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep === 0 && renderBasicStep()}
                        {currentStep === 1 && renderLocationStep()}
                        {currentStep === 2 && renderImagesStep()}
                        {currentStep === 3 && renderPricingStep()}
                        {currentStep === 4 && renderReviewStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            {currentStep < 4 && (
                <div className="pt-4 border-t border-gray-100 flex justify-between mt-auto">
                    <button onClick={prevStep} disabled={currentStep === 0}
                        className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors">
                        Back
                    </button>
                    <button onClick={nextStep}
                        className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all hover:translate-x-1">
                        Next Step <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListProperty;
