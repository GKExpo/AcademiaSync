import React, { useState } from "react";
import { useAuth } from "../App";
import { User, ChevronRight, LogOut, Info, ClipboardList } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AboutModal from "../components/AboutModal";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showAbout, setShowAbout] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="w-full space-y-6 max-w-md mx-auto">
            
            {/* Header / Avatar */}
            <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-2">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <User size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
                
                <div className="mt-4 inline-block bg-gray-100 text-gray-800 font-medium px-4 py-1.5 rounded-full text-sm capitalize">
                    {user.role.join(", ").replace("_", " ")}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                
                <div className="px-5 py-4 border-b border-gray-50 flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">College Information</span>
                    <span className="font-medium text-gray-800 text-sm">Department: {user.department || (user.role.includes('principal') ? 'Administration' : 'TE')}</span>
                    <span className="font-medium text-gray-800 text-sm mt-1">Designation: {user.role.includes('hod') ? 'Head of Department' : 'Faculty'}</span>
                    <span className="font-medium text-gray-800 text-sm mt-1">Biometric ID: Not Assigned</span>
                </div>

                <Link to="/leave" className="flex items-center justify-between p-5 hover:bg-gray-50 transition border-b border-gray-50 active:bg-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <ClipboardList size={18} />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">Leave Applications</div>
                            <div className="text-xs text-gray-500">History and status</div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </Link>

                <button onClick={() => setShowAbout(true)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition border-b border-gray-50 active:bg-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Info size={18} />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-gray-900">About AcademiaSync</div>
                            <div className="text-xs text-gray-500">Version 1.2.0</div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Legal</span>
                </div>
                <Link to="/privacy" className="flex items-center justify-between p-4 hover:bg-gray-50 transition border-b border-gray-50">
                    <div className="font-medium text-sm text-gray-700">Privacy Policy</div>
                    <ChevronRight size={16} className="text-gray-300" />
                </Link>
                <Link to="/terms" className="flex items-center justify-between p-4 hover:bg-gray-50 transition border-b border-gray-50">
                    <div className="font-medium text-sm text-gray-700">Terms & Conditions</div>
                    <ChevronRight size={16} className="text-gray-300" />
                </Link>
                <div className="p-4 text-xs text-gray-400 text-center">
                    © 2026 SKC. All rights reserved.
                </div>
            </div>

            <button onClick={handleLogout} className="w-full bg-white rounded-3xl border border-gray-100 flex items-center justify-center p-4 hover:bg-red-50 transition active:bg-red-100 group shadow-sm">
                <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-red-500" />
                    <div className="font-bold text-red-500">Logout</div>
                </div>
            </button>

            <div className="text-center py-6 opacity-70">
                <h4 className="font-bold text-gray-800 text-lg">AcademiaSync</h4>
                <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mt-1">by SKC</p>
                <p className="text-gray-400 text-xs mt-1">Version 1.2.0</p>
            </div>

            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        </div>
    );
}
