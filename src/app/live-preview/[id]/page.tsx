'use client';

import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NextImage from "next/image";
import { 
  ArrowLeft, 
  Edit, 
  CheckCircle, 
  ChevronRight, 
  MessageSquare, 
  FileText, 
  Clock, 
  Link2,
  Image as ImageIcon
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import {TextStyle} from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useSession } from "next-auth/react";
import { 
  Send,
  Reply,
  X
} from "lucide-react";

export default function LivePreviewPage() {
  const { data: session } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState<{ text: string; level: number; id: string }[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect | null }>({ text: '', rect: null });
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?documentId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TiptapLink.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-zinc-200 dark:border-zinc-800 my-8 w-full max-w-4xl mx-auto',
        },
      }),
    ],
    content: '',
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (id && editor) {
      const fetchDoc = async () => {
        try {
          const res = await fetch(`/api/documents/${id}`);
          if (res.ok) {
            const data = await res.json();
            setDoc(data);
            editor.commands.setContent(data.body);
            
            // Extract headings
            const extractedHeadings: any[] = [];
            editor.state.doc.descendants((node, pos) => {
              if (node.type.name === 'heading') {
                extractedHeadings.push({
                  text: node.textContent,
                  level: node.attrs.level,
                  id: `heading-${pos}`
                });
              }
            });
            setHeadings(extractedHeadings);
          }
        } catch (err) {
          console.error("Failed to fetch document", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDoc();
      fetchComments();
    }
  }, [id, editor]);

  const handleTextSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({ text: sel.toString().trim(), rect });
    } else {
      setSelection({ text: '', rect: null });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !session) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: id,
          text: commentText,
          selection: replyTo ? undefined : selection.text,
          parentId: replyTo || undefined
        }),
      });

      if (res.ok) {
        setCommentText('');
        setIsCommentModalOpen(false);
        setReplyTo(null);
        setSelection({ text: '', rect: null });
        fetchComments();
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const stats = useMemo(() => {
    if (!doc?.body) return { words: 0, readTime: 0, links: 0, headings: [], images: 0, blockquotes: 0, bold: 0, paragraphs: 0 };
    
    const body = doc.body;
    const text = body.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    const readTime = Math.ceil(words / 200);
    
    const statsObj = {
      words,
      readTime,
      links: (body.match(/<a /g) || []).length,
      images: (body.match(/<img/g) || []).length,
      blockquotes: (body.match(/<blockquote/g) || []).length,
      bold: (body.match(/<strong|<b /g) || []).length,
      paragraphs: (body.match(/<p>/g) || []).length,
      headings: [
        { label: 'H1 Tags', count: (body.match(/<h1/g) || []).length },
        { label: 'H2 Tags', count: (body.match(/<h2/g) || []).length },
        { label: 'H3 Tags', count: (body.match(/<h3/g) || []).length },
        { label: 'H4 Tags', count: (body.match(/<h4/g) || []).length },
        { label: 'H5 Tags', count: (body.match(/<h5/g) || []).length },
        { label: 'H6 Tags', count: (body.match(/<h6/g) || []).length },
      ].filter(h => h.count > 0)
    };
    
    return statsObj;
  }, [doc]);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const updateDocumentStatus = async (newStatus: string) => {
    setIsSavingStatus(true);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedDoc = await res.json();
        setDoc(updatedDoc);
        setIsStatusModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleApprove = () => {
    updateDocumentStatus('approved');
  };

  const handleRequestChangesClick = () => {
    if (doc?.status === 'approved') {
      setIsStatusModalOpen(true);
    } else {
      updateDocumentStatus('changes_requested');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Document Not Found</h1>
        <Link href="/create-content" className="text-primary hover:underline">Back to Editor</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-zinc-900 dark:text-white tracking-tighter flex items-center gap-2">
            Butterscribe
          </div>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700"></div>
          
          {doc?.status === 'approved' && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-tight">Approved</span>
            </div>
          )}
          {doc?.status === 'changes_requested' && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-3 py-1 rounded-full">
              <Edit className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-tight">Changes Requested</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRequestChangesClick}
            disabled={isSavingStatus || doc?.status === 'changes_requested'}
            className="px-4 py-2 border border-red-500 text-red-600 dark:text-red-400 font-bold text-sm rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Request Changes</span>
          </button>
          <button 
            onClick={handleApprove}
            disabled={isSavingStatus || doc?.status === 'approved'}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Approve</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
        
        {/* Left Sidebar: Document Outline */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">Document Outline</h4>
            <nav className="flex flex-col gap-3 relative border-l border-zinc-200 dark:border-zinc-800">
              {headings.length > 0 ? (
                headings.map((heading) => (
                  <a 
                    key={heading.id}
                    href={`#${heading.id}`} 
                    className={cn(
                      "pl-4 py-1 text-sm font-medium transition-colors hover:underline",
                      heading.level === 1 ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400",
                    )}
                  >
                    {heading.text}
                  </a>
                ))
              ) : (
                <span className="pl-4 text-sm text-zinc-400 italic">No headings found</span>
              )}
            </nav>
          </div>
        </aside>

        {/* Center Content Canvas */}
        <div className="flex-1 max-w-3xl w-full mx-auto relative">
          <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:tracking-tight">
            <div className="mb-12 relative">
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight mb-6 font-serif">
                {doc.title}
              </h1>
            </div>
            
            <div onMouseUp={handleTextSelection}>
              <EditorContent editor={editor} className="tiptap-preview" />
            </div>

            {/* Floating Comment Button */}
            {selection.rect && session && (
              <button
                className="fixed bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg shadow-xl px-3 py-2 flex items-center gap-2 z-50 animate-in fade-in zoom-in duration-200"
                style={{
                  top: selection.rect.top - 50,
                  left: selection.rect.left + selection.rect.width / 2,
                  transform: 'translateX(-50%)'
                }}
                onClick={() => {
                  setIsCommentModalOpen(true);
                  setReplyTo(null);
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-bold">Comment</span>
              </button>
            )}
          </article>
        </div>

        {/* Right Sidebar: Insights & Comments */}
        <aside className="hidden xl:block w-80 shrink-0 space-y-6">
            {/* Content Stats Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden group">
              <div className="w-full flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Content Stats</h4>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3 h-3" /> Words
                    </span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                      {stats.words.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Read Time
                    </span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                      {stats.readTime}m
                    </span>
                  </div>
                </div>
                
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4"></div>
                
                <ul className="space-y-3">
                  {stats.headings.map((h, i) => (
                    <li key={i} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{h.label}</span>
                      <span className="text-xs font-bold bg-white dark:bg-zinc-700 px-2.5 py-1 rounded shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-600">{h.count}</span>
                    </li>
                  ))}
                  
                  {stats.links > 0 && (
                    <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" /> Internal Links
                      </span>
                      <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded shadow-sm">
                        {stats.links}
                      </span>
                    </li>
                  )}

                  {stats.images > 0 && (
                    <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" /> Images
                      </span>
                      <span className="text-xs font-bold bg-white dark:bg-zinc-700 px-2.5 py-1 rounded shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-600">{stats.images}</span>
                    </li>
                  )}

                  {stats.blockquotes > 0 && (
                    <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Blockquotes
                      </span>
                      <span className="text-xs font-bold bg-white dark:bg-zinc-700 px-2.5 py-1 rounded shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-600">{stats.blockquotes}</span>
                    </li>
                  )}

                  {stats.bold > 0 && (
                    <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 font-bold">
                        B Bold Text
                      </span>
                      <span className="text-xs font-bold bg-white dark:bg-zinc-700 px-2.5 py-1 rounded shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-600">{stats.bold}</span>
                    </li>
                  )}

                  {stats.paragraphs > 0 && (
                    <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Paragraphs
                      </span>
                      <span className="text-xs font-bold bg-white dark:bg-zinc-700 px-2.5 py-1 rounded shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-600">{stats.paragraphs}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Inline Comments Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden group">
              <div className="w-full flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Inline Comments</h4>
              </div>
              
              <div className="p-5 block max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {comments.filter(c => !c.parentId).map((comment) => (
                    <div key={comment._id} className="space-y-3">
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-lg p-4 relative">
                        {comment.selection && (
                          <div className="mb-2 text-[10px] font-medium text-zinc-400 italic line-clamp-1 border-l-2 border-zinc-200 dark:border-zinc-700 pl-2">
                            "{comment.selection}"
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden relative">
                              {comment.userAvatar ? (
                                <NextImage fill src={comment.userAvatar} alt={comment.userName} className="object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300">
                                  {comment.userName.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">{comment.userName}</span>
                          </div>
                          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{getTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                          {comment.text}
                        </p>
                        {session && (
                          <button 
                            onClick={() => {
                              setIsCommentModalOpen(true);
                              setReplyTo(comment._id);
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                          >
                            <Reply className="w-3 h-3" /> Reply
                          </button>
                        )}
                      </div>

                      {/* Replies */}
                      {comments.filter(r => r.parentId === comment._id).map((reply) => (
                        <div key={reply._id} className="ml-6 bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden relative">
                                {reply.userAvatar ? (
                                  <NextImage fill src={reply.userAvatar} alt={reply.userName} className="object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-zinc-600 dark:text-zinc-400">
                                    {reply.userName.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span className="text-[11px] font-bold text-zinc-900 dark:text-white">{reply.userName}</span>
                            </div>
                            <span className="text-[9px] font-medium text-zinc-500 dark:text-zinc-400">{getTimeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center py-6 text-zinc-400 text-sm">
                      No comments yet. Select text to add one!
                    </div>
                  )}
                </div>
              </div>
            </div>
        </aside>
      </main>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                {replyTo ? <Reply className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                {replyTo ? "Reply to Comment" : "Add Inline Comment"}
              </h3>
              <button onClick={() => setIsCommentModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddComment}>
              <div className="p-6">
                {!replyTo && selection.text && (
                  <div className="mb-4 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg border-l-4 border-primary">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Selected Text</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 italic line-clamp-2">"{selection.text}"</p>
                  </div>
                )}
                <textarea
                  autoFocus
                  required
                  placeholder={replyTo ? "Write your reply..." : "What's your feedback on this selection?"}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[120px] resize-none"
                />
              </div>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCommentModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                  {replyTo ? "Post Reply" : "Post Comment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Status Confirmation Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-red-500" />
                Request Changes?
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                This document is already **Approved**. Are you sure you want to mark it for **Request Changes**?
              </p>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                No, Keep Approved
              </button>
              <button 
                type="button"
                onClick={() => updateDocumentStatus('changes_requested')}
                className="px-6 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
              >
                Yes, Request Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0 mt-auto">
        <span className="font-bold text-zinc-900 dark:text-white">Butterscribe</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">© 2024 Butterscribe. All rights reserved.</span>
      </footer>
    </div>
  );
}
