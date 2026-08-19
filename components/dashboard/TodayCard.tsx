import { LogIn, LogOut, Edit3 } from 'lucide-react';
import { Attendance } from '../../types/attendance';

export default function TodayCard({
    today,
    onCheckIn,
    onCheckOut,
    onEdit,
}: {
    today: Attendance | null;
    onCheckIn: () => void;
    onCheckOut: () => void;
    onEdit: () => void;
}) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm text-gray-500">Today</h3>
            <p className="text-2xl font-bold mt-2">
                {today ? (today.checkOut ? 'Completed' : 'Checked In') : 'Not Checked In'}
            </p>

            <div className="mt-4 flex gap-2">
                {!today && (
                    <button
                        onClick={onCheckIn}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                        <LogIn size={18} /> Check In
                    </button>
                )}

                {today && !today.checkOut && (
                    <button
                        onClick={onCheckOut}
                        className="flex-1 bg-gray-900 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} /> Check Out
                    </button>
                )}

                {today && (
                    <button onClick={onEdit} className="p-2 border rounded-lg">
                        <Edit3 size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
