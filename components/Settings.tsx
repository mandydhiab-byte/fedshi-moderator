import React, { useState } from 'react';
import { AppSettings, KnowledgeBaseEntry } from '../types.ts';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  onRefreshKB: () => void;
  isRefreshing: boolean;
  kb: KnowledgeBaseEntry[];
  apiError?: { message: string; isReferer: boolean } | null;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onRefreshKB, isRefreshing, kb, apiError }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKb = kb.filter(entry => 
    entry.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Service Configuration</h3>
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gemini AI API Key</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => onUpdate({ apiKey: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all text-slate-900 font-bold"
              placeholder="Paste your Gemini API key here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Google Sheet ID</label>
              <input
                type="text"
                value={settings.sheetId}
                onChange={(e) => onUpdate({ sheetId: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">YouTube Channel ID</label>
              <input
                type="text"
                value={settings.youtubeChannelId}
                onChange={(e) => onUpdate({ youtubeChannelId: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
              />
            </div>
          </div>

          <button 
            onClick={onRefreshKB}
            disabled={isRefreshing}
            className="w-full py-5 border-2 border-purple-600 text-purple-600 font-black rounded-2xl hover:bg-purple-50 transition-all flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-xs"
          >
            <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? 'animate-spin' : ''}`}></i>
            <span>{isRefreshing ? 'Syncing...' : 'Sync Knowledge Base'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Knowledge Base</h3>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter entries..."
            className="px-4 py-2 bg-slate-50 border rounded-xl text-xs font-bold outline-none"
          />
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {filteredKb.map((entry, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-purple-100">
              <div className="text-slate-900 font-black text-sm mb-2">Q: {entry.question}</div>
              <div className="text-slate-600 font-medium text-xs">A: {entry.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;