
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-robot text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">Fedshi AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'moderation' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-comments"></i>
            <span>Moderation</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 bg-slate-800 m-4 rounded-xl">
          <div className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest">User Session</div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="truncate flex-1">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-red-400 hover:text-red-300 font-semibold"
          >
            <i className="fa-solid fa-right-from-bracket mr-1"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-gray-800 capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Last synced: Just now</span>
            <button className="p-2 text-gray-400 hover:text-indigo-600 transition">
              <i className="fa-solid fa-rotate"></i>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
