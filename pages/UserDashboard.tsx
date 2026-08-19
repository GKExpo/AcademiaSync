import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../App";
import TodayCard from "../components/dashboard/TodayCard";
import LeaveCard from "../components/dashboard/LeaveCard";
import CalendarView from "../components/dashboard/CalendarView";
import Modal from "../components/dashboard/Modal";
import { Attendance } from "../types/attendance";
import { apiRequest } from "../services/api";

export default function UserDashboard() {
    const { token, user } = useAuth();

    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [today, setToday] = useState<Attendance | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [showLeave, setShowLeave] = useState(false);
    const [leaveFrom, setLeaveFrom] = useState("");
    const [leaveTo, setLeaveTo] = useState("");
    const [leaveReason, setLeaveReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /* ================= LOAD ATTENDANCE ================= */

    const loadAttendance = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        try {
            // Must be YYYY-MM
            const mStr = String(currentDate.getMonth() + 1).padStart(2, '0');
            const yStr = currentDate.getFullYear();
            const monthQuery = `${yStr}-${mStr}`;
            
            const resData = await apiRequest(`/api/attendance/me?month=${monthQuery}`);
            
            // Handle array safely
            const data = Array.isArray(resData) ? resData : resData?.data || [];
            
            setAttendance(data);

            const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
            const todayRec = data.find((a: any) => a.date === todayStr);
            setToday(todayRec || null);
        } catch (err: any) {
            toast.error("Failed to load attendance");
        } finally {
            setLoading(false);
        }
    }, [token, currentDate]);

    useEffect(() => {
        loadAttendance();
    }, [loadAttendance]);

    /* ================= ACTIONS ================= */

    const checkIn = async () => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            await apiRequest('/api/attendance/check-in', { method: 'POST' });
            toast.success("Checked in successfully");
            loadAttendance();
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
            loadAttendance();
        } catch (err: any) {
            toast.error(err?.message || "Check-out failed");
        } finally {
            setActionLoading(false);
        }
    };

    const applyLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiRequest('/api/requests/leave', {
                method: 'POST',
                body: JSON.stringify({
                    fromDate: leaveFrom,
                    toDate: leaveTo,
                    reason: leaveReason
                })
            });
            toast.success("Leave requested successfully");
            setShowLeave(false);
            setLeaveFrom("");
            setLeaveTo("");
            setLeaveReason("");
        } catch (err: any) {
            toast.error(err?.message || "Leave request failed");
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="w-full space-y-8 pb-16">

            {/* Greeting & Summary */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Welcome back, {user?.name.split(' ')[0]}! 👋
                </h2>
                <p className="text-gray-500 mt-2">
                    Here is your attendance overview for today.
                </p>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="animate-pulse bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-6" />
                    <div className="h-20 bg-gray-100 rounded-xl w-full" />
                </div>
            )}

            {/* Top Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <TodayCard
                    today={today}
                    onCheckIn={checkIn}
                    onCheckOut={checkOut}
                    onEdit={() => { }}
                    disabled={actionLoading}
                />

                <LeaveCard
                    onApply={() => setShowLeave(true)}
                />

            </section>

            {/* Calendar Section */}
            <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6 transition-all hover:shadow-md">
                <CalendarView
                    attendance={attendance}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    onReload={loadAttendance}
                />
            </section>

            {/* ================= LEAVE MODAL ================= */}

            {showLeave && (
                <Modal
                    title="Apply Leave"
                    onClose={() => setShowLeave(false)}
                >
                    <form onSubmit={applyLeave} className="space-y-4">

                        <div>
                            <label className="text-sm text-gray-600 block mb-1">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={leaveFrom}
                                onChange={(e) => setLeaveFrom(e.target.value)}
                                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 block mb-1">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={leaveTo}
                                onChange={(e) => setLeaveTo(e.target.value)}
                                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 block mb-1">
                                Reason
                            </label>
                            <textarea
                                value={leaveReason}
                                onChange={(e) => setLeaveReason(e.target.value)}
                                rows={3}
                                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl shadow hover:opacity-90 transition disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit Leave Request"}
                        </button>

                    </form>
                </Modal>
            )}
        </div>
    );
}