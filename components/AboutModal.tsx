import React from "react";
import { X, Info } from "lucide-react";

export default function AboutModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-5 flex justify-between items-center border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 text-blue-600 font-bold">
                        <Info size={20} />
                        About
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md mb-2">
                        <span className="font-bold text-2xl">AS</span>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">AcademiaSync</h2>
                        <p className="text-sm font-semibold text-blue-600">Version 1.2.0</p>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                        Smart Attendance & Leave Management for college institutions.
                    </p>

                    <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl text-left space-y-2 border border-gray-100">
                        <p><strong>Stack:</strong> React, Vite, Capacitor</p>
                        <p><strong>Backend:</strong> Cloudflare Workers, Hono, D1</p>
                        <p><strong>Upcoming:</strong> Biometric machine integration is planned for a future v2.0 release.</p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
