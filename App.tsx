import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { IUser, Role } from './types';
import { dbService } from './services/mockDb';
import { LogOut, Menu, User, Bell, LayoutDashboard, FileText, CheckCircle, Info } from 'lucide-react';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// --- Auth Context ---
interface AuthContextType {
  user: IUser | null;
  login: (u: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// --- Layout Components ---
const Sidebar = ({ isOpen, onClose, role, setViewMode }: { isOpen: boolean; onClose: () => void; role: Role[]; setViewMode: (mode: 'personal' | 'admin') => void }) => {
  const { user, logout } = useAuth();
  
  const hasAdmin = role.includes(Role.ADMIN);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose}></div>}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out z-30 lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-primary-400">AcademiaSync</h2>
          <button onClick={onClose} className="lg:hidden"><Menu size={20}/></button>
        </div>
        
        <div className="p-4">
          <div className="mb-6 flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
             <div className="bg-primary/20 p-2 rounded-full text-blue-400">
               <User size={20} />
             </div>
             <div>
               <p className="font-medium text-sm text-slate-200">{user?.name}</p>
               <p className="text-xs text-slate-400 uppercase">{user?.role.join(' & ')}</p>
             </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => { setViewMode('personal'); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors text-left">
              <LayoutDashboard size={18} />
              <span>My Dashboard</span>
            </button>
            
            {hasAdmin && (
              <button onClick={() => { setViewMode('admin'); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors text-left text-blue-300">
                <CheckCircle size={18} />
                <span>Team Management</span>
              </button>
            )}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full p-2">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ onMenuClick, title }: { onMenuClick: () => void, title: string }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Info size={20} />
        </button>
      </div>
    </header>
  );
};

interface LayoutProps {
  children?: React.ReactNode;
  viewMode: 'personal' | 'admin';
  setViewMode: (mode: 'personal' | 'admin') => void;
}

const Layout = ({ children, viewMode, setViewMode }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        role={user.role} 
        setViewMode={setViewMode}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={viewMode === 'admin' ? 'Admin Dashboard' : 'My Attendance'}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [viewMode, setViewMode] = useState<'personal' | 'admin'>('personal');

  // Load user from session if simulates persistence (skipping for simplicity in this demo, assumes fresh login)
  
  const login = (u: IUser) => {
    setUser(u);
    // If admin, default to personal view, can switch
  };

  const logout = () => {
    setUser(null);
    setViewMode('personal');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Layout viewMode={viewMode} setViewMode={setViewMode}>
              {viewMode === 'personal' ? <UserDashboard /> : <AdminDashboard />}
            </Layout>
          } />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}