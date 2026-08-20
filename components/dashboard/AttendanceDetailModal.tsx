import { useState } from "react";
import axios from "axios";
import { Attendance } from "../../types/attendance";
import { useAuth } from "../../App";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AttendanceDetailModal({
    attendance,
    onClose,
    onUpdated,
}: {
    attendance: Attendance;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const { token } = useAuth();

    const [checkIn, setCheckIn] = useState(attendance.check_in || attendance.checkIn || "");
    const [checkOut, setCheckOut] = useState(attendance.check_out || attendance.checkOut || "");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submitEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            await axios.post(
                `${API_BASE}/api/requests/attendance-edit`,
                {
                    attendanceId: attendance._id,
                    requestedCheckIn: checkIn,
                    requestedCheckOut: checkOut,
                    reason,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Edit request sent to admin");
            onUpdated();
            onClose();
        } catch (err) {
            alert("Failed to send edit request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">
                    Attendance Details
                </h2>

                <div className="space-y-2 text-sm mb-4">
                    <div>Date: {attendance.date}</div>
                    <div>Status: {attendance.status}</div>
                    <div>Total Hours: {attendance.total_hours || attendance.totalHours || 0}</div>
                </div>

                <form onSubmit={submitEdit} className="space-y-3">
                    <input
                        type="time"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    <input
                        type="time"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    <textarea
                        placeholder="Reason for edit"
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        {submitting ? "Submitting..." : "Send Edit Request"}
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-3 text-sm text-gray-500"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
