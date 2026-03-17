'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
// import axios from "axios"; // No longer using axios directly here
import { useFetchCollegeBySlug } from "../../hooks/useFetchColleges";

// --- ICONS ---
// Using a mix of react-icons and lucide-react for the best of both worlds
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { FiCheckCircle } from 'react-icons/fi'; // A great, clean checkmark for lists
import { FileText, ClipboardList, ClipboardCheck, Award, Building, School, HelpCircle } from 'lucide-react'; // Polished icons for details

// --- DATA & COMPONENTS ---
// import faqData from "./faqData"; // Static data removed
import LoadingOverlay from './LoadingOverlay';

// Query removed - using useFetchCollegeBySlug hook

// A small component for clean section headers
const SectionHeader = ({ title }) => (
    <h3 className="text-3xl font-bold text-slate-800 pb-4 mb-8 border-b-2 border-slate-200">
        {title}
    </h3>
);

// The main, redesigned Details component
const Details = ({ slug }) => { // Receiving slug instead of id
    const { data: collegeData, isLoading, error } = useFetchCollegeBySlug(slug);

    // Transform API data to match component expectations
    const attributes = collegeData?.attributes;
    const data = attributes
        ? {
            id: collegeData.id,
            ...attributes,
            title: attributes.name,
            location: attributes.locationName || "Unknown Location",
            imgLink: attributes.imgLink || attributes.banner?.data?.attributes?.url,
        }
        : null;

    const sliderRef = useRef(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const scrollBy = (amount) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingOverlay /></div>;
    }

    if (error || !data) {
        return <div className="min-h-screen flex items-center justify-center">College not found</div>;
    }

    const backgroundImageStyle = data?.imgLink ? { backgroundImage: `url(${data.imgLink})` } : {};

    return (
        <div className="font-sans bg-slate-50">
            {/* --- HERO BANNER --- */}
            <section className="relative h-64 md:h-80 bg-cover bg-center" style={backgroundImageStyle}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative h-full flex flex-col justify-end container mx-auto px-4 pb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                        {data.title}
                    </h1>
                    <p className="mt-2 flex items-center text-lg text-gray-200 font-medium">
                        <FaMapMarkerAlt className="mr-2" /> {data.location}
                    </p>
                </div>
            </section>

            {/* --- MAIN CONTENT & SIDEBAR --- */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-16">

                    {/* -- Main Content (Left Column) -- */}
                    <div className="lg:col-span-8">

                        {/* Description Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-900/5 mb-12">
                            <SectionHeader title="About the College" />
                            <p className="text-slate-600 leading-relaxed prose">{data.description}</p>
                        </div>

                        {/* Fee Structure Card */}
                        {data.FeeMatrix && (
                            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-900/5 mb-12">
                                <SectionHeader title="Fee Structure (2024-2025)" />
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b bg-slate-50">
                                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Course</th>
                                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Fees</th>
                                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Total Seats</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(data.FeeMatrix).map(([course, details]) => (
                                                <tr key={course} className="border-b last:border-0 hover:bg-slate-50/70 transition-colors">
                                                    <td className="p-4 font-medium text-slate-800">{course}</td>
                                                    <td className="p-4 text-slate-600">{details.fees}</td>
                                                    <td className="p-4 text-slate-600">{details.seats}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Documents & Eligibility Grid */}
                        <div className="grid md:grid-cols-2 gap-12 mb-12">
                            {data.docReq && <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-900/5">
                                <h4 className="text-2xl font-bold text-slate-800 mb-5">Documents Required</h4>
                                <ul className="space-y-3">
                                    {data.docReq.map((doc, i) => (
                                        <li key={i} className="flex items-start text-slate-600">
                                            <FiCheckCircle className="text-green-500 mr-3 mt-1 shrink-0" /> {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>}
                            {data.eligibility && <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-900/5">
                                <h4 className="text-2xl font-bold text-slate-800 mb-5">Eligibility</h4>
                                <ul className="space-y-3">
                                    {data.eligibility.map((item, i) => (
                                        <li key={i} className="flex items-start text-slate-600">
                                            <FiCheckCircle className="text-green-500 mr-3 mt-1 shrink-0" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>}
                        </div>

                        {/* Companies Visited Scroller */}
                        {data.companies?.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-900/5 mb-12">
                                <SectionHeader title="Top Recruiting Companies" />
                                <div className="relative">
                                    <div ref={sliderRef} className="flex items-center gap-12 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]">
                                        {data.companies.map((link, index) => (
                                            <div key={index} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                                                <img src={link} alt={`Company logo ${index + 1}`} width={140} height={70} className="object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => scrollBy(-350)} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-blue-100 transition ring-1 ring-slate-200"><FaChevronLeft /></button>
                                    <button onClick={() => scrollBy(350)} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-blue-100 transition ring-1 ring-slate-200"><FaChevronRight /></button>
                                </div>
                            </div>
                        )}

                        {/* --- FAQ --- */}
                        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg shadow-slate-900/5 mb-12">
                            <SectionHeader title="Frequently Asked Questions" />
                            <div className="space-y-3 sm:space-y-4">
                                {(data.faqs || []).map((item, i) => (
                                    <div
                                        key={i}
                                        className="border border-slate-200 rounded-xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleFaq(i)}
                                            className="flex items-center justify-between w-full p-3 sm:p-4 text-left hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="flex items-start sm:items-center flex-1 min-w-0">
                                                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                                                <span className="font-medium text-slate-800 text-sm sm:text-base pr-2 leading-tight sm:leading-normal">{item.title}</span>
                                            </span>
                                            <FaChevronDown
                                                className={`transition-transform duration-300 text-slate-400 w-4 h-4 flex-shrink-0 ${openFaqIndex === i ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        {openFaqIndex === i && (
                                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                                                {item.details || "Answer not available."}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- Gallery --- */}
                        {data.gallery?.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-900/5 mb-12">
                                <SectionHeader title="Campus Gallery" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {data.gallery.map((img, i) => (
                                        <div key={i} className="overflow-hidden rounded-lg aspect-[4/3]">
                                            <img
                                                src={img.img}
                                                alt={`Gallery ${i + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Google Map */}
                        {data.mapLink && typeof data.mapLink === 'string' && (
                            <div className="bg-white rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden">
                                <div className="w-full h-96" dangerouslySetInnerHTML={{ __html: data.mapLink }} />
                            </div>
                        )}
                    </div>

                    {/* -- Sidebar (Right Column) -- */}
                    <aside className="lg:col-span-4 lg:sticky top-10 h-fit mt-12 lg:mt-0">
                        {/* Quick Information */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200/80 mb-6">
                            <h4 className="text-2xl font-bold text-slate-800 mb-5">Quick Information</h4>
                            <ul className="space-y-4 text-lg">
                                <li className="flex items-center text-slate-700"><School className="h-6 w-6 text-blue-500 mr-4 shrink-0" /> <div><span className="font-semibold">Established:</span> {data.year}</div></li>
                                <li className="flex items-center text-slate-700"><Award className="h-6 w-6 text-indigo-500 mr-4 shrink-0" /> <div><span className="font-semibold">NAAC Grade:</span> {data.grade}</div></li>
                                <li className="flex items-center text-slate-700"><Building className="h-6 w-6 text-purple-500 mr-4 shrink-0" /> <div><span className="font-semibold">Area:</span> {data.area}</div></li>
                            </ul>
                        </div>

                        {/* More Details Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200/80">
                            <h4 className="text-2xl font-bold text-slate-800 mb-5">More Details</h4>
                            <div className="space-y-3">
                                <a href="#" download className="group flex items-center bg-slate-50 p-4 rounded-lg hover:bg-blue-100 hover:scale-105 transition-all">
                                    <FileText className="h-8 w-8 text-blue-500 mr-4 transition-transform group-hover:-translate-y-1" />
                                    <div>
                                        <h5 className="font-bold text-slate-700">Cut Off 2023</h5>
                                    </div>
                                </a>
                                <a href="#" download className="group flex items-center bg-slate-50 p-4 rounded-lg hover:bg-indigo-100 hover:scale-105 transition-all">
                                    <ClipboardList className="h-8 w-8 text-indigo-500 mr-4 transition-transform group-hover:-translate-y-1" />
                                    <div>
                                        <h5 className="font-bold text-slate-700">Admission Process</h5>
                                    </div>
                                </a>
                                <a href="/DocumentRequired.pdf" download className="group flex items-center bg-slate-50 p-4 rounded-lg hover:bg-purple-100 hover:scale-105 transition-all">
                                    <ClipboardCheck className="h-8 w-8 text-purple-500 mr-4 transition-transform group-hover:-translate-y-1" />
                                    <div>
                                        <h5 className="font-bold text-slate-700">Documents Required</h5>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default Details;