import React, { useState } from 'react';
import { Comment } from '../types.ts';

interface CommentListProps {
  comments: Comment[];
  onApprove: (commentId: string, editedResponse?: string) => void;
  onReject: (commentId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isDemoMode?: boolean;
  isError?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onApprove, 
  onReject, 
  onRefresh, 
  isLoading,
  isDemoMode = false,
  isError = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditText(c.draftResponse || "");
  };

  const handleApprove = (c: Comment) => {
    onApprove(c.id, editingId === c.id ? editText : c.draftResponse);
    setEditingId(null);
  };

  const pendingComments = comments.filter(c => c.status === 'pending');
  const historyComments = comments.filter(c => c.status !== 'pending');

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Review Queue</h2>
          <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border ${
            isDemoMode ? 'bg-amber-50 border-amber-200 text-amber-700' : 
            isError ? 'bg-rose-50 border-rose-200 text-rose-700' :
            'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isDemoMode ? 'bg-amber-400' : 
              isError ? 'bg-rose-400' :
              'bg-emerald-400 animate-pulse'
            }`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isDemoMode ? 'Demo Mode' : isError ? 'Connection Restricted' : 'Live YouTube Feed'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-3 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-600/20 hover:bg-purple-700 disabled:opacity-50 transition-all active:scale-95"
        >
          <i className={`fa-solid ${isLoading ? 'fa-spinner animate-spin' : isDemoMode ? 'fa-flask' : isError ? 'fa-triangle-exclamation' : 'fa-cloud-arrow-down'}`}></i>
          <span>{isDemoMode ? 'Generate Demo Comments' : isError ? 'Retry Connection' : 'Import Comments'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {pendingComments.length === 0 ? (
          <div className="bg-white p-24 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
              <i className="fa-solid fa-inbox"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Inbox Clear</h3>
            <p className="text-slate-500 font-medium mt-3 max-w-sm mx-auto text-sm">
              {isDemoMode 
                ? "Click 'Generate Demo Comments' to see how the system works." 
                : "All caught up! New comments will appear here."}
            </p>
          </div>
        ) : (
          pendingComments.map(comment => (
            <div key={comment.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:border-purple-200 transition-all duration-300">
              <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-5">
                    <img src={comment.authorAvatar} alt={comment.author} className="w-14 h-14 rounded-2xl bg-slate-100 shadow-sm object-cover" />
                    <div>
                      <div className="font-black text-lg text-slate-900">{comment.author}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                        <i className="fa-solid fa-clock mr-1"></i> {new Date(comment.publishedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] text-slate-800 font-medium text-lg border-l-8 border-purple-500 mb-8 leading-relaxed shadow-inner">
                  "{comment.text}"
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Suggested Fedshi Response</label>
                  </div>
                  {editingId === comment.id ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-8 border-2 border-purple-200 rounded-[2rem] focus:ring-4 focus:ring-purple-100 outline-none min-h-[150px] text-slate-900 font-medium transition-all"
                    />
                  ) : (
                    <div className="p-8 bg-purple-50/50 text-purple-900 rounded-[2rem] border border-purple-100 font-medium leading-relaxed italic">
                      {comment.draftResponse || "Generating draft from Knowledge Base..."}
                    </div>
                  )}
                </div>

                <div className="mt-10 flex items-center justify-end space-x-4">
                    <button 
                      onClick={() => onReject(comment.id)}
                      className="px-6 py-4 text-rose-600 font-black uppercase tracking-widest text-xs"
                    >
                      Reject
                    </button>
                    {editingId !== comment.id && (
                      <button 
                        onClick={() => startEdit(comment)}
                        className="px-6 py-4 text-purple-600 font-black uppercase tracking-widest text-xs"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => handleApprove(comment)}
                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black font-black uppercase tracking-widest text-xs active:scale-95"
                    >
                      Approve & Reply
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;