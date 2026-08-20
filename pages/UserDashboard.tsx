import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../App";
import TodayCard from "../components/dashboard/TodayCard";
import { Attendance } from "../types/attendance";
import { apiRequest } from "../services/api";
import { Link } from "react-router-dom";
import { CalendarClock, CalendarRange } from "lucide-react";

export default function UserDashboard() {
    const { token, user } = useAuth();

    const [today, setToday] = useState<Attendance | null>(null);
    const [summary, setSummary] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    /* ================= LOAD TODAY ================= */

    const loadToday = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        try {
            const d = new Date();
            const mStr = String(d.getMonth() + 1).padStart(2, '0');
            const yStr = d.getFullYear();
            const monthQuery = `${yStr}-${mStr}`;
            
            const resData = await apiRequest(`/api/attendance/me?month=${monthQuery}`);
            const data = Array.isArray(resData) ? resData : resData?.data || [];
            
            const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
            const todayRec = data.find((a: any) => a.date === todayStr);
            setToday(todayRec || null);
            
            // Also fetch summary
            const sumData = await apiRequest(`/api/attendance/summary/${user?._id}?month=${monthQuery}`);
            if (sumData) setSummary(sumData);
            
        } catch (err: any) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        loadToday();
    }, [loadToday]);

    /* ================= ACTIONS ================= */

    const checkIn = async () => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            await apiRequest('/api/attendance/check-in', { method: 'POST' });
            toast.success("Checked in successfully");
            await loadToday();
        } catch (err: any) {
            toast.error(err?.message || "Check-in failed");
        } finally {
            setActionLoading(false);
        }
    };

    const checkOut = async () => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            await apiRequest('/api/attendance/check-out', { method: 'POST' });
            toast.success("Checked out successfully");
            await loadToday();
        } catch (err: any) {
            toast.error(err?.message || "Check-out failed");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Greeting */}
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back! 👋
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Here is your overview for today.
                </p>
            </div>

            {loading && !today ? (
                <div className="animate-pulse bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-6" />
                    <div className="h-20 bg-gray-100 rounded-xl w-full" />
                </div>
            ) : (
                <TodayCard
                    today={today}
                    onCheckIn={checkIn}
                    onCheckOut={checkOut}
                    onEdit={() => {}}
                    disabled={actionLoading}
                />
            )}

            {/* Quick Actions */}
            <div>
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/attendance" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition active:scale-95">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <CalendarClock size={20} />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">Attendance</span>
                    </Link>
                    <Link to="/leave" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition active:scale-95">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <CalendarRange size={20} />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">Apply Leave</span>
                    </Link>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">This Month</h3>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-xl font-bold text-gray-900">{summary.totalDays > 0 ? Math.round((summary.present + summary.fullDay + summary.halfDay*0.5) / summary.totalDays * 100) : 0}%</div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mt-1">Attendance</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-green-600">{summary.present + summary.fullDay + summary.halfDay}</div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mt-1">Present</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-red-600">{summary.absent}</div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mt-1">Absent</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-purple-600">{summary.leave}</div>
                                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mt-1">Leave</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}