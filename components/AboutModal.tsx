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
                
                <div className="p-6 text-center space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md mb-2">
                        <span className="font-bold text-2xl">AS</span>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">AcademiaSync</h2>
                        <p className="text-sm font-semibold text-blue-600">Smart Attendance & Leave Management</p>
                    </div>

                    <div className="py-2 border-y border-gray-100 flex justify-center gap-4 text-xs font-medium text-gray-500">
                        <span>Developed by <strong className="text-gray-800">SKC</strong></span>
                        <span>•</span>
                        <span>Version <strong className="text-gray-800">1.2.0</strong></span>
                    </div>

                    <div className="text-left space-y-4 mt-4">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Capabilities</h4>
                            <ul className="text-sm text-gray-700 space-y-1 pl-4 list-disc marker:text-blue-400">
                                <li>Attendance management</li>
                                <li>Attendance history</li>
                                <li>Leave management</li>
                                <li>Role-based access</li>
                                <li>HOD/Principal administration</li>
                                <li>Notifications</li>
                                <li>Mobile Android application</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technology</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                React, Vite, Capacitor, Cloudflare Workers, Hono, Cloudflare D1
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Future</h4>
                            <p className="text-sm text-gray-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-blue-900">
                                Biometric attendance machine integration is planned for AcademiaSync v2.0.0.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl transition active:scale-[0.98]">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
