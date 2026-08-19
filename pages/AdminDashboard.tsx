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
            <div className="text-center py-20 text-gray-500">
                Loading admin dashboard...
            </div>
        );
    }

    const allRequests = [
        ...attendanceEdits.map(r => ({ ...r, type: "edit" as const })),
        ...leaveRequests.map(r => ({ ...r, type: "leave" as const })),
        ...attendanceRequests.map(r => ({ ...r, type: "attendance" as const }))
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* ================= STATS ================= */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Stat title="Team Members" value={subordinates.length} />
                <Stat title="Leave Requests" value={leaveRequests.length} color="text-purple-600" />
                <Stat title="Attendance Requests" value={attendanceRequests.length} color="text-blue-600" />
                <Stat title="Edit Requests" value={attendanceEdits.length} color="text-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ================= REQUESTS ================= */}

                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Pending Approvals</h2>

                    {allRequests.length === 0 && (
                        <div className="bg-white p-6 rounded-xl text-center text-gray-500 shadow-sm">
                            No pending requests
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
                    <h2 className="text-xl font-bold mb-6">Team Members</h2>

                    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                        {subordinates.map(sub => (
                            <div
                                key={sub._id}
                                onClick={() => handleUserClick(sub)}
                                className="flex justify-between items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div className="font-medium">{sub.name}</div>
                                        <div className="text-xs text-gray-500">{sub.email}</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= ATTENDANCE VIEWER ================= */}

            {selectedUser && (
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">
                        Attendance — {selectedUser.name}
                    </h3>

                    {loadingAttendance ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : attendanceData.length === 0 ? (
                        <p className="text-gray-500">No attendance records</p>
                    ) : (
                        attendanceData.map(r => (
                            <div key={r._id} className="flex justify-between py-2 border-b text-sm">
                                <span>{r.date}</span>
                                <span className="capitalize font-medium">{r.status}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

/* ================= HELPERS ================= */

function Stat({ title, value, color = "text-gray-800" }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="text-sm text-gray-500">{title}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
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
        <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
                <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-xs text-gray-500">{subtitle}</div>
                </div>
            </div>

            <div className="text-sm italic text-gray-600">"{reason}"</div>

            <div className="flex gap-2">
                <button
                    disabled={loading}
                    onClick={onApprove}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Approve"}
                </button>

                <button
                    disabled={loading}
                    onClick={onReject}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Reject"}
                </button>
            </div>
        </div>
    );
}