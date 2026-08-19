import { AttendanceStatus } from '../../types/attendance';

export default function StatusBadge({ status }: { status: AttendanceStatus }) {
    const colors: Record<AttendanceStatus, string> = {
        FULL_DAY: 'bg-green-100 text-green-700',
        HALF_DAY: 'bg-orange-100 text-orange-700',
        LEAVE: 'bg-red-100 text-red-700',
        ABSENT: 'bg-gray-100 text-gray-500',
        PRESENT: 'bg-blue-100 text-blue-700',
    };

    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status]}`}>
            {status.replace('_', ' ')}
        </span>
    );
}
