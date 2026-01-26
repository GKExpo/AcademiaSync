import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { dbService } from '../services/mockDb';
import { IAttendance, AttendanceStatus, RequestType } from '../types';
import { Calendar, Clock, LogIn, LogOut, Edit3, Plus, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }: { status: AttendanceStatus }) => {
  const colors = {
    [AttendanceStatus.FULL_DAY]: 'bg-green-100 text-green-700 border-green-200',
    [AttendanceStatus.HALF_DAY]: 'bg-orange-100 text-orange-700 border-orange-200',
    [AttendanceStatus.LEAVE]: 'bg-red-100 text-red-700 border-red-200',
    [AttendanceStatus.ABSENT]: 'bg-gray-100 text-gray-500 border-gray-200',
    [AttendanceStatus.PRESENT]: 'bg-blue-100 text-blue-700 border-blue-200', // Currently checked in
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${colors[status] || colors[AttendanceStatus.ABSENT]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const [todayRecord, setTodayRecord] = useState<IAttendance | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [editReason, setEditReason] = useState('');
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  
  // Leave Modal State
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const monthStr = currentDate.toISOString().slice(0, 7); // YYYY-MM
    const data = await dbService.getAttendance(user._id, monthStr);
    const todayStr = new Date().toISOString().split('T')[0];
    const today = await dbService.getAttendanceByDate(user._id, todayStr);
    
    setAttendanceData(data);
    setTodayRecord(today);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user, currentDate]);

  const handleCheckIn = async () => {
    if (!user) return;
    try {
      await dbService.checkIn(user._id);
      loadData();
    } catch (e) { alert("Error checking in"); }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    try {
      await dbService.checkOut(user._id);
      loadData();
    } catch (e) { alert("Error checking out"); }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    // Assuming editing "today" for simplicity or selected date
    const dateStr = new Date().toISOString().split('T')[0]; 
    await dbService.createAttendanceRequest({
        userId: user._id,
        requestedDate: dateStr,
        requestedCheckIn: editCheckIn,
        requestedCheckOut: editCheckOut,
        reason: editReason
    });
    setShowEditModal(false);
    alert('Request sent for approval');
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await dbService.createLeaveRequest({
        userId: user._id,
        fromDate: leaveFrom,
        toDate: leaveTo,
        leaveType: leaveFrom === leaveTo ? 'single' : 'multiple',
        reason: leaveReason
    });
    setShowLeaveModal(false);
    alert('Leave request sent');
  };

  // Calendar Grid Generation
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
             <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Activity</h3>
             <div className="text-2xl font-bold text-gray-800">
               {todayRecord ? (todayRecord.checkOut ? 'Day Complete' : 'Checked In') : 'Not Checked In'}
             </div>
             {todayRecord && (
                 <div className="mt-2 text-sm text-gray-600">
                     <span className="font-mono">{todayRecord.checkIn || '--:--'}</span> 
                     <span className="mx-2">→</span> 
                     <span className="font-mono">{todayRecord.checkOut || '--:--'}</span>
                 </div>
             )}
          </div>
          <div className="mt-4 flex gap-3">
             {!todayRecord && (
                 <button onClick={handleCheckIn} className="flex-1 bg-primary text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition">
                     <LogIn size={18} /> Check In
                 </button>
             )}
             {todayRecord && !todayRecord.checkOut && (
                 <button onClick={handleCheckOut} className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition">
                     <LogOut size={18} /> Check Out
                 </button>
             )}
             {todayRecord && (
                 <button onClick={() => setShowEditModal(true)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                     <Edit3 size={18} />
                 </button>
             )}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-gray-500 text-sm font-medium mb-4">Monthly Overview</h3>
             <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Full Days</span>
                     <span className="font-bold">{attendanceData.filter(a => a.status === AttendanceStatus.FULL_DAY).length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Half Days</span>
                     <span className="font-bold">{attendanceData.filter(a => a.status === AttendanceStatus.HALF_DAY).length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Leaves</span>
                     <span className="font-bold">{attendanceData.filter(a => a.status === AttendanceStatus.LEAVE).length}</span>
                 </div>
             </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-center items-center text-center">
            <h3 className="font-semibold text-lg mb-2">Need Time Off?</h3>
            <p className="text-blue-100 text-sm mb-4">Submit your leave request for approval.</p>
            <button onClick={() => setShowLeaveModal(true)} className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition shadow-sm flex items-center gap-2">
                <Plus size={18} /> Apply Leave
            </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-lg font-bold flex items-center gap-2">
                 <Calendar className="text-gray-400" size={20} /> 
                 {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </h2>
             <div className="flex gap-2">
                 <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1 hover:bg-gray-100 rounded">←</button>
                 <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1 hover:bg-gray-100 rounded">→</button>
             </div>
        </div>
        
        <div className="p-6">
            <div className="grid grid-cols-7 gap-4 text-center mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-xs font-semibold text-gray-400 uppercase">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2 lg:gap-4">
                {days.map((d, i) => {
                    if (d === null) return <div key={`empty-${i}`} className="aspect-square"></div>;
                    
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const record = attendanceData.find(a => a.date === dateStr);
                    
                    let bgClass = "bg-gray-50 border-gray-100 hover:border-blue-300";
                    if (record) {
                        if (record.status === AttendanceStatus.FULL_DAY) bgClass = "bg-green-50 border-green-200 text-green-700";
                        if (record.status === AttendanceStatus.HALF_DAY) bgClass = "bg-orange-50 border-orange-200 text-orange-700";
                        if (record.status === AttendanceStatus.LEAVE) bgClass = "bg-red-50 border-red-200 text-red-700";
                        if (record.status === AttendanceStatus.PRESENT) bgClass = "bg-blue-50 border-blue-200 text-blue-700";
                    }

                    return (
                        <div key={d} className={`aspect-square rounded-xl border p-1 md:p-2 flex flex-col items-center justify-between cursor-pointer transition-all ${bgClass}`}>
                            <span className="text-xs md:text-sm font-medium">{d}</span>
                            {record && (
                                <div className="text-[10px] md:text-xs font-bold mt-1">
                                    {record.totalHours ? `${record.totalHours}h` : record.status.toUpperCase().slice(0,3)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-bold mb-4">Request Attendance Correction</h3>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs text-gray-500 mb-1">Check In</label>
                              <input type="time" required value={editCheckIn} onChange={e => setEditCheckIn(e.target.value)} className="w-full border rounded p-2" />
                          </div>
                          <div>
                              <label className="block text-xs text-gray-500 mb-1">Check Out</label>
                              <input type="time" required value={editCheckOut} onChange={e => setEditCheckOut(e.target.value)} className="w-full border rounded p-2" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs text-gray-500 mb-1">Reason</label>
                          <textarea required value={editReason} onChange={e => setEditReason(e.target.value)} className="w-full border rounded p-2 text-sm" rows={3}></textarea>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Request</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {showLeaveModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-bold mb-4">Apply for Leave</h3>
                  <form onSubmit={handleLeaveSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs text-gray-500 mb-1">From</label>
                              <input type="date" required value={leaveFrom} onChange={e => setLeaveFrom(e.target.value)} className="w-full border rounded p-2 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs text-gray-500 mb-1">To</label>
                              <input type="date" required value={leaveTo} onChange={e => setLeaveTo(e.target.value)} className="w-full border rounded p-2 text-sm" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs text-gray-500 mb-1">Reason</label>
                          <textarea required value={leaveReason} onChange={e => setLeaveReason(e.target.value)} className="w-full border rounded p-2 text-sm" rows={3}></textarea>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button type="button" onClick={() => setShowLeaveModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Application</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
