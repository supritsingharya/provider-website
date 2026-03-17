import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

const VerificationBadge = ({ type }) => {
    if (!type) return null;
    const styles = {
        provider_verified: "bg-teal-100 text-teal-800",
        listed_by_broker: "bg-yellow-100 text-yellow-800",
        unverified: "bg-red-100 text-red-800",
    };
    const text = {
        provider_verified: "Verified",
        listed_by_broker: "Broker",
        unverified: "Unverified",
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[type] || styles.unverified}`}>
            {text[type] || "N/A"}
        </span>
    );
};

const AvailabilityBadge = ({ status }) => {
    if (!status) return null;

    const styles = {
        available: "bg-green-100 text-green-800",
        fast_filling: "bg-yellow-100 text-yellow-800",
        few_rooms: "bg-orange-100 text-orange-800",
        full: "bg-red-100 text-red-800",
    };

    // Format text: fast_filling -> Fast Filling
    const displayText = status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {displayText}
        </span>
    );
};

const GenderBadge = ({ gender }) => {
    if (!gender) return null;
    return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {gender}
        </span>
    );
};

const PropertyCard = ({ singleData, isListView, index }) => {
    const { attributes } = singleData || {};
    const router = useRouter();

    if (!attributes) return null;

    // Use status directly from attributes, fallback to available if missing
    const availabilityStatus = attributes.status || 'available';

    const navigateToPropertyDetails = () => {
        router.push(`/property/${singleData.id}`);
    };

    const detailsButton = (
        <button onClick={navigateToPropertyDetails} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            View Details
        </button>
    );

    const BadgesOverlay = () => (
        <div className="absolute top-2 right-2 z-10 flex flex-wrap justify-end gap-2">
            <AvailabilityBadge status={availabilityStatus} />
            <GenderBadge gender={attributes.genders?.data?.[0]?.attributes.name} />
            <VerificationBadge type={attributes.verification_type} />
        </div>
    );

    if (isListView) {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl w-full flex flex-col sm:flex-row">
                <div className="relative sm:w-1/3 flex-shrink-0">
                    {/* Fixed landscape aspect ratio container */}
                    <div className="w-full aspect-[4/3] sm:h-48 relative overflow-hidden">
                        <Image
                            src={attributes.main_image?.data?.attributes.url || attributes.images?.data?.[0]?.attributes?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2NjY2MiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzMzMzMzMyIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='}
                            alt={attributes.name}
                            fill
                            className="object-cover cursor-pointer"
                            onClick={navigateToPropertyDetails}
                            priority={index < 2}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 300px"
                        />
                    </div>
                    <BadgesOverlay />
                </div>
                <div className="p-4 sm:p-6 flex flex-col justify-between w-full">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{attributes.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <FaMapMarkerAlt /> {truncateText(attributes.address, 40)}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            {truncateText(attributes.description, 100)}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                            <div><p className="text-gray-500">Type</p><p className="font-semibold">{attributes.property_types || 'N/A'}</p></div>
                            <div><p className="text-gray-500">Seaters</p><p className="font-semibold">{attributes.seaters?.data?.[0]?.attributes.value || 'N/A'}</p></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div>
                            <p className="text-sm text-gray-600">Starting from</p>
                            <p className="text-xl font-bold text-indigo-600">
                                {attributes.price?.[0]?.price}₹ <span className="text-sm font-normal text-gray-500">/ {attributes.price?.[0]?.duration}</span>
                            </p>
                        </div>
                        {detailsButton}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
            <div className="relative">
                {/* Fixed landscape aspect ratio container */}
                <div className="w-full aspect-[4/3] relative overflow-hidden">
                    <Image
                        src={attributes.main_image?.data?.attributes.url || attributes.images?.data?.[0]?.attributes?.url}
                        alt={attributes.name}
                        fill
                        className="object-cover cursor-pointer"
                        onClick={navigateToPropertyDetails}
                        priority={index < 2}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 400px"
                    />
                </div>
                <BadgesOverlay />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{attributes.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <FaMapMarkerAlt /> {truncateText(attributes.address, 30)}
                </p>
                <div className="grid grid-cols-2 gap-4 my-4 text-center text-sm flex-grow">
                    <div><p className="text-gray-500">Type</p><p className="font-semibold">{attributes.property_types || 'N/A'}</p></div>
                    <div><p className="text-gray-500">Seaters</p><p className="font-semibold">{attributes.seaters?.data?.[0]?.attributes.value || 'N/A'}</p></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-lg font-bold text-indigo-600">
                            {attributes.price?.[0]?.price}₹ <span className="text-sm font-normal text-gray-500">/ {attributes.price?.[0]?.duration}</span>
                        </p>
                    </div>
                    {detailsButton}
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;