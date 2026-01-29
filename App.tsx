import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import CommentList from './components/CommentList.tsx';
import Settings from './components/Settings.tsx';
import Auth from './components/Auth.tsx';
import { 
  Comment, 
  AppSettings, 
  DashboardMetrics, 
  User, 
  KnowledgeBaseEntry 
} from './types.ts';
import { 
  DEFAULT_SHEET_ID, 
  LOCAL_STORAGE_KEY, 
  SESSION_KEY,
  YOUTUBE_CHANNEL_ID
} from './constants.ts';
import { fetchKnowledgeBase } from './services/sheetsService.ts';
import { fetchYoutubeComments, postYoutubeReply, YoutubeApiError } from './services/youtubeService.ts';
import { generateDraftResponse } from './services/geminiService.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiError, setApiError] = useState<{ message: string; isReferer: boolean } | null>(null);
  
  const initialApiKey = (window as any).process?.env?.API_KEY || '';

  const [settings, setSettings] = useState<AppSettings>({
    autoPilot: false,
    sheetId: DEFAULT_SHEET_ID,
    youtubeChannelId: YOUTUBE_CHANNEL_ID,
    apiKey: initialApiKey
  });
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [kb, setKb] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingKB, setIsRefreshingKB] = useState(false);

  const settingsRef = useRef(settings);
  const kbRef = useRef(kb);
  const commentsRef = useRef(comments);

  useEffect(() => {
    settingsRef.current = settings;
    kbRef.current = kb;
    commentsRef.current = comments;
  }, [settings, kb, comments]);

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

  const importComments = useCallback(async (forcedChannelId?: string) => {
    setIsLoading(true);
    setApiError(null);
    const channelToUse = forcedChannelId || settingsRef.current.youtubeChannelId;
    
    try {
      const fetched = await fetchYoutubeComments(channelToUse);
      const filtered = fetched.filter(nc => !commentsRef.current.find(c => c.id === nc.id));
      
      const processed = await Promise.all(filtered.map(async (c) => {
        const draft = await generateDraftResponse(c.text, kbRef.current);
        let status: Comment['status'] = 'pending';
        let actualResponse = '';
        
        if (settingsRef.current.autoPilot && draft.score >= 95) {
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
      setApiError(null);
    } catch (error: any) {
      if (error instanceof YoutubeApiError) {
        setApiError({ message: error.message, isReferer: error.refererError });
      } else {
        setApiError({ message: error.message || "An unexpected error occurred.", isReferer: false });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enableDemoMode = () => {
    const demoId = 'UCRy5L9IoV4CvNu8AgB89qYg_MOCK';
    setSettings(prev => ({ ...prev, youtubeChannelId: demoId }));
    setApiError(null);
    setActiveTab('moderation');
    importComments(demoId);
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    const newUser: User = { ...userData, name: userData.name, email: userData.email, role: 'moderator' };
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const approveComment = async (commentId: string, editedResponse?: string) => {
    const targetComment = comments.find(c => c.id === commentId);
    if (!targetComment) return;

    const responseText = editedResponse || targetComment.draftResponse || "";
    const success = await postYoutubeReply(commentId, responseText);
    
    if (success) {
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, status: 'approved' as const, actualResponse: responseText, approvedBy: user?.name } 
          : c
      ));
    }
  };

  const rejectComment = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, status: 'rejected' as const } : c
    ));
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

  if (isAuthChecking) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-bold">Connecting to Fedshi AI...</div>;

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={logout}>
      {apiError && (
        <div className="mb-8 p-8 bg-white border-2 border-rose-100 rounded-[2.5rem] flex items-start space-x-6 shadow-xl shadow-rose-100/20">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-rose-100">
            <i className="fa-solid fa-shield-halved text-2xl"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-rose-900 font-black text-xl tracking-tight">
              {apiError.isReferer ? 'Access Restricted' : 'Connection Error'}
            </h4>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              {apiError.isReferer ? `Your API Key restricts access. Please add ${window.location.origin}/* to your Google Console restrictions.` : apiError.message}
            </p>
            <div className="mt-4 flex gap-4">
               <button onClick={() => importComments()} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">Retry Connection</button>
               <button onClick={enableDemoMode} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold">Try Demo Mode</button>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'dashboard' && <Dashboard metrics={metrics} />}
      {activeTab === 'moderation' && (
        <CommentList 
          comments={comments} 
          onApprove={approveComment} 
          onReject={rejectComment}
          onRefresh={() => importComments()}
          isLoading={isLoading}
          isDemoMode={settings.youtubeChannelId.includes('_MOCK')}
          isError={!!apiError}
        />
      )}
      {activeTab === 'settings' && (
        <Settings 
          settings={settings} 
          onUpdate={(u) => setSettings(s => ({ ...s, ...u }))} 
          onRefreshKB={refreshKB}
          isRefreshing={isRefreshingKB}
          kb={kb}
          apiError={apiError}
        />
      )}
    </Layout>
  );
};

export default App;