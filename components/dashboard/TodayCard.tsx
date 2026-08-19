import { LogIn, LogOut, Edit3 } from 'lucide-react';
import { Attendance } from '../../types/attendance';

export default function TodayCard({
    today,
    onCheckIn,
    onCheckOut,
    onEdit,
    disabled = false
}: {
    today: Attendance | null;
    onCheckIn: () => void;
    onCheckOut: () => void;
    onEdit: () => void;
    disabled?: boolean;
}) {
    const statusText = today ? (today.checkOut ? 'Completed' : 'Checked In') : 'Not Checked In';
    const statusColor = today ? (today.checkOut ? 'text-green-600' : 'text-blue-600') : 'text-gray-600';

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Today's Attendance</h3>
            <div className="mt-2 flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${statusColor}`}>
                    {statusText}
                </p>
                {today?.totalHours != null && (
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {today.totalHours} hrs
                    </span>
                )}
            </div>
            
            {today && (
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="bg-gray-50 p-2 rounded-lg border">
                        <span className="block text-xs text-gray-400">Check In</span>
                        <span className="font-medium">{today.checkIn || '--:--'}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg border">
                        <span className="block text-xs text-gray-400">Check Out</span>
                        <span className="font-medium">{today.checkOut || '--:--'}</span>
                    </div>
                </div>
            )}

            <div className="mt-5 flex gap-3">
                {!today && (
                    <button
                        onClick={onCheckIn}
                        disabled={disabled}
                        className="flex-1 bg-blue-600 text-white min-h-[48px] rounded-xl flex items-center justify-center gap-2 font-medium shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogIn size={20} /> Check In
                    </button>
                )}

                {today && !today.checkOut && (
                    <button
                        onClick={onCheckOut}
                        disabled={disabled}
                        className="flex-1 bg-orange-600 text-white min-h-[48px] rounded-xl flex items-center justify-center gap-2 font-medium shadow-sm hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut size={20} /> Check Out
                    </button>
                )}

                {today && (
                    <button 
                        onClick={onEdit} 
                        disabled={disabled}
                        className="p-3 border rounded-xl hover:bg-gray-50 text-gray-600 transition disabled:opacity-50 flex items-center justify-center min-h-[48px] min-w-[48px]"
                    >
                        <Edit3 size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
