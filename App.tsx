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

/* ================= STATUS LEGEND ================= */

const StatusLegend = () => (
  <div className="bg-white border rounded-2xl p-5 shadow-sm mt-8">
    <h3 className="font-semibold mb-4 text-gray-700">
      Attendance Status Guide
    </h3>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
      <LegendItem color="bg-green-500" label="Present" />
      <LegendItem color="bg-blue-500" label="Full Day" />
      <LegendItem color="bg-amber-500" label="Half Day" />
      <LegendItem color="bg-purple-500" label="Leave" />
      <LegendItem color="bg-red-500" label="Absent" />
    </div>
  </div>
);

const LegendItem = ({
  color,
  label
}: {
  color: string;
  label: string;
}) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-gray-600">{label}</span>
  </div>
);

/* ================= SIDEBAR ================= */

const Sidebar = ({
  open,
  onClose,
  viewMode,
  setViewMode
}: any) => {
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 border-b font-bold text-lg">
          AcademiaSync
        </div>

        <div className="p-4 space-y-3">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="My Dashboard"
            active={viewMode === "personal"}
            onClick={() => {
              setViewMode("personal");
              onClose();
            }}
          />

          <SidebarItem
            icon={<Shield size={18} />}
            label="Admin Panel"
            active={viewMode === "admin"}
            onClick={() => {
              setViewMode("admin");
              onClose();
            }}
          />
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-xl transition
    ${active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
  >
    {icon}
    {label}
  </button>
);

/* ================= HEADER ================= */

const Header = ({
  title,
  onMenuClick
}: any) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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

  const unreadCount =
    notifications.filter(n => !n.isRead).length;

  return (
    <>
      <header className="bg-white border-b h-16 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick}>
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-lg">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button onClick={() => setShowInfo(true)}>
            <Info size={18} />
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
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
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
                    className="border p-3 rounded mb-3 text-sm"
                  >
                    <div className="font-medium">
                      {n.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {n.message}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-lg">
            <h2 className="font-bold mb-2 text-blue-600">
              AcademiaSync
            </h2>
            <p className="text-sm text-gray-600">
              Smart Attendance & Leave Management
            </p>
            <button
              className="mt-4 text-blue-600"
              onClick={() => setShowInfo(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= LAYOUT ================= */

const Layout = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] =
    useState<"personal" | "admin">("personal");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50 flex relative">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="flex-1 flex flex-col">

        <Header
          title={
            viewMode === "admin"
              ? "Admin Dashboard"
              : "My Attendance"
          }
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          {viewMode === "admin"
            ? <AdminDashboard />
            : <UserDashboard />}

          <StatusLegend />
        </main>
      </div>
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
          // Check token expiration basic validation
          try {
            const payload = JSON.parse(atob(savedToken.split('.')[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              // Expired
              await Preferences.remove({ key: "user" });
              await Preferences.remove({ key: "token" });
              setUser(null);
              setToken(null);
            } else {
              setUser(JSON.parse(savedUser));
              setToken(savedToken);
            }
          } catch(e) {
            // Invalid token
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
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>

      {/* 🚀 Global Toast Container */}
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
          <Route path="/" element={<Layout />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}