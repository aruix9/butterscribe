'use client';

import { FileText, Eye, Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentData {
  _id: string;
  title: string;
  body: string;
  status: string;
  updatedAt: string;
}

interface DocumentTableProps {
  documents: DocumentData[];
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
  onDeleteDocument?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  changes_requested: { label: "Requested Changes", color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" },
  published: { label: "Published", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  draft: { label: "Draft", color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" },
};

const stripHtml = (html: string) => {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export function DocumentTable({ 
  documents, 
  isLoading, 
  error, 
  emptyMessage = "No documents found matching your criteria.",
  onDeleteDocument
}: DocumentTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    setDeletingId(deleteModal.id);
    try {
      const res = await fetch(`/api/documents/${deleteModal.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete document");

      toast.success(`"${deleteModal.title}" has been deleted.`);
      if (onDeleteDocument) {
        onDeleteDocument(deleteModal.id);
      }
      setDeleteModal({ isOpen: false, id: '', title: '' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm min-h-[400px] flex flex-col font-sans">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                <th className="p-4 pl-6 font-medium whitespace-nowrap w-1/2">Title & Description</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium whitespace-nowrap text-right">Last Edited</th>
                <th className="p-4 pr-6 font-medium whitespace-nowrap text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-500">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium">Updating library...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-rose-500">
                    <p className="text-sm font-medium">Error: {error}</p>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-zinc-500">
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => {
                  const status = statusConfig[doc.status] || statusConfig.draft;
                  const description = stripHtml(doc.body);
                  
                  return (
                    <tr key={doc._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                      {/* Document Title (links to edit document) */}
                      <td className="p-4 pl-6 w-1/2">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded mt-1 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <Link 
                              href={`/create-content/${doc._id}`} 
                              className="text-sm font-bold text-zinc-900 dark:text-white mb-1 truncate hover:text-primary transition-colors block"
                              title="Edit Document"
                            >
                              {doc.title}
                            </Link>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                          status.color
                        )}>
                          {status.label}
                        </span>
                      </td>

                      {/* Last Edited Column */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{formatDate(doc.updatedAt)}</p>
                      </td>

                      {/* Actions Column (View & Delete) */}
                      <td className="p-4 pr-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button (links to live preview) */}
                          <Link
                            href={`/live-preview/${doc._id}`}
                            target="_blank"
                            className="p-2 text-zinc-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-zinc-200 dark:border-zinc-800"
                            title="Open Live Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            disabled={deletingId === doc._id}
                            onClick={() => setDeleteModal({ isOpen: true, id: doc._id, title: doc.title })}
                            className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 cursor-pointer"
                            title="Delete Document"
                          >
                            {deletingId === doc._id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Themed Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete Document</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-zinc-900 dark:text-white font-semibold">"{deleteModal.title}"</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
                className="px-4 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 uppercase tracking-tight rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === deleteModal.id}
                onClick={confirmDelete}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs uppercase tracking-tight flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {deletingId === deleteModal.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
