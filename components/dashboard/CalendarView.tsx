import { useState } from "react";
import { Attendance } from "../../types/attendance";
import Modal from "./Modal";
import axios from "axios";
import { useAuth } from "../../App";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

export default function CalendarView({
    attendance,
    currentDate,
    setCurrentDate,
    onReload,
}: {
    attendance: Attendance[];
    currentDate: Date;
    setCurrentDate: (d: Date) => void;
    onReload: () => void;
}) {
    const { token } = useAuth();

    const [selected, setSelected] = useState<Attendance | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editIn, setEditIn] = useState("");
    const [editOut, setEditOut] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const todayStr = new Date().toISOString().split("T")[0];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const isPast = (dateStr: string) => dateStr < todayStr;

    /* ================= STATUS COLORS ================= */

    const getStatusColor = (status: string) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-700 border-green-200";
            case "full_day":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "half_day":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "leave":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "absent":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-500 border-gray-200";
        }
    };

    /* ================= EDIT REQUEST ================= */

    const submitEditRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;

        try {
            setSubmitting(true);

            await axios.post(
                `${API_BASE}/api/requests/attendance`,
                {
                    attendanceId: selected._id,
                    requestedCheckIn: editIn,
                    requestedCheckOut: editOut,
                    reason,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSelected(null);
            setEditMode(false);
            onReload();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to send request");
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= BUILD CALENDAR ================= */

    const cells = [];

    for (let i = 0; i < firstDayIndex; i++) {
        cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
        ).padStart(2, "0")}`;

        const record = attendance.find((a) => a.date === dateStr);
        const clickable = record && isPast(dateStr);

        cells.push(
            <div
                key={day}
                onClick={() => clickable && setSelected(record!)}
                className={`rounded-2xl p-2 h-24 flex flex-col justify-between border text-sm transition-all
          ${record ? getStatusColor(record.status) : "bg-white"}
          ${clickable ? "cursor-pointer hover:scale-[1.03]" : ""}
          ${dateStr === todayStr ? "ring-2 ring-blue-500" : ""}
        `}
            >
                <div className="font-semibold">{day}</div>

                {record && (
                    <div className="text-[11px] capitalize font-medium">
                        {record.status.replace("_", " ")}
                    </div>
                )}
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <>
            <div className="bg-white rounded-3xl shadow-sm border p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>

                    <div className="flex gap-3">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => changeMonth(1)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* WEEKDAY HEADERS */}
                <div className="grid grid-cols-7 text-xs text-gray-500 mb-3">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="text-center font-medium">
                            {d}
                        </div>
                    ))}
                </div>

                {/* DAYS GRID */}
                <div className="grid grid-cols-7 gap-3">
                    {cells}
                </div>

            </div>

            {/* ================= MODAL ================= */}

            {selected && (
                <Modal
                    title="Attendance Details"
                    onClose={() => {
                        setSelected(null);
                        setEditMode(false);
                    }}
                >
                    {!editMode ? (
                        <div className="space-y-3 text-sm">

                            <div><strong>Date:</strong> {selected.date}</div>
                            <div><strong>Check In:</strong> {selected.checkIn || "-"}</div>
                            <div><strong>Check Out:</strong> {selected.checkOut || "-"}</div>
                            <div><strong>Status:</strong> {selected.status}</div>

                            {isPast(selected.date) && (
                                <button
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl shadow"
                                    onClick={() => {
                                        setEditIn(selected.checkIn || "");
                                        setEditOut(selected.checkOut || "");
                                        setEditMode(true);
                                    }}
                                >
                                    Request Edit
                                </button>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={submitEditRequest} className="space-y-3">

                            <input
                                type="time"
                                value={editIn}
                                onChange={(e) => setEditIn(e.target.value)}
                                className="w-full border rounded-xl px-3 py-2"
                            />

                            <input
                                type="time"
                                value={editOut}
                                onChange={(e) => setEditOut(e.target.value)}
                                className="w-full border rounded-xl px-3 py-2"
                            />

                            <textarea
                                required
                                placeholder="Reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full border rounded-xl px-3 py-2"
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-green-600 text-white py-2 rounded-xl"
                            >
                                {submitting ? "Sending..." : "Send Request"}
                            </button>
                        </form>
                    )}
                </Modal>
            )}
        </>
    );
}