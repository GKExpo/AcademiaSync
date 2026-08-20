import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../App";
import CalendarView from "../components/dashboard/CalendarView";
import { Attendance as IAttendance } from "../types/attendance";
import { apiRequest } from "../services/api";

export default function Attendance() {
    const { token } = useAuth();

    const [attendance, setAttendance] = useState<IAttendance[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const loadAttendance = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        try {
            const mStr = String(currentDate.getMonth() + 1).padStart(2, '0');
            const yStr = currentDate.getFullYear();
            const monthQuery = `${yStr}-${mStr}`;
            
            const resData = await apiRequest(`/api/attendance/me?month=${monthQuery}`);
            const data = Array.isArray(resData) ? resData : resData?.data || [];
            
            setAttendance(data);
        } catch (err: any) {
            toast.error("Failed to load attendance");
        } finally {
            setLoading(false);
        }
    }, [token, currentDate]);

    useEffect(() => {
        loadAttendance();
    }, [loadAttendance]);

    return (
        <div className="w-full space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Attendance History</h2>
            
            {/* Legend */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 text-xs justify-center">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Present</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Full Day</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Half Day</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Absent</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Leave</div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <CalendarView
                    attendance={attendance}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    onReload={loadAttendance}
                />
            </div>
            
            {loading && <div className="text-center text-sm text-gray-500">Loading...</div>}
        </div>
    );
}
