import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../App";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import { User, ChevronRight, Clock } from "lucide-react";

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
                        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            {attendanceData.map((r, idx) => (
                                <div key={r._id} className={`flex justify-between items-center p-3 text-sm ${idx !== attendanceData.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <span className="font-medium text-gray-700">{r.date}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 text-[10px]">{r.check_in || r.checkIn || '--:--'} to {r.check_out || r.checkOut || '--:--'}</span>
                                        <span className={`capitalize font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                                            r.status === 'present' ? 'bg-green-100 text-green-700' :
                                            r.status === 'absent' ? 'bg-red-100 text-red-700' :
                                            r.status === 'leave' ? 'bg-purple-100 text-purple-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {r.status.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
