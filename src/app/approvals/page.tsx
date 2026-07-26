'use client';

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import {
  Filter,
  Search,
  FileText,
  Video,
  Sparkles,
  CheckCircle,
  Eye,
  MessageSquare,
  Loader2,
  RefreshCw,
  Clock,
  AlertTriangle,
  XCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Restricted from "@/components/shared/layout/Restricted";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ApprovalDocument {
  _id: string;
  title: string;
  description?: string;
  body?: string;
  status: 'draft' | 'pending_approval' | 'in_review' | 'changes_requested' | 'approved' | 'published' | 'archived';
  userId?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
  createdAt: string;
  updatedAt: string;
  aiGenerationId?: string;
}

export default function ApprovalsPage() {
  const { isSidebarCollapsed } = useLayoutStore();
  const { data: session, status: sessionStatus } = useSession();
  const isSuperUser = (session?.user as any)?.role === 'super user';
  const isManager = (session?.user as any)?.role === 'manager';

  const [documents, setDocuments] = useState<ApprovalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch approvals dynamically from API
  const fetchApprovals = useCallback(async () => {
    if (!isSuperUser && !isManager) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        search: search.trim(),
        status: statusFilter,
        timeFilter: timeFilter,
        page: page.toString(),
        limit: "10"
      });

      const res = await fetch(`/api/approvals?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch approvals");
      }

      const data = await res.json();
      setDocuments(data.documents || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load approvals list");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, timeFilter, page, isSuperUser, isManager]);

  useEffect(() => {
    if (isSuperUser || isManager) {
      fetchApprovals();
    }
  }, [fetchApprovals, isSuperUser, isManager]);

  // Handle Approve Action
  const handleApprove = async (docId: string, docTitle: string) => {
    setActionLoadingId(docId);
    try {
      const res = await fetch(`/api/approvals/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to approve document");
      }

      toast.success(`Document "${docTitle}" approved!`);
      fetchApprovals();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to approve document");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Request Changes Action
  const handleRequestChanges = async (docId: string, docTitle: string) => {
    setActionLoadingId(docId);
    try {
      const res = await fetch(`/api/approvals/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "changes_requested" })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to request changes");
      }

      toast.success(`Changes requested for "${docTitle}".`);
      fetchApprovals();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to request changes");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status Badge Formatting Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Approved
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Changes Requested
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            In Review
          </span>
        );
      case 'pending_approval':
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Pending Approval
          </span>
        );
    }
  };

  // Auth Loading Guard
  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Access Restricted Guard (for Non-SuperUser and Non-Manager)
  if (!isSuperUser && !isManager) {
    return (
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <Header />
        <Sidebar />
        <main className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
          isSidebarCollapsed ? "ml-20" : "ml-64"
        )}>
          <Restricted />
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="p-8 max-w-[1440px] mx-auto w-full flex-1 font-sans">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-1">Approvals Hub</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                Review, approve, or request revisions for content items generated across your platform.
              </p>
            </div>

            <Button
              onClick={fetchApprovals}
              variant="outline"
              className="gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 self-start md:self-auto"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh List
            </Button>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

              {/* Search Bar */}
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by title or description..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-xs transition-all"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-xs cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Pending Approval</option>
                  <option value="in_review">In Review</option>
                  <option value="changes_requested">Changes Requested</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>

            {/* Quick Time Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-1">Time:</span>
              <button
                onClick={() => { setTimeFilter("all"); setPage(1); }}
                className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all cursor-pointer",
                  timeFilter === "all"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-primary"
                )}
              >
                All Time
              </button>
              <button
                onClick={() => { setTimeFilter("today"); setPage(1); }}
                className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all cursor-pointer",
                  timeFilter === "today"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-primary"
                )}
              >
                Today
              </button>
              <button
                onClick={() => { setTimeFilter("week"); setPage(1); }}
                className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all cursor-pointer",
                  timeFilter === "week"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-primary"
                )}
              >
                This Week
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    <th className="p-4 pl-6 font-medium whitespace-nowrap">Content Document</th>
                    <th className="p-4 font-medium whitespace-nowrap">Author / Creator</th>
                    <th className="p-4 font-medium whitespace-nowrap">Status</th>
                    <th className="p-4 font-medium whitespace-nowrap">Last Updated</th>
                    <th className="p-4 pr-6 font-medium whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          <p className="text-sm font-medium">Loading approval documents...</p>
                        </div>
                      </td>
                    </tr>
                  ) : documents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                          <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">No approval documents found</p>
                          <p className="text-xs text-zinc-400 max-w-sm">Try adjusting your search criteria or status filter.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => {
                      const authorName = doc.userId?.name || 'System / AI';
                      const authorAvatar = doc.userId?.image;

                      return (
                        <tr key={doc._id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors group">

                          {/* Content Document Title & Description */}
                          <td className="p-4 pl-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded mt-0.5 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                {doc.aiGenerationId ? (
                                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <p className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5 truncate">{doc.title}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-md">
                                  {doc.description || (doc.body ? doc.body.replace(/<[^>]*>?/gm, '').substring(0, 100) : "No description provided.")}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Author / Creator Column */}
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-xs border border-primary/20">
                                {authorAvatar ? (
                                  <Image
                                    fill
                                    src={authorAvatar}
                                    alt={authorName}
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  authorName[0]?.toUpperCase() || "A"
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{authorName}</span>
                                {doc.userId?.role && (
                                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">{doc.userId.role}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="p-4 whitespace-nowrap">
                            {getStatusBadge(doc.status)}
                          </td>

                          {/* Last Updated Date */}
                          <td className="p-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
                          </td>

                          {/* Actions Column */}
                          <td className="p-4 pr-6 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">

                              {/* Live Preview Button */}
                              <Link
                                href={`/live-preview/${doc._id}`}
                                target="_blank"
                                className="p-2 text-zinc-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-zinc-200 dark:border-zinc-800"
                                title="Open Live Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              {/* Approve Button */}
                              <button
                                disabled={actionLoadingId === doc._id}
                                onClick={() => handleApprove(doc._id, doc.title)}
                                className="p-2 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all border border-zinc-200 dark:border-zinc-800"
                                title="Approve Document"
                              >
                                {actionLoadingId === doc._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
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

            {/* Pagination Footer */}
            {!loading && total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-500 gap-4">
                <div>
                  Showing <span className="text-zinc-900 dark:text-white font-bold">{documents.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to <span className="text-zinc-900 dark:text-white font-bold">{Math.min(page * 10, total)}</span> of <span className="text-zinc-900 dark:text-white font-bold">{total}</span> approvals
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="h-8 text-xs font-bold"
                  >
                    Previous
                  </Button>

                  <span className="px-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="h-8 text-xs font-bold"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
