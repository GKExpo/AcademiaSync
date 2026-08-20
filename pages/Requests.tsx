import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../App";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import { Calendar, Clock, Edit3 } from "lucide-react";

interface IRequest {
    _id: string;
    userId: string;
    requestedDate?: string;
    fromDate?: string;
    toDate?: string;
    reason: string;
    user?: any;
    type: "attendance" | "leave" | "edit";
}

export default function Requests() {
    const { user } = useAuth();

    const [attendanceRequests, setAttendanceRequests] = useState<any[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [attendanceEdits, setAttendanceEdits] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const safeCall = async (endpoint: string) => {
        try {
            return await apiRequest(endpoint);
        } catch {
            return [];
        }
    };

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const [attendance, leaves, edits] = await Promise.all([
                safeCall("/api/admin/attendance-requests"),
                safeCall("/api/admin/leave-requests"),
                safeCall("/api/admin/attendance-edit-requests")
            ]);
            setAttendanceRequests(attendance || []);
            setLeaveRequests(leaves || []);
            setAttendanceEdits(edits || []);
        } catch {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) loadDashboard();
    }, [user, loadDashboard]);

    const handleDecision = async (
        id: string,
        type: "attendance" | "leave" | "edit",
        status: "approved" | "rejected"
    ) => {
        if (processingId) return;

        try {
            setProcessingId(id);
            let endpoint = "";
            if (type === "attendance") endpoint = `/api/admin/attendance-requests/${id}`;
            else if (type === "leave") endpoint = `/api/requests/leave/${id}`;
            else endpoint = `/api/admin/attendance-edit/${id}`;

            await apiRequest(endpoint, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });

            setAttendanceRequests(prev => prev.filter(r => r._id !== id));
            setLeaveRequests(prev => prev.filter(r => r._id !== id));
            setAttendanceEdits(prev => prev.filter(r => r._id !== id));
            toast.success(`Request ${status}`);
        } catch (err: any) {
            toast.error("Action failed");
            await loadDashboard();
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />
                ))}
            </div>
        );
    }

    const allRequests = [
        ...attendanceEdits.map(r => ({ ...r, type: "edit" as const })),
        ...leaveRequests.map(r => ({ ...r, type: "leave" as const })),
        ...attendanceRequests.map(r => ({ ...r, type: "attendance" as const }))
    ];

    return (
        <div className="w-full space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Pending Requests</h2>

            {allRequests.length === 0 && (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-500 shadow-sm border border-gray-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-500 mb-3">
                        <Calendar size={24} />
                    </div>
                    <p className="font-medium text-gray-900">You're all caught up!</p>
                    <p className="text-sm mt-1">No pending requests at the moment.</p>
                </div>
            )}

            <div className="space-y-4">
                {allRequests.map(req => (
                    <div key={req._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 transition">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-full ${
                                req.type === 'leave' ? 'bg-purple-50 text-purple-600' :
                                req.type === 'edit' ? 'bg-orange-50 text-orange-600' :
                                'bg-blue-50 text-blue-600'
                            }`}>
                                {req.type === "edit" ? <Edit3 size={18} /> : req.type === "leave" ? <Calendar size={18} /> : <Clock size={18} />}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{req.user?.name || "Unknown"}</div>
                                <div className="text-xs text-gray-500 font-medium">
                                    {req.type === "leave" ? `Leave • ${req.fromDate} → ${req.toDate}` :
                                     req.type === "edit" ? `Edit • ${req.requestedDate}` :
                                     `Attendance • ${req.requestedDate}`}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 italic">
                            "{req.reason}"
                        </div>

                        <div className="flex gap-3">
                            <button
                                disabled={processingId === req._id}
                                onClick={() => handleDecision(req._id, req.type, "approved")}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm transition disabled:opacity-50"
                            >
                                {processingId === req._id ? "..." : "Approve"}
                            </button>
                            <button
                                disabled={processingId === req._id}
                                onClick={() => handleDecision(req._id, req.type, "rejected")}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                            >
                                {processingId === req._id ? "..." : "Reject"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
