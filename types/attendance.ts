export type AttendanceStatus =
    | 'FULL_DAY'
    | 'HALF_DAY'
    | 'LEAVE'
    | 'ABSENT'
    | 'PRESENT';

export interface Attendance {
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: AttendanceStatus;
    totalHours?: number;
}
