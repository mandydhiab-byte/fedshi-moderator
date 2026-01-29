
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CommentList from './components/CommentList';
import Settings from './components/Settings';
import Auth from './components/Auth';
import { 
  Comment, 
  AppSettings, 
  DashboardMetrics, 
  User, 
  KnowledgeBaseEntry 
} from './types';
import { 
  DEFAULT_SHEET_ID, 
  LOCAL_STORAGE_KEY, 
  SESSION_KEY,
  YOUTUBE_CHANNEL_ID
} from './constants';
import { fetchKnowledgeBase } from './services/sheetsService';
import { fetchYoutubeComments, postYoutubeReply } from './services/youtubeService';
import { generateDraftResponse } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState<AppSettings>({
    autoPilot: false,
    sheetId: DEFAULT_SHEET_ID,
    youtubeChannelId: YOUTUBE_CHANNEL_ID,
    apiKey: process.env.API_KEY || ''
  });
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [kb, setKb] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingKB, setIsRefreshingKB] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) setUser(JSON.parse(savedSession));
    
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setComments(parsed.comments || []);
      setSettings(parsed.settings || settings);
    }
    setIsAuthChecking(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ comments, settings }));
    }
  }, [comments, settings, user]);

  const refreshKB = useCallback(async () => {
    setIsRefreshingKB(true);
    const data = await fetchKnowledgeBase(settings.sheetId);
    setKb(data);
    setIsRefreshingKB(false);
  }, [settings.sheetId]);

  useEffect(() => {
    if (user) refreshKB();
  }, [user, refreshKB]);

  const importComments = async () => {
    setIsLoading(true);
    try {
      const fetched = await fetchYoutubeComments(settings.youtubeChannelId);
      const filtered = fetched.filter(nc => !comments.find(c => c.id === nc.id));
      
      const processed = await Promise.all(filtered.map(async (c) => {
        const draft = await generateDraftResponse(c.text, kb);
        let status: Comment['status'] = 'pending';
        let actualResponse = '';
        
        if (settings.autoPilot && draft.score >= 95) {
          const success = await postYoutubeReply(c.id, draft.text);
          if (success) {
            status = 'auto_responded';
            actualResponse = draft.text;
          }
        }

        return {
          ...c,
          draftResponse: draft.text,
          accuracyScore: draft.score,
          status,
          actualResponse
        };
      }));

      setComments(prev => [...processed, ...prev]);
    } catch (error) {
      console.error("Import failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveComment = async (id: string, editedResponse?: string) => {
    const responseText = editedResponse || "";
    const success = await postYoutubeReply(id, responseText);
    
    if (success) {
      setComments(prev => prev.map(c => 
        c.id === id ? { 
          ...c, 
          status: 'approved', 
          actualResponse: responseText,
          approvedBy: user?.name
        } : c
      ));
    }
  };

  const rejectComment = (id: string) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'rejected' } : c
    ));
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const handleLogin = (u: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  const metrics: DashboardMetrics = {
    totalComments: comments.length,
    approvalRate: comments.length > 0 
      ? Math.round((comments.filter(c => c.status === 'approved' || c.status === 'auto_responded').length / comments.length) * 100) 
      : 0,
    averageAccuracy: comments.length > 0
      ? Math.round(comments.reduce((acc, c) => acc + (c.accuracyScore || 0), 0) / comments.length)
      : 0,
    autoRespondedCount: comments.filter(c => c.status === 'auto_responded').length,
    manualReviewCount: comments.filter(c => c.status === 'approved' || c.status === 'rejected').length
  };

  if (isAuthChecking) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Fedshi AI...</div>;

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={logout}>
      {activeTab === 'dashboard' && <Dashboard metrics={metrics} />}
      {activeTab === 'moderation' && (
        <CommentList 
          comments={comments} 
          onApprove={approveComment} 
          onReject={rejectComment}
          onRefresh={importComments}
          isLoading={isLoading}
        />
      )}
      {activeTab === 'settings' && (
        <Settings 
          settings={settings} 
          onUpdate={(u) => setSettings(s => ({ ...s, ...u }))} 
          onRefreshKB={refreshKB}
          isRefreshing={isRefreshingKB}
        />
      )}
    </Layout>
  );
};

export default App;
