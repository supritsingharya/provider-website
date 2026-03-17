'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import {
    User, LogOut, Heart, Calendar, Trash2, AlertTriangle,
    X, ChevronRight, Settings, Shield, MapPin, Phone, Mail, Gift, MessageSquareWarning, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SavedProperties from './SavedProperties';
import ScheduledVisits from './ScheduledVisits';
import ReferAndEarn from './ReferAndEarn';
import Complaints from './Complaints';
import ListProperty from './ListProperty';

import MaxWidthWrapper from '../../app/components/MaxWidthWrapper';

// Animation Variants
const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const slideIn = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' (mobile only), 'saved', 'visits', 'settings', 'refer'
    const [isMobile, setIsMobile] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Default to 'refer' on desktop if in 'menu' mode (it's the first item)
        if (window.innerWidth >= 1024 && activeTab === 'menu') {
            setActiveTab('refer');
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, [activeTab]);

    // Auth Protection
    useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            if (!localStorage.getItem('token')) {
                router.push('/login');
            }
        }
    }, [user, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(false);
        alert('Delete account request submitted (UI Demo Only)');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const menuItems = [
        { id: 'refer', label: 'Refer & Earn', icon: Gift, description: 'Invite friends & earn rewards' },
        { id: 'saved', label: 'Saved Properties', icon: Heart, description: 'View your shortlisted hostels & PGs' },
        { id: 'visits', label: 'Scheduled Visits', icon: Calendar, description: 'Track your upcoming property visits' },
        { id: 'list-property', label: 'List Your Property', icon: Home, description: 'List your property for potential tenants' },
        { id: 'complaints', label: 'My Complaints', icon: MessageSquareWarning, description: 'Raise & track issues' },

        // Future items can be added here
        // { id: 'settings', label: 'Account Settings', icon: Settings, description: 'Manage your profile and preferences' },
    ];

    // Mobile "Back" handler
    const handleBack = () => {
        setActiveTab('menu');
    };

    console.log("========USER DETAILS=========", user);

    // Sidebar Component (Desktop)
    const Sidebar = () => (
        <div className="w-full lg:w-80 flex flex-col gap-6">
            {/* User Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-0"></div>
                <div className="relative z-10 mt-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 p-[3px] shadow-xl mb-4 mx-auto group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-violet-600">
                                {user.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">{user.full_name || user.name || 'Student'}</h2>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mx-auto w-fit mb-4 border border-emerald-100">
                        <Shield size={14} className="fill-emerald-600/20" /> Verified User
                    </div>

                    <div className="space-y-2 w-full text-left bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone size={14} className="mr-3 text-indigo-500 shrink-0" />
                            <span className="truncate">{user.username || 'No phone added'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-3 text-indigo-500 shrink-0" />
                            <span className="truncate">{user.email || 'No email added'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu (Desktop) */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg p-4 flex flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-700'}`}
                        >
                            <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                            <span className="font-bold flex-1 text-left">{item.label}</span>
                            {isActive && <ChevronRight size={16} className="text-white/80" />}
                        </button>
                    )
                })}

                <div className="h-px bg-gray-100 my-2"></div>

                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-semibold group"
                >
                    <LogOut size={20} className="mr-3 text-gray-400 group-hover:text-red-500" />
                    Logout
                </button>
            </div>

            <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center justify-center gap-1.5 py-2 opacity-60 hover:opacity-100 transition-opacity"
            >
                <Trash2 size={12} /> Delete Account
            </button>
        </div>
    );

    // Mobile Menu View
    const MobileMenu = () => (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col gap-6 pb-20">
            {/* Mobile User Header */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 p-[2px] shadow-lg shrink-0">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-violet-600">
                            {user.full_name?.charAt(0) || 'U'}
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-black text-gray-900 truncate">{user.full_name || 'Student'}</h2>
                    <p className="text-sm text-gray-500 truncate">{user.email || user.phone}</p>
                </div>
                <button onClick={handleLogout} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                    <LogOut size={18} />
                </button>
            </div>

            {/* Menu Grid */}
            <div className="grid gap-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center text-left group active:scale-95 duration-200"
                        >
                            <div className={`p-3 rounded-2xl mr-4 transition-colors ${item.id === 'refer' ? 'bg-amber-50 text-amber-500' : item.id === 'saved' ? 'bg-pink-50 text-pink-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{item.label}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{item.description}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <ChevronRight size={16} />
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Additional Mobile Options */}
            <div className="mt-4 px-4">
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-4 text-sm font-medium text-red-500 bg-red-50/50 rounded-2xl border border-red-100 flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} /> Delete Account
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Background Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <MaxWidthWrapper>
                <div className="relative z-10 pt-6 pb-20 lg:py-12">

                    {/* Responsive Layout Switcher */}
                    {isMobile ? (
                        activeTab === 'menu' ? (
                            <MobileMenu />
                        ) : (
                            <div className="flex flex-col h-full">
                                {/* Mobile Detail Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        onClick={handleBack}
                                        className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 active:bg-gray-50"
                                    >
                                        <FaArrowLeft size={16} />
                                    </button>
                                    <h1 className="text-2xl font-black text-gray-900">
                                        {menuItems.find(i => i.id === activeTab)?.label}
                                    </h1>
                                </div>
                                <motion.div
                                    key={activeTab}
                                    initial="hidden" animate="visible" exit="exit" variants={slideIn}
                                    className="flex-1"
                                >
                                    {activeTab === 'refer' && <ReferAndEarn />}
                                    {activeTab === 'saved' && <SavedProperties />}
                                    {activeTab === 'visits' && <ScheduledVisits />}
                                    {activeTab === 'list-property' && <ListProperty />}
                                    {activeTab === 'complaints' && <Complaints />}
                                </motion.div>
                            </div>
                        )
                    ) : (
                        // Desktop Layout
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <Sidebar />

                            {/* Main Content Area */}
                            <div className="flex-1 min-w-0">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg p-8 min-h-[600px]"
                                >
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-black text-gray-900 mb-2">{menuItems.find(i => i.id === activeTab)?.label}</h2>
                                        <p className="text-gray-500">{menuItems.find(i => i.id === activeTab)?.description}</p>
                                    </div>

                                    {activeTab === 'refer' && <ReferAndEarn />}
                                    {activeTab === 'saved' && <SavedProperties />}
                                    {activeTab === 'visits' && <ScheduledVisits />}
                                    {activeTab === 'list-property' && <ListProperty />}
                                    {activeTab === 'complaints' && <Complaints />}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </MaxWidthWrapper>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                This action is permanent and cannot be undone. All your saved data will be lost.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Importing FaArrowLeft here locally to avoid large imports at top if not needed everywhere, 
// but consistent with other files, let's use lucide-react arrow if possible or stay consistent. 
// Note: In the code above I used FaArrowLeft from lucide-react? No, lucide uses ArrowLeft. 
// Fixing import to use ArrowLeft from lucide-react to avoid missing dependency or remix icons.

import { ArrowLeft as FaArrowLeft } from 'lucide-react'; 
