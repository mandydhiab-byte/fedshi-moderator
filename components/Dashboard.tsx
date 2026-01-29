
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-comments text-xl"></i>
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{metrics.totalComments}</div>
          <div className="text-sm text-gray-500 font-medium">Total Comments</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-check-double text-xl"></i>
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{metrics.approvalRate}%</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{metrics.approvalRate}%</div>
          <div className="text-sm text-gray-500 font-medium">Approval Rate</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-bullseye text-xl"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{metrics.averageAccuracy}%</div>
          <div className="text-sm text-gray-500 font-medium">Avg AI Accuracy</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-robot text-xl"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{metrics.autoRespondedCount}</div>
          <div className="text-sm text-gray-500 font-medium">Auto-pilot Replies</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Interaction Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Moderation Stats</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Manual Approvals</span>
                <span className="text-gray-900 font-bold">{metrics.manualReviewCount}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(metrics.manualReviewCount / (metrics.totalComments || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Auto-Responded</span>
                <span className="text-gray-900 font-bold">{metrics.autoRespondedCount}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(metrics.autoRespondedCount / (metrics.totalComments || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold cursor-pointer hover:underline text-sm">
                <span>View full report</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
