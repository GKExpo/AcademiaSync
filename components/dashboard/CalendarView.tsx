import React, { useState } from "react";
import { Attendance } from "../../types/attendance";
import Modal from "./Modal";
import axios from "axios";
import { useAuth } from "../../App";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";

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
            case "full_day":
                return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
            case "half_day":
                return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
            case "leave":
                return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
            case "absent":
                return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
            default:
                return "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100";
        }
    };

    /* ================= EDIT REQUEST ================= */

    const submitEditRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected || !token) return;

        try {
            setSubmitting(true);

            await apiRequest('/api/requests/attendance', {
                method: 'POST',
                body: JSON.stringify({
                    attendanceId: selected._id,
                    requestedCheckIn: editIn,
                    requestedCheckOut: editOut,
                    reason,
                })
            });

            toast.success("Edit request sent successfully");
            setSelected(null);
            setEditMode(false);
            onReload();
        } catch (err: any) {
            toast.error(err?.message || "Failed to send request");
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= BUILD CALENDAR ================= */

    const cells = [];

    for (let i = 0; i < firstDayIndex; i++) {
        cells.push(<div key={`empty-${i}`} className="p-1 md:p-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
        ).padStart(2, "0")}`;

        const record = attendance.find((a) => a.date === dateStr);
        const clickable = record && isPast(dateStr);
        const isToday = dateStr === todayStr;

        cells.push(
            <div
                key={day}
                onClick={() => clickable && setSelected(record!)}
                className={`
                    relative rounded-xl md:rounded-2xl p-1.5 md:p-3 min-h-[60px] md:min-h-[96px] flex flex-col justify-between border transition-colors text-xs md:text-sm
                    ${record ? getStatusColor(record.status) : "bg-white border-gray-100"}
                    ${clickable ? "cursor-pointer shadow-sm" : ""}
                    ${isToday ? "ring-2 ring-blue-600 ring-offset-1 font-bold" : ""}
                `}
            >
                <div className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</div>

                {record && (
                    <div className="text-[9px] md:text-xs capitalize font-medium mt-1 truncate">
                        {record.status.replace("_", " ")}
                    </div>
                )}
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <>
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border p-4 md:p-6 transition hover:shadow-md">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>

                    <div className="flex gap-2 bg-gray-50 border p-1 rounded-xl">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition text-gray-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => changeMonth(1)}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition text-gray-600"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* WEEKDAY HEADERS */}
                <div className="grid grid-cols-7 text-xs md:text-sm text-gray-500 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="text-center font-semibold uppercase tracking-wider py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* DAYS GRID */}
                <div className="grid grid-cols-7 gap-1 md:gap-3">
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
                        <div className="space-y-4 text-sm text-gray-700">

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border">
                                <div>
                                    <span className="block text-xs text-gray-400 mb-1">Date</span>
                                    <strong className="text-gray-900">{selected.date}</strong>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400 mb-1">Status</span>
                                    <span className="capitalize font-medium px-2 py-1 bg-gray-200 rounded-md text-xs">{selected.status.replace("_", " ")}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400 mb-1">Check In</span>
                                    <strong className="text-gray-900">{selected.check_in || selected.checkIn || "--:--"}</strong>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400 mb-1">Check Out</span>
                                    <strong className="text-gray-900">{selected.check_out || selected.checkOut || "--:--"}</strong>
                                </div>
                            </div>

                            {isPast(selected.date) && (
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-sm transition mt-4"
                                    onClick={() => {
                                        setEditIn(selected.check_in || selected.checkIn || "");
                                        setEditOut(selected.check_out || selected.checkOut || "");
                                        setEditMode(true);
                                    }}
                                >
                                    Request Edit
                                </button>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={submitEditRequest} className="space-y-4">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Check In Time</label>
                                    <input
                                        type="time"
                                        value={editIn}
                                        onChange={(e) => setEditIn(e.target.value)}
                                        className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Check Out Time</label>
                                    <input
                                        type="time"
                                        value={editOut}
                                        onChange={(e) => setEditOut(e.target.value)}
                                        className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Reason for Edit</label>
                                <textarea
                                    required
                                    placeholder="Briefly explain why you need to edit this record..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-sm transition disabled:opacity-50"
                            >
                                {submitting ? "Sending Request..." : "Send Request"}
                            </button>
                        </form>
                    )}
                </Modal>
            )}
        </>
    );
}