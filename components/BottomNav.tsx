import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarClock, CalendarRange, User, Shield, ClipboardList } from 'lucide-react';
import { useAuth } from '../App';

export default function BottomNav() {
  const { user } = useAuth();
  if (!user) return null;

  const isAdminOrHOD = user.role.some((r: string) => ['hod', 'principal'].includes(r));

  const staffLinks = [
    { to: '/', icon: <Home size={24} />, label: 'Home' },
    { to: '/attendance', icon: <CalendarClock size={24} />, label: 'Attendance' },
    { to: '/leave', icon: <CalendarRange size={24} />, label: 'Leave' },
    { to: '/profile', icon: <User size={24} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/', icon: <Home size={24} />, label: 'Home' },
    { to: '/admin', icon: <Shield size={24} />, label: 'Admin' },
    { to: '/requests', icon: <ClipboardList size={24} />, label: 'Requests' },
    { to: '/profile', icon: <User size={24} />, label: 'Profile' },
  ];

  const links = isAdminOrHOD ? adminLinks : staffLinks;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`
            }
          >
            {link.icon}
            <span className="text-[10px] font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
