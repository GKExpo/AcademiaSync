import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../App";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
    User,
    Calendar,
    Clock,
    ChevronRight,
    Edit3
} from "lucide-react";

/* ================= TYPES ================= */

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string[];
}

interface IRequest {
    _id: string;
    userId: string;
    requestedDate?: string;
    fromDate?: string;
    toDate?: string;
    reason: string;
    user?: any;
}

interface IAttendance {
    _id: string;
    date: string;
    status: string;
}

/* ================= COMPONENT ================= */

export default function AdminDashboard() {

    const { user } = useAuth();

    const [subordinates, setSubordinates] = useState<IUser[]>([]);
    const [attendanceRequests, setAttendanceRequests] = useState<IRequest[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<IRequest[]>([]);
    const [attendanceEdits, setAttendanceEdits] = useState<IRequest[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingAttendance, setLoadingAttendance] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    /* ================= SAFE CALL ================= */

    const safeCall = async (endpoint: string) => {
        try {
            return await apiRequest(endpoint);
        } catch {
            return [];
        }
    };

    /* ================= LOAD DASHBOARD ================= */

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);

            const [subs, attendance, leaves, edits] = await Promise.all([
                safeCall("/api/admin/subordinates"),
                safeCall("/api/admin/attendance-requests"),
                safeCall("/api/admin/leave-requests"),
                safeCall("/api/admin/attendance-edit-requests")
            ]);

            setSubordinates(subs || []);
            setAttendanceRequests(attendance || []);
            setLeaveRequests(leaves || []);
            setAttendanceEdits(edits || []);

        } catch {
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) loadDashboard();
    }, [user, loadDashboard]);

    /* ================= APPROVAL ================= */

    const handleDecision = async (
        id: string,
        type: "attendance" | "leave" | "edit",
        status: "approved" | "rejected"
    ) => {

        if (processingId) return; // prevent double click

        try {
            setProcessingId(id);

            let endpoint = "";

            if (type === "attendance")
                endpoint = `/api/admin/attendance-requests/${id}`;
            else if (type === "leave")
                endpoint = `/api/requests/leave/${id}`;
            else
                endpoint = `/api/admin/attendance-edit/${id}`;

            await apiRequest(endpoint, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });

            /* 🔥 Optimistic UI removal */
            setAttendanceRequests(prev => prev.filter(r => r._id !== id));
            setLeaveRequests(prev => prev.filter(r => r._id !== id));
            setAttendanceEdits(prev => prev.filter(r => r._id !== id));

            toast.success(`Request ${status}`);

        } catch (err: any) {
            toast.error("Action failed");
            await loadDashboard(); // fallback refresh
        } finally {
            setProcessingId(null);
        }
    };

    /* ================= USER ATTENDANCE ================= */

    const handleUserClick = async (u: IUser) => {
        try {
            setSelectedUser(u);
            setLoadingAttendance(true);

            const data = await apiRequest(
                `/api/admin/user-attendance/${u._id}`
            );

            setAttendanceData(data || []);
        } catch {
            toast.error("Failed to load attendance");
            setAttendanceData([]);
        } finally {
            setLoadingAttendance(false);
        }
    };

    const getUserName = (id: string) =>
        subordinates.find(u => u._id === id)?.name || "Unknown";

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl h-28 border border-gray-100" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-96 bg-white rounded-2xl border border-gray-100" />
                    <div className="h-96 bg-white rounded-2xl border border-gray-100" />
                </div>
            </div>
        );
    }

    const allRequests = [
        ...attendanceEdits.map(r => ({ ...r, type: "edit" as const })),
        ...leaveRequests.map(r => ({ ...r, type: "leave" as const })),
        ...attendanceRequests.map(r => ({ ...r, type: "attendance" as const }))
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-16">

            {/* ================= STATS ================= */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Stat title="Faculty & Staff" value={subordinates.length} />
                <Stat title="Leave Requests" value={leaveRequests.length} color="text-purple-600" />
                <Stat title="Check-In Requests" value={attendanceRequests.length} color="text-blue-600" />
                <Stat title="Edit Requests" value={attendanceEdits.length} color="text-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ================= REQUESTS ================= */}

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>

                    {allRequests.length === 0 && (
                        <div className="bg-white p-8 rounded-2xl text-center text-gray-500 shadow-sm border border-gray-100">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-500 mb-3">
                                <Calendar size={24} />
                            </div>
                            <p className="font-medium text-gray-900">You're all caught up!</p>
                            <p className="text-sm mt-1">No pending requests at the moment.</p>
                        </div>
                    )}

                    {allRequests.map(req => (
                        <RequestCard
                            key={req._id}
                            icon={
                                req.type === "edit"
                                    ? <Edit3 size={16} />
                                    : req.type === "leave"
                                        ? <Calendar size={16} />
                                        : <Clock size={16} />
                            }
                            title={req.user?.name || getUserName(req.userId)}
                            subtitle={
                                req.type === "leave"
                                    ? `Leave • ${req.fromDate} → ${req.toDate}`
                                    : req.type === "edit"
                                        ? `Edit • ${req.requestedDate}`
                                        : `Attendance • ${req.requestedDate}`
                            }
                            reason={req.reason}
                            loading={processingId === req._id}
                            onApprove={() =>
                                handleDecision(req._id, req.type, "approved")
                            }
                            onReject={() =>
                                handleDecision(req._id, req.type, "rejected")
                            }
                        />
                    ))}
                </div>

                {/* ================= TEAM ================= */}

                <div>
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Faculty & Staff</h2>

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
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{sub.name}</div>
                                            <div className="text-sm text-gray-500">{sub.email}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================= ATTENDANCE VIEWER ================= */}

            {selectedUser && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-blue-600" />
                        Attendance History — {selectedUser.name}
                    </h3>

                    {loadingAttendance ? (
                        <div className="animate-pulse space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-gray-50 rounded-xl w-full" />
                            ))}
                        </div>
                    ) : attendanceData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                            No attendance records found for {selectedUser.name}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            {attendanceData.map((r, idx) => (
                                <div key={r._id} className={`flex justify-between items-center p-4 text-sm ${idx !== attendanceData.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <span className="font-medium text-gray-700">{r.date}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-xs">{r.checkIn || '--:--'} to {r.checkOut || '--:--'}</span>
                                        <span className={`capitalize font-semibold px-2 py-1 rounded-md text-xs ${
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

/* ================= HELPERS ================= */

function Stat({ title, value, color = "text-gray-800" }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm transition hover:shadow-md">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</div>
            <div className={`text-4xl font-bold mt-2 ${color}`}>{value}</div>
        </div>
    );
}

function RequestCard({
    icon,
    title,
    subtitle,
    reason,
    onApprove,
    onReject,
    loading
}: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 transition hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-50 border rounded-xl text-gray-600">{icon}</div>
                <div>
                    <div className="font-semibold text-lg">{title}</div>
                    <div className="text-sm text-gray-500 font-medium">{subtitle}</div>
                </div>
            </div>

            <div className="text-sm bg-gray-50 p-3 rounded-lg border text-gray-700 italic">
                "{reason}"
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    disabled={loading}
                    onClick={onApprove}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Approve"}
                </button>

                <button
                    disabled={loading}
                    onClick={onReject}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Reject"}
                </button>
            </div>
        </div>
    );
}
