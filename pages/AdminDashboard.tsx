import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { dbService } from '../services/mockDb';
import { IUser, IAttendanceRequest, ILeaveRequest, RequestStatus } from '../types';
import { Check, X, User, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [subordinates, setSubordinates] = useState<IUser[]>([]);
  const [requests, setRequests] = useState<{ attendance: IAttendanceRequest[], leave: ILeaveRequest[] }>({ attendance: [], leave: [] });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const subs = await dbService.getSubordinates(user._id);
    const reqs = await dbService.getPendingRequests(user._id);
    setSubordinates(subs);
    setRequests(reqs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleApprove = async (id: string, type: 'attendance' | 'leave', status: RequestStatus) => {
    if (!user) return;
    if (type === 'attendance') {
        await dbService.processAttendanceRequest(id, status, user._id);
    } else {
        await dbService.processLeaveRequest(id, status, user._id);
    }
    loadData();
  };

  const getRequesterName = (userId: string) => subordinates.find(s => s._id === userId)?.name || 'Unknown User';

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 font-medium text-sm">Total Subordinates</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{subordinates.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 font-medium text-sm">Pending Leaves</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{requests.leave.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 font-medium text-sm">Attendance Corrections</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{requests.attendance.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Requests Column */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>
            
            {requests.attendance.length === 0 && requests.leave.length === 0 && (
                <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                    No pending requests at the moment.
                </div>
            )}

            {/* Attendance Requests */}
            {requests.attendance.map(req => (
                <div key={req._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Clock size={18} /></div>
                            <div>
                                <h4 className="font-semibold text-gray-800">{getRequesterName(req.userId)}</h4>
                                <p className="text-xs text-gray-500">Attendance Correction • {req.requestedDate}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg text-sm grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-gray-400 text-xs block">Requested Time</span>
                            <span className="font-mono font-medium">{req.requestedCheckIn} - {req.requestedCheckOut}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs block">Reason</span>
                            <span className="italic text-gray-700">"{req.reason}"</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                        <button onClick={() => handleApprove(req._id, 'attendance', RequestStatus.APPROVED)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                            <Check size={16} /> Approve
                        </button>
                        <button onClick={() => handleApprove(req._id, 'attendance', RequestStatus.REJECTED)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                            <X size={16} /> Reject
                        </button>
                    </div>
                </div>
            ))}

            {/* Leave Requests */}
            {requests.leave.map(req => (
                <div key={req._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Calendar size={18} /></div>
                            <div>
                                <h4 className="font-semibold text-gray-800">{getRequesterName(req.userId)}</h4>
                                <p className="text-xs text-gray-500">Leave Application</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Duration</span>
                            <span className="font-medium text-gray-800">{req.fromDate} <span className="text-gray-400">to</span> {req.toDate}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs block">Reason</span>
                            <span className="italic text-gray-700">"{req.reason}"</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                        <button onClick={() => handleApprove(req._id, 'leave', RequestStatus.APPROVED)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                            <Check size={16} /> Approve
                        </button>
                        <button onClick={() => handleApprove(req._id, 'leave', RequestStatus.REJECTED)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                            <X size={16} /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Team Members List */}
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Department Staff</h2>
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                {subordinates.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No staff members assigned.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {subordinates.map(sub => (
                            <li key={sub._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{sub.name}</h4>
                                        <p className="text-xs text-gray-500">{sub.department} • {sub.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-400 group-hover:text-blue-500">
                                    <span className="text-xs font-medium mr-2">View History</span>
                                    <ChevronRight size={16} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
