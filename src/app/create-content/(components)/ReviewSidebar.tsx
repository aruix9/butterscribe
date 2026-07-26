'use client';

import { useState } from "react";
import { CheckCircle2, MessageSquare, Reply, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ReviewSidebarProps {
  isReviewMode: boolean;
  comments?: any[];
  onRefreshComments?: () => void;
  documentId?: string | null;
}

export function ReviewSidebar({ isReviewMode, comments = [], onRefreshComments, documentId }: ReviewSidebarProps) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const topLevelComments = comments.filter(c => !c.parentId);
  const openCount = topLevelComments.length;


  const getTimeAgo = (dateStr: string) => {
    if (!dateStr) return "Just now";
    const now = new Date();
    const then = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (seconds < 60) return `${Math.max(seconds, 1)}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleResolveComment = async (commentId: string) => {
    setResolvingId(commentId);
    try {
      const res = await fetch(`/api/comments?id=${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to resolve comment");
      toast.success("Comment resolved");
      if (onRefreshComments) onRefreshComments();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not resolve comment");
    } finally {
      setResolvingId(null);
    }
  };

  const handlePostReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || !documentId) return;

    setIsSubmittingReply(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          text: replyText.trim(),
          parentId
        }),
      });

      if (!res.ok) throw new Error("Failed to post reply");

      setReplyText("");
      setReplyingToId(null);
      toast.success("Reply added");
      if (onRefreshComments) onRefreshComments();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <aside className="hidden xl:flex w-80 flex-shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-y-auto transition-colors">
      {isReviewMode ? (
        <div className="flex flex-col h-full font-sans">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Review Comments</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Collaborate with your team</p>
            </div>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
              {openCount} {openCount === 1 ? 'Open' : 'Open'}
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1">
            {topLevelComments.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-xs flex flex-col items-center justify-center gap-2">
                <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                <p className="font-semibold text-zinc-600 dark:text-zinc-400">No review comments yet.</p>
                <p className="text-[11px] text-zinc-400">Open the Live Preview page to select text and leave feedback.</p>
              </div>
            ) : (
              topLevelComments.map((comment) => {
                const replies = comments.filter(c => c.parentId === comment._id);

                return (
                  <div key={comment._id} className="bg-white dark:bg-zinc-900 rounded-xl border border-blue-200 dark:border-blue-900/50 p-4 shadow-xs relative ring-1 ring-blue-100 dark:ring-blue-900/20">
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden relative flex items-center justify-center text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                          {comment.userAvatar ? (
                            <Image fill src={comment.userAvatar} alt={comment.userName} className="object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            comment.userName ? comment.userName.substring(0, 2).toUpperCase() : 'U'
                          )}
                        </div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">{comment.userName}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium">{getTimeAgo(comment.createdAt)}</span>
                    </div>

                    {/* Selected Text Highlight Quote */}
                    {comment.selection && (
                      <div className="border-l-2 border-amber-400 pl-2.5 mb-2.5 bg-amber-50/40 dark:bg-amber-950/20 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 italic rounded-r-md">
                        "{comment.selection}"
                      </div>
                    )}

                    {/* Comment Body */}
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed mb-3 font-medium">
                      {comment.text}
                    </p>

                    {/* Nested Replies List */}
                    {replies.length > 0 && (
                      <div className="space-y-2 mb-3 pl-2 border-l-2 border-zinc-100 dark:border-zinc-800">
                        {replies.map(reply => (
                          <div key={reply._id} className="bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-zinc-900 dark:text-white">{reply.userName}</span>
                              <span className="text-[9px] text-zinc-400">{getTimeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-normal">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Box */}
                    {replyingToId === comment._id && (
                      <form onSubmit={(e) => handlePostReply(e, comment._id)} className="mb-3 space-y-2">
                        <textarea
                          autoFocus
                          required
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingReply}
                            className="px-2.5 py-1 bg-primary text-white rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            {isSubmittingReply ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            Post
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => { setReplyingToId(comment._id); setReplyText(""); }}
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
                      >
                        <Reply className="w-3 h-3" /> Reply
                      </button>
                      <button
                        disabled={resolvingId === comment._id}
                        onClick={() => handleResolveComment(comment._id)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-emerald-600 ml-auto uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        {resolvingId === comment._id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        Resolve
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Optimization Suite</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Real-time content analysis</p>

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">SEO Score</span>
              <span className="text-sm font-semibold text-primary">85/100</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 mb-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Good readability. Add more keywords.</p>
          </div>

          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 tracking-wide uppercase text-[10px]">Keyword Density</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-900/30 flex items-center gap-1.5 transition-colors">
              AI <span className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-[10px]">12</span>
            </span>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-900/30 flex items-center gap-1.5 transition-colors">
              Ecosystem <span className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-[10px]">8</span>
            </span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 transition-colors">
              Generative <span className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">5</span>
            </span>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 transition-colors">
              Models <span className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">3</span>
            </span>
            <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold border border-red-100 dark:border-blue-900/30 flex items-center gap-1.5 transition-colors">
              Neural <span className="bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded text-[10px]">1</span>
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
