export type AttendanceStatus =
    | 'FULL_DAY'
    | 'HALF_DAY'
    | 'LEAVE'
    | 'ABSENT'
    | 'PRESENT';

export interface Attendance {
    _id?: string;
    userId?: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    check_in?: string;
    check_out?: string;
    status: string;
    totalHours?: number;
    total_hours?: number;
}
