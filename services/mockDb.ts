import { IUser, IAttendance, IAttendanceRequest, ILeaveRequest, INotification, Role, AttendanceStatus, RequestStatus, RequestType } from '../types';

// Seed Data
const MOCK_USERS: IUser[] = [
  {
    _id: 'u1',
    name: 'Dr. Sanjay H. Dabhole',
    email: 'principal@college.edu',
    passwordHash: 'password',
    role: [Role.ADMIN],
    department: 'Administration',
    employeeId: 'EMP001',
    reportsTo: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'u2',
    name: 'Prof. Dipak P. Jagtap',
    email: 'hod.ece@college.edu',
    passwordHash: 'password',
    role: [Role.USER, Role.ADMIN],
    department: 'Electronics & Computer Engineering',
    employeeId: 'EMP002',
    reportsTo: 'u1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'u3',
    name: 'Prof. Rohit Nalawade',
    email: 'rohit.nalawade@college.edu',
    passwordHash: 'password',
    role: [Role.USER],
    department: 'Electronics & Computer Engineering',
    employeeId: 'EMP003',
    reportsTo: 'u2',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'u4',
    name: 'Prof. Uday Salokhe',
    email: 'uday.salokhe@college.edu',
    passwordHash: 'password',
    role: [Role.USER],
    department: 'Electronics & Computer Engineering',
    employeeId: 'EMP004',
    reportsTo: 'u2',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'u5',
    name: 'Prof. Rashmi Pande',
    email: 'rashmi.pande@college.edu',
    passwordHash: 'password',
    role: [Role.USER],
    department: 'Electronics & Computer Engineering',
    employeeId: 'EMP005',
    reportsTo: 'u2',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STORAGE_KEYS = {
  USERS: 'db_users_v2',
  ATTENDANCE: 'db_attendance_v2',
  ATTENDANCE_REQUESTS: 'db_attendance_requests_v2',
  LEAVE_REQUESTS: 'db_leave_requests_v2',
  NOTIFICATIONS: 'db_notifications_v2'
};

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDatabaseService {
  constructor() {
    this.init();
  }

  private init() {
    // Check if v2 data exists, if not seed it.
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE_REQUESTS)) localStorage.setItem(STORAGE_KEYS.ATTENDANCE_REQUESTS, JSON.stringify([]));
    if (!localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS)) localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify([]));
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }

  private getCollection<T>(key: string): T[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  private setCollection<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Auth & User ---
  async login(email: string, password: string): Promise<IUser | null> {
    await delay(300);
    const users = this.getCollection<IUser>(STORAGE_KEYS.USERS);
    return users.find(u => u.email === email && u.passwordHash === password && u.isActive) || null;
  }

  async getUser(id: string): Promise<IUser | null> {
    const users = this.getCollection<IUser>(STORAGE_KEYS.USERS);
    return users.find(u => u._id === id) || null;
  }

  async getSubordinates(managerId: string): Promise<IUser[]> {
    await delay(200);
    const users = this.getCollection<IUser>(STORAGE_KEYS.USERS);
    return users.filter(u => u.reportsTo === managerId && u.isActive);
  }

  // --- Attendance ---
  async getAttendance(userId: string, monthStr: string): Promise<IAttendance[]> {
    // monthStr format 'YYYY-MM'
    await delay(200);
    const all = this.getCollection<IAttendance>(STORAGE_KEYS.ATTENDANCE);
    return all.filter(a => a.userId === userId && a.date.startsWith(monthStr));
  }

  async getAttendanceByDate(userId: string, date: string): Promise<IAttendance | undefined> {
    const all = this.getCollection<IAttendance>(STORAGE_KEYS.ATTENDANCE);
    return all.find(a => a.userId === userId && a.date === date);
  }

  async checkIn(userId: string): Promise<IAttendance> {
    await delay(300);
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    
    const all = this.getCollection<IAttendance>(STORAGE_KEYS.ATTENDANCE);
    const existing = all.find(a => a.userId === userId && a.date === date);

    if (existing) throw new Error("Already checked in");

    const newRecord: IAttendance = {
      _id: Math.random().toString(36).substr(2, 9),
      userId,
      date,
      checkIn: time,
      status: AttendanceStatus.PRESENT,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.push(newRecord);
    this.setCollection(STORAGE_KEYS.ATTENDANCE, all);
    return newRecord;
  }

  async checkOut(userId: string): Promise<IAttendance> {
    await delay(300);
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    
    const all = this.getCollection<IAttendance>(STORAGE_KEYS.ATTENDANCE);
    const idx = all.findIndex(a => a.userId === userId && a.date === date);

    if (idx === -1) throw new Error("No check-in found for today");

    const record = all[idx];
    record.checkOut = time;
    record.updatedAt = new Date().toISOString();
    
    // Calculate status roughly
    const start = parseInt(record.checkIn!.split(':')[0]) * 60 + parseInt(record.checkIn!.split(':')[1]);
    const end = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
    const hours = (end - start) / 60;
    record.totalHours = parseFloat(hours.toFixed(2));

    if (hours >= 8) record.status = AttendanceStatus.FULL_DAY;
    else if (hours >= 4) record.status = AttendanceStatus.HALF_DAY;
    else record.status = AttendanceStatus.ABSENT; // Or whatever rule

    all[idx] = record;
    this.setCollection(STORAGE_KEYS.ATTENDANCE, all);
    return record;
  }

  // --- Requests ---
  async createAttendanceRequest(req: Omit<IAttendanceRequest, '_id' | 'status' | 'createdAt'>): Promise<void> {
    await delay(300);
    const all = this.getCollection<IAttendanceRequest>(STORAGE_KEYS.ATTENDANCE_REQUESTS);
    const newReq: IAttendanceRequest = {
      ...req,
      _id: Math.random().toString(36).substr(2, 9),
      status: RequestStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    all.push(newReq);
    this.setCollection(STORAGE_KEYS.ATTENDANCE_REQUESTS, all);
  }

  async createLeaveRequest(req: Omit<ILeaveRequest, '_id' | 'status' | 'createdAt'>): Promise<void> {
    await delay(300);
    const all = this.getCollection<ILeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS);
    const newReq: ILeaveRequest = {
      ...req,
      _id: Math.random().toString(36).substr(2, 9),
      status: RequestStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    all.push(newReq);
    this.setCollection(STORAGE_KEYS.LEAVE_REQUESTS, all);
  }

  async getPendingRequests(managerId: string): Promise<{ attendance: IAttendanceRequest[], leave: ILeaveRequest[] }> {
    await delay(400);
    const subs = await this.getSubordinates(managerId);
    const subIds = subs.map(s => s._id);

    const attRequests = this.getCollection<IAttendanceRequest>(STORAGE_KEYS.ATTENDANCE_REQUESTS)
      .filter(r => subIds.includes(r.userId) && r.status === RequestStatus.PENDING);
    
    const leaveRequests = this.getCollection<ILeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS)
      .filter(r => subIds.includes(r.userId) && r.status === RequestStatus.PENDING);

    return { attendance: attRequests, leave: leaveRequests };
  }

  async processAttendanceRequest(requestId: string, status: RequestStatus, adminId: string): Promise<void> {
    await delay(300);
    const reqs = this.getCollection<IAttendanceRequest>(STORAGE_KEYS.ATTENDANCE_REQUESTS);
    const reqIdx = reqs.findIndex(r => r._id === requestId);
    if (reqIdx === -1) return;

    const req = reqs[reqIdx];
    req.status = status;
    req.reviewedBy = adminId;
    req.reviewedAt = new Date().toISOString();
    reqs[reqIdx] = req;
    this.setCollection(STORAGE_KEYS.ATTENDANCE_REQUESTS, reqs);

    if (status === RequestStatus.APPROVED) {
      // Update actual attendance
      const atts = this.getCollection<IAttendance>(STORAGE_KEYS.ATTENDANCE);
      // Try to find existing
      let attIdx = atts.findIndex(a => a.userId === req.userId && a.date === req.requestedDate);
      
      const newRecord: IAttendance = {
        _id: attIdx > -1 ? atts[attIdx]._id : Math.random().toString(36).substr(2, 9),
        userId: req.userId,
        date: req.requestedDate,
        checkIn: req.requestedCheckIn,
        checkOut: req.requestedCheckOut,
        status: AttendanceStatus.FULL_DAY, // Simplified logic for edit
        isEdited: true,
        createdAt: attIdx > -1 ? atts[attIdx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (attIdx > -1) atts[attIdx] = newRecord;
      else atts.push(newRecord);
      
      this.setCollection(STORAGE_KEYS.ATTENDANCE, atts);
    }
  }

  async processLeaveRequest(requestId: string, status: RequestStatus, adminId: string): Promise<void> {
    await delay(300);
    const reqs = this.getCollection<ILeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS);
    const reqIdx = reqs.findIndex(r => r._id === requestId);
    if (reqIdx === -1) return;

    const req = reqs[reqIdx];
    req.status = status;
    req.reviewedBy = adminId;
    req.reviewedAt = new Date().toISOString();
    reqs[reqIdx] = req;
    this.setCollection(STORAGE_KEYS.LEAVE_REQUESTS, reqs);

    if (status === RequestStatus.APPROVED) {
      // Create leave records in attendance
      const atts = this.getCollection<IAttendance>(STORAGE_KEYS.ATTENDANCE);
      const start = new Date(req.fromDate);
      const end = new Date(req.toDate);
      
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        // Remove existing if any
        const existingIdx = atts.findIndex(a => a.userId === req.userId && a.date === dateStr);
        if (existingIdx > -1) atts.splice(existingIdx, 1);
        
        atts.push({
          _id: Math.random().toString(36).substr(2, 9),
          userId: req.userId,
          date: dateStr,
          status: AttendanceStatus.LEAVE,
          isEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      this.setCollection(STORAGE_KEYS.ATTENDANCE, atts);
    }
  }

  // --- Notifications ---
  async getNotifications(userId: string): Promise<INotification[]> {
    const all = this.getCollection<INotification>(STORAGE_KEYS.NOTIFICATIONS);
    return all.filter(n => n.recipientId === userId && !n.isRead);
  }
}

export const dbService = new MockDatabaseService();