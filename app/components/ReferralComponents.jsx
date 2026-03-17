import React from 'react';
import { CheckCircle, Clock, XCircle, Users, Copy, Share2, Wallet } from 'lucide-react';

export const StatsCard = ({ title, value, subtext, icon: Icon, colorClass }) => {
    return (
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={`w-24 h-24 ${colorClass.replace('bg-', 'text-')}`} />
            </div>

            <div className="relative z-10 flex items-center space-x-4">
                <div className={`p-4 rounded-xl ${colorClass}/20 backdrop-blur-md ring-1 ring-white/30`}>
                    <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')} drop-shadow-sm`} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tight">{value}</h3>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
                    {subtext && <p className="text-xs text-gray-500 mt-1 font-medium">{subtext}</p>}
                </div>
            </div>
        </div>
    );
};

export const ShareButton = ({ icon: Icon, label, onClick, colorClass }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center space-x-2 py-3 px-8 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto ${colorClass} backdrop-blur-sm ring-1 ring-white/20`}
        >
            <Icon className="w-5 h-5 stroke-2" />
            <span>{label}</span>
        </button>
    );
};

export const ReferralCodeBox = ({ code, onCopy }) => {
    return (
        <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:opacity-100 opacity-50 transition-opacity" />

            <div className="relative z-10 text-center sm:text-left">
                <p className="text-sm text-indigo-100 font-bold mb-1 uppercase tracking-widest">Your Exclusive Code</p>
                <div className="flex items-center space-x-2">
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-widest font-mono drop-shadow-sm">{code || '------'}</h2>
                </div>
            </div>

            <button
                onClick={() => onCopy(code)}
                className="relative z-10 flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all font-bold shadow-md hover:shadow-lg transform active:scale-95"
            >
                <Copy className="w-5 h-5" />
                <span>Copy Code</span>
            </button>
        </div>
    );
};

export const ReferralUserRow = ({ user, status }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'joined':
                return { color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-200', icon: CheckCircle };
            case 'booked':
                return { color: 'text-indigo-600', bg: 'bg-indigo-500/10', border: 'border-indigo-200', icon: Wallet };
            case 'rejected':
                return { color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-200', icon: XCircle };
            default:
                return { color: 'text-slate-600', bg: 'bg-slate-500/10', border: 'border-slate-200', icon: Clock };
        }
    };

    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
        <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl mb-3 hover:shadow-lg hover:border-white transition-all duration-300 group">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-sm group-hover:shadow-md transition-all">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 font-black text-lg">
                            {user?.full_name?.charAt(0) || '?'}
                        </span>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-gray-800">{user?.full_name || 'Unknown User'}</h4>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-1.5 py-0.5 rounded-md mt-0.5">
                        {user?.username ? `${user.username.slice(0, 3)}***${user.username.slice(-2)}` : '******'}
                    </p>
                </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${config.color} ${config.bg} ${config.border}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span className="capitalize">{status || 'Pending'}</span>
            </div>
        </div>
    );
};

export const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-gray-300 mt-4">
        <div className="bg-white p-6 rounded-full shadow-lg mb-6 ring-4 ring-indigo-50">
            <Users className="w-12 h-12 text-indigo-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No referrals yet</h3>
        <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">Start your journey! Share your code with friends and watch your earnings grow.</p>
    </div>
)
