'use client';

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Plus, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DocumentTable } from "@/components/shared/DocumentTable";

interface DocumentData {
  _id: string;
  title: string;
  body: string;
  status: string;
  updatedAt: string;
}

function ContentLibraryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSidebarCollapsed } = useLayoutStore();

  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive state from search params
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '' || (key === 'page' && value === 1) || (key === 'status' && value === 'all')) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
 
      return newParams.toString();
    },
    [searchParams]
  );

  const handleParamChange = (params: Record<string, string | number | null>) => {
    const queryString = createQueryString(params);
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const query = createQueryString({});
        const response = await fetch(`/api/documents?${query}`);
        if (!response.ok) throw new Error('Failed to fetch documents');
        const data = await response.json();
        setDocuments(data.documents);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [searchQuery, statusFilter, page, limit, createQueryString]);

  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex-1 flex flex-col">
      {/* Action & Filter Zone */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary w-64 transition-all text-sm h-9" 
              placeholder="Search by title..." 
              type="text"
              value={searchQuery}
              onChange={(e) => handleParamChange({ search: e.target.value, page: 1 })}
            />
          </div>

          <Select value={statusFilter} onValueChange={(val) => handleParamChange({ status: val, page: 1 })}>
            <SelectTrigger className="w-[160px] bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 h-9">
              <SelectValue placeholder="Status: Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="changes_requested">Requested Changes</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">Show</span>
          <Select value={String(limit)} onValueChange={(val) => handleParamChange({ limit: val, page: 1 })}>
            <SelectTrigger className="w-[80px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Link 
            href="/create-content/new"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 whitespace-nowrap active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-bold">New Article</span>
          </Link>
        </div>
      </div>

      {/* Content Table */}
      <DocumentTable 
        documents={documents}
        isLoading={isLoading}
        error={error}
        onDeleteDocument={(deletedId) => {
          setDocuments(prev => prev.filter(d => d._id !== deletedId));
          setTotal(prev => Math.max(0, prev - 1));
        }}
      />

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 text-zinc-500 dark:text-zinc-400 text-[10px] font-black px-2 uppercase tracking-widest">
          <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700">
            Showing <span className="text-zinc-900 dark:text-white">{startEntry}</span> to <span className="text-zinc-900 dark:text-white">{endEntry}</span> of <span className="text-zinc-900 dark:text-white">{total}</span> entries
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleParamChange({ page: page - 1 })}
              className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-30 shadow-sm active:scale-95 group" 
              disabled={page <= 1}
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Previous</span>
            </button>
            <div className="flex items-center px-4 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold">
              Page {page} of {totalPages}
            </div>
            <button 
              onClick={() => handleParamChange({ page: page + 1 })}
              className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-30 shadow-sm active:scale-95 group" 
              disabled={page >= totalPages}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentLibraryPage() {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        }>
          <ContentLibraryContent />
        </Suspense>
        <Footer />
      </main>
    </div>
  );
}



