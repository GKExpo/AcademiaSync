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
    const { token } = useAuth();

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

        try {
            setLoading(true);

            const month = currentDate.toISOString().slice(0, 7);

            const res = await apiRequest(`/api/attendance/me?month=${month}`, {
                method: "GET"
            });

            setAttendance(res);

            const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            const todayRec = res.find(
                (a: Attendance) => a.date === todayStr
            );

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

    /* ================= CHECK IN ================= */

    const checkIn = async () => {
        if (!token || actionLoading) return;

        try {
            setActionLoading(true);

            await apiRequest('/api/attendance/check-in', {
                method: "POST",
                body: JSON.stringify({})
            });

            toast.success("Checked in successfully ✅");
            await loadAttendance();

        } catch (err: any) {
            toast.error(
                err?.message || "Check-in failed"
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* ================= CHECK OUT ================= */

    const checkOut = async () => {
        if (!token || actionLoading) return;

        try {
            setActionLoading(true);

            await apiRequest('/api/attendance/check-out', {
                method: "POST",
                body: JSON.stringify({})
            });

            toast.success("Checked out successfully ✅");
            await loadAttendance();

        } catch (err: any) {
            toast.error(
                err?.message || "Check-out failed"
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* ================= APPLY LEAVE ================= */

    const applyLeave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!leaveFrom || !leaveTo || !leaveReason) {
            toast.error("Please fill all fields");
            return;
        }

        if (!token) return;

        try {
            setSubmitting(true);

            await apiRequest('/api/requests/leave', {
                method: "POST",
                body: JSON.stringify({
                    fromDate: leaveFrom,
                    toDate: leaveTo,
                    reason: leaveReason
                })
            });

            toast.success("Leave request submitted 📝");

            setLeaveFrom("");
            setLeaveTo("");
            setLeaveReason("");
            setShowLeave(false);

            await loadAttendance();

        } catch (err: any) {
            toast.error(
                err?.message || "Leave request failed"
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="w-full space-y-8 pb-16">

            {/* Loading Skeleton */}
            {loading && (
                <div className="animate-pulse bg-white rounded-2xl p-6 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
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