import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchComplaints, postComplaints, fetchMyBookings, fetchSavedProperties } from '../../lib/property';
import { useAuth } from '../../hooks/useAuth';
import { Loader, ArrowLeft, CheckCircle, AlertCircle, Home } from 'lucide-react';

const RaiseComplaint = ({ onBack, onSuccess }) => {
    const dispatch = useDispatch();
    const { user, token } = useAuth();



    // Steps: 'loading_properties', 'no_properties', 'error', 'property_selection' (if multiple), 'type_selection', 'issue_selection', 'notes' 
    const [step, setStep] = useState('loading_properties');

    // Data
    const [userProperties, setUserProperties] = useState([]); // Unified list of properties (booked + saved)
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [complaintTypes, setComplaintTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [typeDetails, setTypeDetails] = useState(null); // Details with sub-types requiring deep fetch

    // Form State
    const [selectedIssues, setSelectedIssues] = useState({}); // { "SubType Name": ["Issue 1", "Issue 2"] }
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Initial load - Fetch User's Booked AND Saved Properties
    useEffect(() => {
        const loadProperties = async () => {
            if (!user || !token) return;
            try {
                setLoading(true);

                // Fetch both in parallel
                const [bookingsResult, savedResult] = await Promise.allSettled([
                    dispatch(fetchMyBookings({ userId: user.id, token })).unwrap(),
                    dispatch(fetchSavedProperties({ userId: user.id, token })).unwrap()
                ]);

                let allProperties = [];
                const addedPropertyIds = new Set();

                // Process Bookings (Higher priority?)
                if (bookingsResult.status === 'fulfilled' && bookingsResult.value?.data) {
                    bookingsResult.value.data.forEach(booking => {
                        const propData = booking.attributes?.property?.data;
                        if (propData && !addedPropertyIds.has(propData.id)) {
                            allProperties.push({
                                id: propData.id, // reliable Property ID
                                name: propData.attributes?.name || `Property #${propData.id}`,
                                city: propData.attributes?.city?.data?.attributes?.name,
                                location: propData.attributes?.location?.data?.attributes?.name,
                                source: 'Booked', // Label
                                originalData: booking // Keep reference if needed
                            });
                            addedPropertyIds.add(propData.id);
                        }
                    });
                }

                // Process Saved Properties
                if (savedResult.status === 'fulfilled' && savedResult.value?.data) {
                    const savedProps = savedResult.value.data;
                    savedProps.forEach(prop => {
                        // Normalize saved property structure (might be flat or nested attributes)
                        const propId = prop.id;
                        const attributes = prop.attributes || prop; // Handle both structures

                        // Check uniqueness
                        if (propId && !addedPropertyIds.has(propId)) {
                            allProperties.push({
                                id: propId,
                                name: attributes.name || `Property #${propId}`,
                                city: attributes.city?.data?.attributes?.name || attributes.city?.name, // handle potential structure diffs
                                location: attributes.location?.data?.attributes?.name || attributes.location?.name,
                                source: 'Saved',
                                originalData: prop
                            });
                            addedPropertyIds.add(propId);
                        }
                    });
                }

                setUserProperties(allProperties);

                if (allProperties.length === 0) {
                    setError("You don't have any booked or saved properties to raise a complaint for.");
                    setStep('no_properties');
                } else if (allProperties.length === 1) {
                    // Auto-select if only one property
                    setSelectedProperty(allProperties[0]);
                    setStep('type_selection');
                    loadComplaintTypes(); // Start loading types immediately
                } else {
                    setStep('property_selection');
                }
            } catch (err) {
                console.error("Failed to load properties:", err);
                setError("Failed to load your properties. Please try again.");
                setStep('error');
            } finally {
                setLoading(false);
            }
        };
        loadProperties();
    }, [dispatch, user, token]);

    const loadComplaintTypes = async () => {
        try {
            const result = await dispatch(fetchComplaints()).unwrap();
            if (result.data) {
                setComplaintTypes(result.data);
            }
        } catch (err) {
            console.error("Failed to load complaint types:", err);
            setError("Failed to load complaint types. Please try again.");
        }
    };

    const handlePropertySelect = (property) => {
        setSelectedProperty(property);
        setStep('type_selection');
        if (complaintTypes.length === 0) {
            loadComplaintTypes();
        }
    };

    // Fetch details when a type is selected
    const handleTypeSelect = async (type) => {
        try {
            setSelectedType(type);
            setLoading(true);
            setError(null);

            // Fetch deep details for this specific type ID
            const result = await dispatch(fetchComplaints(type.id)).unwrap();
            if (result.data) {
                setTypeDetails(result.data);
                setStep('issue_selection');
            }
        } catch (err) {
            console.error("Failed to load type details:", err);
            setError("Failed to load options for this complaint type.");
            setSelectedType(null); // Reset selection on fail
        } finally {
            setLoading(false);
        }
    };

    const handleIssueToggle = (subTypeName, issueName) => {
        setSelectedIssues(prev => {
            const currentIssues = prev[subTypeName] || [];
            const isSelected = currentIssues.includes(issueName);

            let newIssues;
            if (isSelected) {
                newIssues = currentIssues.filter(i => i !== issueName);
            } else {
                newIssues = [...currentIssues, issueName];
            }

            // If empty, remove the key entirely (optional, but cleaner)
            if (newIssues.length === 0) {
                const { [subTypeName]: _, ...rest } = prev;
                return rest;
            }

            return { ...prev, [subTypeName]: newIssues };
        });
    };

    const handleSubmit = async () => {
        if (!user || !token || !selectedProperty) return;

        // Validation: Must select at least one issue
        const hasIssues = Object.values(selectedIssues).some(arr => arr.length > 0);
        if (!hasIssues) {
            setError("Please select at least one issue.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            // Get property ID from the selected property object
            const propertyId = selectedProperty.id;

            if (!propertyId) {
                throw new Error("Invalid property ID.");
            }

            const payload = {
                users_permissions_user: user.id,
                complaint_type: selectedType.id,
                propertyId: propertyId.toString(), // Add propertyId as string
                status: 'Pending', // Default status
                issues: Object.entries(selectedIssues).map(([issueCategory, selections], index) => ({
                    id: index,
                    issue: issueCategory,
                    selected: selections.join(', ')
                })),
                notes: notes,
                token: token
            };

            await dispatch(postComplaints(payload)).unwrap();
            onSuccess(); // Close and refresh
        } catch (err) {
            console.error("Failed to submit complaint:", err);
            setError("Failed to submit complaint. " + (err.message || "Please try again."));
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoBack = () => {
        if (step === 'issue_selection') {
            setStep('type_selection');
        } else if (step === 'type_selection') {
            // If manual selection was possible (more than 1 property), go back to property selection
            if (userProperties.length > 1) {
                setStep('property_selection');
            } else {
                onBack();
            }
        } else {
            onBack();
        }
    };

    if (loading && !selectedType && step !== 'loading_properties') {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (step === 'loading_properties') {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-center">
                <Loader className="animate-spin text-indigo-600 mb-4" size={32} />
                <p className="text-gray-500">Retrieving your bookings...</p>
            </div>
        );
    }

    if (step === 'no_properties' || step === 'error') {
        return (
            <div className="flex flex-col justify-center items-center h-full text-center p-8">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Unavailable</h3>
                <p className="text-gray-600 mb-6">{error || "Something went wrong."}</p>
                <button onClick={onBack} className="px-6 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-900 truncate">
                    {step === 'property_selection' ? 'Select Property' :
                        step === 'type_selection' ? 'Select Category' :
                            `${selectedType?.attributes?.name || 'Details'}`}
                </h2>
            </div>

            {error && step !== 'no_properties' && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Step 0: Property Selection (only if multiple) */}
            {step === 'property_selection' && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-2">Select the property you are complaining about:</p>
                    {userProperties.map((prop) => {
                        return (
                            <button
                                key={prop.id}
                                onClick={() => handlePropertySelect(prop)}
                                className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left gap-4"
                            >
                                <div className={`p-3 rounded-lg ${prop.source === 'Booked' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                    <Home size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-900">{prop.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${prop.source === 'Booked' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                                            {prop.source}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{prop.city || 'Unknown City'}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Step 1: Type Selection */}
            {step === 'type_selection' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {complaintTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleTypeSelect(type)}
                            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-50 transition-all group"
                        >
                            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors">
                                {type.attributes?.icon?.data?.[0]?.attributes?.url ? (
                                    <img
                                        src={type.attributes.icon.data[0].attributes.url}
                                        alt={type.attributes.name}
                                        className="w-10 h-10 object-contain"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-200" />
                                )}
                            </div>
                            <span className="font-bold text-gray-700 group-hover:text-indigo-600 text-center">
                                {type.attributes.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Step 2: Issue Selection & Notes */}
            {step === 'issue_selection' && typeDetails && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader className="animate-spin text-indigo-600" />
                            </div>
                        ) : (
                            typeDetails.attributes?.complaint_sub_types?.data?.map((subType) => (
                                <div key={subType.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4 text-lg border-b border-gray-100 pb-2">
                                        {subType.attributes.Name}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {subType.attributes.ComplaintIssue?.map((issue, idx) => {
                                            const isSelected = selectedIssues[subType.attributes.Name]?.includes(issue.name);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleIssueToggle(subType.attributes.Name, issue.name)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${isSelected
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {issue.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="pt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Describe your issue in more detail..."
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-32 text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-6 mt-auto border-t border-gray-100">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Complaint
                                    <CheckCircle size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RaiseComplaint;
