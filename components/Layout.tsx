
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
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col border-r border-slate-800">
        <div className="p-8 flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/20">
            <i className="fa-solid fa-robot text-2xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">Fedshi AI</span>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em] mt-1">Moderator</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
          >
            <i className="fa-solid fa-chart-line text-lg"></i>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'moderation' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
          >
            <i className="fa-solid fa-comments text-lg"></i>
            <span>Moderation</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
          >
            <i className="fa-solid fa-sliders text-lg"></i>
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-6 bg-slate-900/50 m-4 rounded-[1.5rem] border border-slate-800/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate flex-1">
              <div className="text-sm font-bold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-500 truncate font-medium">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 font-black uppercase tracking-widest flex items-center justify-center space-x-2 border border-rose-400/20 rounded-lg hover:bg-rose-400/5 transition-all"
          >
            <i className="fa-solid fa-right-from-bracket"></i> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h1 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h1>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
              <span className="text-xs text-emerald-500 font-bold flex items-center justify-end">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                Connected
              </span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
              <i className="fa-solid fa-rotate"></i>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
