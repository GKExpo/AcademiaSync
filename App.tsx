import React, {
  useState,
  createContext,
  useContext,
  useEffect
} from "react";

import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import {
  Menu,
  Bell,
  Info,
  LogOut,
  X,
  LayoutDashboard,
  Shield
} from "lucide-react";

import { Toaster } from "react-hot-toast";
import { IUser } from "./types";

import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

/* ================= CONFIG ================= */

const API_BASE = import.meta.env.VITE_API_URL;

/* ================= AUTH CONTEXT ================= */

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (u: IUser, t: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => useContext(AuthContext);

/* ================= HEADER ================= */

const Header = ({
  title
}: { title: string }) => {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setNotifications(data);
      } catch { }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: 1 })));
    } catch {}
  };

  const handleNotificationClick = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: 1 } : n));
    } catch {}
  };

  return (
    <>
      <header className="bg-white border-b h-16 flex items-center justify-between px-4 sticky top-0 z-20 box-content pt-[env(safe-area-inset-top)]">
        <h1 className="font-semibold text-lg">
          {title}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell size={20} className="text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div
            className="bg-white w-80 h-full shadow-xl flex flex-col"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)"
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Notifications</h2>
              <div className="flex gap-4">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-sm text-blue-600 font-medium">
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No notifications
                </p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n._id}
                    onClick={() => { if (!n.isRead) handleNotificationClick(n._id); }}
                    className={`border p-3 rounded mb-3 text-sm cursor-pointer transition ${!n.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="font-medium text-gray-900">
                      {n.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {n.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= LAYOUT ================= */

import BottomNav from "./components/BottomNav";
import { useLocation } from "react-router-dom";
import Attendance from "./pages/Attendance";
import LeavePage from "./pages/LeavePage"; // Will create
import Profile from "./pages/Profile"; // Will create
import Requests from "./pages/Requests"; // Will create
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" />;

  let title = "AcademiaSync";
  switch(location.pathname) {
    case "/": title = "Home"; break;
    case "/attendance": title = "Attendance"; break;
    case "/leave": title = "Leave Management"; break;
    case "/profile": title = "Profile"; break;
    case "/admin": title = "Admin Panel"; break;
    case "/requests": title = "Requests"; break;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header title={title} />
      
      <main className="flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/requests" element={<Requests />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
};

import { Preferences } from '@capacitor/preferences';

/* ================= MAIN APP ================= */

export default function App() {

  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedUserResult = await Preferences.get({ key: "user" });
        const savedTokenResult = await Preferences.get({ key: "token" });
        
        const savedUser = savedUserResult.value;
        const savedToken = savedTokenResult.value;

        if (savedUser && savedToken) {
          try {
            const payload = JSON.parse(atob(savedToken.split('.')[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              await Preferences.remove({ key: "user" });
              await Preferences.remove({ key: "token" });
              setUser(null);
              setToken(null);
            } else {
              setUser(JSON.parse(savedUser));
              setToken(savedToken);
            }
          } catch(e) {
          }
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    loadSession();
  }, []);

  const login = async (u: IUser, t: string) => {
    setUser(u);
    setToken(t);
    await Preferences.set({ key: "user", value: JSON.stringify(u) });
    await Preferences.set({ key: "token", value: t });
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await Preferences.clear();
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-between bg-white py-12" style={{ paddingTop: 'calc(3rem + env(safe-area-inset-top))', paddingBottom: 'calc(3rem + env(safe-area-inset-bottom))' }}>
        <div className="flex-1 flex flex-col items-center justify-center">
           <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg mb-6">
               <span className="font-bold text-4xl">AS</span>
           </div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AcademiaSync</h1>
           <div className="mt-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
           </div>
        </div>
        <div className="flex flex-col items-center opacity-60">
           <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-1">by SKC</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#111827",
            color: "#fff"
          }
        }}
      />
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}