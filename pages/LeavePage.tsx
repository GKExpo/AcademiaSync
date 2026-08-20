import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../App";
import { apiRequest } from "../services/api";
import Modal from "../components/dashboard/Modal";
import { Plus } from "lucide-react";

export default function LeavePage() {
    const { token } = useAuth();
    
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [showApply, setShowApply] = useState(false);
    const [leaveFrom, setLeaveFrom] = useState("");
    const [leaveTo, setLeaveTo] = useState("");
    const [leaveReason, setLeaveReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadLeaves = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await apiRequest("/api/requests/leave");
            setLeaves(data || []);
        } catch {
            toast.error("Failed to load leave history");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadLeaves();
    }, [loadLeaves]);

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
            setShowApply(false);
            setLeaveFrom("");
            setLeaveTo("");
            setLeaveReason("");
            loadLeaves();
        } catch (err: any) {
            toast.error(err?.message || "Leave request failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-16">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Leave History</h2>
                <button
                    onClick={() => setShowApply(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition flex items-center gap-1"
                >
                    <Plus size={16} /> Apply
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100" />
                    ))}
                </div>
            ) : leaves.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-500 shadow-sm border border-gray-100">
                    <p>No leave applications found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {leaves.map((l: any) => {
                        const statusColor = l.status === "approved" ? "text-green-600 bg-green-50" :
                                            l.status === "rejected" ? "text-red-600 bg-red-50" :
                                            "text-orange-600 bg-orange-50";
                        const statusDot = l.status === "approved" ? "bg-green-500" :
                                          l.status === "rejected" ? "bg-red-500" :
                                          "bg-orange-500";
                        
                        const start = new Date(l.fromDate);
                        const end = new Date(l.toDate);
                        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

                        return (
                            <div key={l._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{l.fromDate} – {l.toDate}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">Personal Leave</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900 text-sm">{days} Days</div>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusColor}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></div>
                                        {l.status}
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                        Applied: {new Date(l.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showApply && (
                <Modal
                    title="Apply Leave"
                    onClose={() => setShowApply(false)}
                >
                    <form onSubmit={applyLeave} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">From Date</label>
                            <input
                                type="date"
                                value={leaveFrom}
                                onChange={(e) => setLeaveFrom(e.target.value)}
                                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">To Date</label>
                            <input
                                type="date"
                                value={leaveTo}
                                onChange={(e) => setLeaveTo(e.target.value)}
                                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Reason</label>
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
                            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium shadow hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Leave Request"}
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}
