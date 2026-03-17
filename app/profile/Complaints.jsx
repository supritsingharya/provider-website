import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMyComplaints } from '../../lib/property';
import { Loader, AlertCircle, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import RaiseComplaint from './RaiseComplaint'; // Import the new component (to be created)

const ComponentItem = ({ item }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold mb-2">
                        #{item.id}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg">
                        {item.attributes.complaint_type?.data?.attributes?.name || 'General Complaint'}
                    </h3>
                </div>
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                    {new Date(item.attributes.createdAt).toLocaleString()}
                </span>
            </div>

            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Issues:</h4>
                <div className="flex flex-wrap gap-2">
                    {item.attributes.issues?.map((k, i) => (
                        <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                            {k.issue} : {k.selected}
                        </span>
                    ))}
                </div>
            </div>

            {item.attributes.notes && (
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 border border-gray-100">
                    <span className="font-semibold text-gray-900">Notes: </span>
                    {item.attributes.notes}
                </div>
            )}
        </div>
    );
};

const Complaints = () => {
    const dispatch = useDispatch();
    const { user, token } = useAuth();
    const [complaintData, setComplaintData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [showRaiseComplaint, setShowRaiseComplaint] = useState(false);

    const fetchComplaintsData = async () => {
        if (!user || !token) return;

        try {
            setLoading(true);
            const response = await dispatch(fetchMyComplaints({
                start: 0, // Simplified pagination for now
                limit: 50, // Increase limit
                userId: user.id,
                token
            })).unwrap();

            setComplaintData(response.data || []);
        } catch (err) {
            console.error("Failed to fetch complaints:", err);
            setError("Failed to load complaints.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user && token && !showRaiseComplaint) {
            fetchComplaintsData();
        }
    }, [dispatch, user, token, showRaiseComplaint]);

    if (showRaiseComplaint) {
        return (
            <RaiseComplaint
                onBack={() => setShowRaiseComplaint(false)}
                onSuccess={() => {
                    setShowRaiseComplaint(false);
                    fetchComplaintsData(); // Refresh list after submission
                }}
            />
        );
    }

    if (loading && complaintData.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p>{error}</p>
                <button
                    onClick={fetchComplaintsData}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Complaints</h2>
                    <p className="text-sm text-gray-500">View and manage your raised issues</p>
                </div>
                <button
                    onClick={() => setShowRaiseComplaint(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    <MessageSquarePlus size={18} />
                    Raise New
                </button>
            </div>

            {complaintData.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <MessageSquarePlus size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Complaints Yet</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        You haven't raised any complaints. If you have an issue, please let us know.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {complaintData.map((item) => (
                        <ComponentItem key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Complaints;
