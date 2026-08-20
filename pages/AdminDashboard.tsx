import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../App";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import { User, ChevronRight, Clock } from "lucide-react";
import { formatTime } from "../utils/format";

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string[];
}

interface IAttendance {
    _id: string;
    date: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
    check_in?: string;
    check_out?: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [subordinates, setSubordinates] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAttendance, setLoadingAttendance] = useState(false);

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const subs = await apiRequest("/api/admin/subordinates");
            setSubordinates(subs || []);
        } catch {
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) loadDashboard();
    }, [user, loadDashboard]);

    const handleUserClick = async (u: IUser) => {
        try {
            setSelectedUser(u);
            setLoadingAttendance(true);
            const data = await apiRequest(`/api/admin/user-attendance/${u._id}`);
            setAttendanceData(data || []);
        } catch {
            toast.error("Failed to load attendance");
            setAttendanceData([]);
        } finally {
            setLoadingAttendance(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-16">
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">Faculty & Staff</h2>

                {subordinates.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center text-gray-500 shadow-sm border border-gray-100">
                        <p>No faculty or staff members found.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        {subordinates.map((sub, idx) => (
                            <div
                                key={sub._id}
                                onClick={() => handleUserClick(sub)}
                                className={`flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer transition ${idx !== subordinates.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{sub.name}</div>
                                        <div className="text-xs text-gray-500">{sub.email}</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedUser && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="font-bold text-md mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-blue-600" />
                        Attendance — {selectedUser.name.split(' ')[0]}
                    </h3>

                    {loadingAttendance ? (
                        <div className="animate-pulse space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-gray-50 rounded-xl w-full" />
                            ))}
                        </div>
                    ) : attendanceData.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl">
                            No attendance records found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {attendanceData.map((r) => {
                                // Safe formatting
                                const checkIn = r.check_in || r.checkIn;
                                const checkOut = r.check_out || r.checkOut;
                                
                                const formattedCheckIn = formatTime(checkIn);
                                const formattedCheckOut = formatTime(checkOut);
                                
                                let formattedDate = r.date;
                                try {
                                    const d = new Date(r.date);
                                    if (!isNaN(d.getTime())) {
                                        formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                                    }
                                } catch {}

                                const statusColor = 
                                    r.status === 'present' ? 'bg-green-100 text-green-700 border-green-200' :
                                    r.status === 'absent' ? 'bg-red-100 text-red-700 border-red-200' :
                                    r.status === 'leave' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                    'bg-orange-100 text-orange-700 border-orange-200';
                                
                                let durationStr = null;
                                if (checkIn && checkOut) {
                                    try {
                                        const d1 = new Date(checkIn);
                                        const d2 = new Date(checkOut);
                                        if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
                                            const diff = d2.getTime() - d1.getTime();
                                            const hours = Math.floor(diff / (1000 * 60 * 60));
                                            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                            durationStr = `${hours}h ${mins}m`;
                                        }
                                    } catch {}
                                }

                                const isMissingBoth = (!checkIn && !checkOut);
                                
                                return (
                                    <div key={r._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                                        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                                            <span className="font-semibold text-gray-800 text-sm">{formattedDate}</span>
                                            <span className={`capitalize font-semibold px-2.5 py-1 rounded-md text-[11px] border ${statusColor}`}>
                                                {r.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <div className="p-4 flex justify-between items-center bg-white">
                                            {isMissingBoth ? (
                                                <div className="text-gray-400 text-sm italic w-full text-center">
                                                    No attendance recorded
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Check In</span>
                                                        <span className="font-semibold text-gray-900 text-sm">{formattedCheckIn}</span>
                                                    </div>
                                                    
                                                    {durationStr && (
                                                        <div className="flex flex-col items-center justify-center px-4">
                                                            <div className="h-[1px] w-8 bg-gray-200 mb-1 rounded-full relative">
                                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-600 border border-gray-200 whitespace-nowrap">
                                                                    {durationStr}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex flex-col text-right">
                                                        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Check Out</span>
                                                        <span className="font-semibold text-gray-900 text-sm">{formattedCheckOut}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
