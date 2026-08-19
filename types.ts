export enum Role {
  STAFF = 'staff',
  HOD = 'hod',
  PRINCIPAL = 'principal'
}

export enum AttendanceStatus {
  FULL_DAY = 'full_day',
  HALF_DAY = 'half_day',
  LEAVE = 'leave',
  ABSENT = 'absent',
  PRESENT = 'present' // Intermediate state before calculation
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum RequestType {
  ATTENDANCE_EDIT = 'attendance_edit',
  LEAVE_REQUEST = 'leave_request'
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app this is hashed, here we store plain for mock
  role: Role[];
  department: string;
  employeeId: string;
  reportsTo: string | null; // ObjectId of manager
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendance {
  _id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  totalHours?: number;
  status: AttendanceStatus;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceRequest {
  _id: string;
  attendanceId?: string; // Optional if new record
  userId: string;
  requestedDate: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: RequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ILeaveRequest {
  _id: string;
  userId: string;
  fromDate: string;
  toDate: string;
  leaveType: 'single' | 'multiple';
  reason: string;
  status: RequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface INotification {
  _id: string;
  recipientId: string;
  type: RequestType;
  referenceId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
