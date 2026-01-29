
import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  onRefreshKB: () => void;
  isRefreshing: boolean;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onRefreshKB, isRefreshing }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">General Configuration</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
            <div>
              <div className="font-bold text-indigo-900">Auto-Pilot Mode</div>
              <p className="text-sm text-indigo-700">When enabled, AI will automatically respond to comments above 90% accuracy.</p>
            </div>
            <button 
              onClick={() => onUpdate({ autoPilot: !settings.autoPilot })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.autoPilot ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoPilot ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Google Sheet ID (Knowledge Base)</label>
              <input
                type="text"
                value={settings.sheetId}
                onChange={(e) => onUpdate({ sheetId: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 1JPdXwoH2TfEhFVkidOkO_x3mrmJobdIKZSAL7qul_wM"
              />
              <p className="text-xs text-gray-400 mt-2">Connect your Q&A knowledge base from Google Sheets.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Channel ID</label>
              <input
                type="text"
                value={settings.youtubeChannelId}
                onChange={(e) => onUpdate({ youtubeChannelId: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="UC..."
              />
              <p className="text-xs text-gray-400 mt-2">The unique identifier of your YouTube channel.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <button 
            onClick={onRefreshKB}
            disabled={isRefreshing}
            className="w-full py-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center space-x-3"
          >
            <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? 'animate-spin' : ''}`}></i>
            <span>{isRefreshing ? 'Refreshing Knowledge Base...' : 'Refresh Knowledge Base Now'}</span>
          </button>
          <p className="text-center text-xs text-gray-400 mt-3 italic">
            Last sync successful: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Security & Billing</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                <i className="fa-solid fa-key"></i>
              </div>
              <div>
                <div className="font-bold text-gray-800">API Key Configured</div>
                <div className="text-sm text-gray-500">Google Gemini API key is managed via environment.</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Active</div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <div className="font-bold text-gray-800">Allowed Login Domain</div>
                <div className="text-sm text-gray-500">Restricted to @fedshi.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
