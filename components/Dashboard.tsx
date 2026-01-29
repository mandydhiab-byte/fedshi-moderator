
import React from 'react';
import { DashboardMetrics } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  metrics: DashboardMetrics;
}

const mockChartData = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 19 },
  { name: 'Wed', count: 15 },
  { name: 'Thu', count: 22 },
  { name: 'Fri', count: 30 },
  { name: 'Sat', count: 18 },
  { name: 'Sun', count: 25 },
];

const Dashboard: React.FC<DashboardProps> = ({ metrics }) => {
  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-comments"></i>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">+12%</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">{metrics.totalComments}</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">Total Comments</div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-check-double"></i>
            </div>
            <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-widest">{metrics.approvalRate}%</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">{metrics.approvalRate}%</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">Approval Rate</div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-bullseye"></i>
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">{metrics.averageAccuracy}%</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">AI Accuracy</div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-robot"></i>
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">{metrics.autoRespondedCount}</div>
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">Auto-Pilot</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Interaction Trends</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700}}
                />
                <Area type="monotone" dataKey="count" stroke="#9333ea" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Summary</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Manual Approvals</span>
                <span className="text-slate-900 font-black">{metrics.manualReviewCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-violet-500 h-full rounded-full" style={{ width: `${(metrics.manualReviewCount / (metrics.totalComments || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Auto-Pilot Replies</span>
                <span className="text-slate-900 font-black">{metrics.autoRespondedCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(metrics.autoRespondedCount / (metrics.totalComments || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div className="pt-8 mt-8 border-t border-slate-100">
              <button className="w-full py-4 text-purple-600 bg-purple-50 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-100 transition-all flex items-center justify-center space-x-2">
                <span>View Insights</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
