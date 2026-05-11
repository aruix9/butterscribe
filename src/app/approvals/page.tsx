'use client';

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
  MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const documents = [
  {
    title: "Q3 Marketing Playbook Strategy",
    description: "Comprehensive guide covering all digital touchpoints for the upcoming quarter...",
    author: {
      name: "Sarah J.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXfjfZ103lrJF8iQYiJ37W3I0YKOmUKfxjhhuPitcrfAHmvQcVRj9HATI0Fb28mrFLx3_FoZ5dNDX0HIE_NhoRAXqZkQfRKjp-ATR6ep_15c4GSoBsboE4tNyljnmey1WhfbUAHJ1wNpIFGSq-JBsXNklN9Xnqv5azDvYM2aYuGx5kL0vxO6sGlYzftq3fUckPpYhQbiZRTCtEwjGcyozxN2rZFLfqi7sgbWVRFO0ZkbWalZGxUWDEKMfwqX2zHoIFRKsZDdm91g"
    },
    status: "Pending Approval",
    statusColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    seoScore: 92,
    lastEdited: "Today, 10:42 AM",
    type: "article"
  },
  {
    title: "Product Launch Teaser Script",
    description: "Draft script for the 30-second social media teaser video...",
    author: {
      name: "Michael C.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD89LsbsDXoH5JN31PKycX2q1dRZHWlQNSC70hP_QH7E7Lm1P-DN3BPkvSySzDtINdrRuJymmptLAwz4wMyqtyMuo2SkReYjQccVhgf7kYIiU4EF7wsOK3ZaUgWzIguw4dgHqsIktH3rPOEcUBx1_2OdSCkPzIPt456viInZwXCHswuLJzNTDhCpMI-VzUGFPMpHFEHuVREDDgGSqSuoLDCK7dtD-Na4_03aw8cVhCpRx9wmfv_dBqchYsBkuVJbc_PgY98Gyx8eA"
    },
    status: "In Review",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    seoScore: 74,
    lastEdited: "Yesterday, 4:15 PM",
    type: "video"
  },
  {
    title: "SEO Keyword Cluster Analysis - Q4",
    description: "AI generated list of primary and secondary keywords for the winter campaign.",
    author: {
      name: "System",
      avatar: null
    },
    status: "Waiting for Feedback",
    statusColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    seoScore: null,
    lastEdited: "Oct 24, 2023",
    type: "ai"
  },
  {
    title: "Customer Success Story: Acme Corp",
    description: "Interview notes and initial outline for the upcoming case study...",
    author: {
      name: "Elena R.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ER46BGpyPmL5o4qGZW6zwGPRd8TuTS0Y0stBgiAEpzE4UkjW0nD-9oMy79fz6oEZ_xyFeqGo-eJ-F1eAa3VLUtBwTsu7r2L7KYgxaQePQz4yFjHfpGhT3M9QGtGnOt7tSJxXfaED6O6zQsULaSSEVsiGI_F6xd4KckU2ec2SNm7Xe_jRKgdm2iwp4Wf90z0669hTk_v2CwLIFuXYqcteauvzTzcX1CiCo_xZUzaAVcalXCkvXhVROK8SyvbWKlTg7CMVv3lEag"
    },
    status: "Revision Needed",
    statusColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    seoScore: 45,
    lastEdited: "Oct 20, 2023",
    type: "draft"
  }
];

export default function ApprovalsPage() {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="p-8 max-w-[1440px] mx-auto w-full flex-1 text-sans">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">Approvals</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Review and manage content that requires your approval.</p>
          </div>

          {/* Action & Filter Zone */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold">Priority: All</span>
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input 
                  className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary w-64 transition-all text-sm" 
                  placeholder="Search approvals..." 
                  type="text"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">Quick Filter:</span>
              <button className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-tight text-zinc-600 dark:text-zinc-400 hover:border-primary transition-all">Today</button>
              <button className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-tight text-zinc-600 dark:text-zinc-400 hover:border-primary transition-all">This Week</button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    <th className="p-4 pl-6 font-medium whitespace-nowrap">Content</th>
                    <th className="p-4 font-medium whitespace-nowrap">Author</th>
                    <th className="p-4 font-medium whitespace-nowrap">Status</th>
                    <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {documents.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded mt-1 shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                            doc.type === "article" && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                            doc.type === "video" && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                          )}>
                            {doc.type === "article" && <FileText className="w-5 h-5" />}
                            {doc.type === "video" && <Video className="w-5 h-5" />}
                            {doc.type === "ai" && <Sparkles className="w-5 h-5" />}
                            {doc.type === "draft" && <FileText className="w-5 h-5" />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1 truncate">{doc.title}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{doc.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative shrink-0">
                            {doc.author.avatar ? (
                              <Image 
                                fill 
                                src={doc.author.avatar} 
                                alt={doc.author.name} 
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-600">AI</div>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{doc.author.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                          doc.statusColor
                        )}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href="/live-preview" 
                            target="_blank"
                            className="p-2 text-zinc-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Live Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                            title="Request Changes"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-zinc-500 dark:text-zinc-400 text-xs font-bold px-2 uppercase tracking-wide">
            <span>Showing 1 to 4 of 24 approvals</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm" disabled>Previous</button>
              <button className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">Next</button>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
