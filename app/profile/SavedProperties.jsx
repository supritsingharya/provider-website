import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSavedProperties } from '../../lib/property'; // Adjust import path
import PropertyCard from '../property/PropertyCard'; // Adjust import path
import { Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SavedProperties = () => {
    const dispatch = useDispatch();
    const { user, token } = useAuth(); // Get auth from context
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSavedProperties = async () => {
            // Wait for auth to be ready
            if (!user || !token) return;

            try {
                setLoading(true);
                // Pass auth args to thunk to avoid Redux state race condition
                const result = await dispatch(fetchSavedProperties({
                    userId: user.id,
                    token
                })).unwrap();

                // Normalize data for PropertyCard which expects nested 'attributes' structure
                const rawProperties = result.data || [];
                const normalizedProperties = rawProperties.map(prop => {
                    // If already has attributes (standard Strapi response), return as is
                    if (prop.attributes) return prop;

                    // If flat structure (User API populate response), wrap in attributes
                    return {
                        id: prop.id,
                        attributes: {
                            ...prop,
                            // Map nested arrays to { data: [{ attributes: ... }] } format
                            images: {
                                data: prop.images?.map(img => ({
                                    id: img.id,
                                    attributes: img
                                })) || []
                            },
                            genders: {
                                data: prop.genders?.map(g => ({
                                    id: g.id,
                                    attributes: g
                                })) || []
                            },
                            seaters: {
                                data: prop.seaters?.map(s => ({
                                    id: s.id,
                                    attributes: s
                                })) || []
                            }
                        }
                    };
                });

                setProperties(normalizedProperties);
            } catch (err) {
                console.error("Failed to fetch saved properties:", err);
                setError("Failed to load saved properties.");
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            loadSavedProperties();
        }
    }, [dispatch, user, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                {error}
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No saved properties found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
                <PropertyCard
                    key={property.id}
                    singleData={property}
                    index={index}
                />
            ))}
        </div>
    );
};

export default SavedProperties;
