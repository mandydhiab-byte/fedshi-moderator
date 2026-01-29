
import React, { useState } from 'react';
import { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
  onApprove: (commentId: string, editedResponse?: string) => void;
  onReject: (commentId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onApprove, onReject, onRefresh, isLoading }) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Review Queue</h2>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          <i className={`fa-solid fa-sync ${isLoading ? 'animate-spin' : ''}`}></i>
          <span>Import Comments</span>
        </button>
      </div>

      <div className="space-y-4">
        {pendingComments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-inbox text-2xl"></i>
            </div>
            <h3 className="text-gray-900 font-bold">No comments pending</h3>
            <p className="text-gray-500 text-sm mt-1">Import new comments from YouTube to get started.</p>
          </div>
        ) : (
          pendingComments.map(comment => (
            <div key={comment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={comment.authorAvatar} alt={comment.author} className="w-10 h-10 rounded-full bg-gray-200" />
                    <div>
                      <div className="font-bold text-gray-900">{comment.author}</div>
                      <div className="text-xs text-gray-500">{new Date(comment.publishedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">Drafting AI...</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-gray-800 border-l-4 border-indigo-400">
                  {comment.text}
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI Suggested Reply</label>
                  {editingId === comment.id ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-4 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[100px]"
                    />
                  ) : (
                    <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 italic">
                      {comment.draftResponse || "Generating draft..."}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-400 font-medium">
                    {comment.accuracyScore && (
                      <span className="flex items-center">
                        <i className="fa-solid fa-chart-line mr-1 text-green-500"></i>
                        {comment.accuracyScore}% match
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => onReject(comment.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                    >
                      Reject
                    </button>
                    {editingId !== comment.id && (
                      <button 
                        onClick={() => startEdit(comment)}
                        className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-medium"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => handleApprove(comment)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100 transition font-bold"
                    >
                      Approve & Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Moderation History</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Moderator</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyComments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">No history yet.</td>
                </tr>
              ) : (
                historyComments.map(comment => (
                  <tr key={comment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={comment.authorAvatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-gray-900">{comment.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        comment.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        comment.status === 'auto_responded' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {comment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {comment.approvedBy || (comment.status === 'auto_responded' ? 'AI Bot' : 'System')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(comment.publishedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommentList;
