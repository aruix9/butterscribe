import { Search, Filter, Download, FileText, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const documents = [
  {
    title: "Technical SEO Strategy 2024",
    wordCount: "2,450",
    approver: {
      name: "Sarah Jenkins",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHAFMTPzLz5kOOIPydKhjsJoTG9BN1hw0YpGdPIu2j90xBedeO0VEWnnhwpo0h9DQ-DdI17_PFa5lAoA3x8zby3z7WHacr4F-RD1CPfP6zgNfhzrgLpWAzDMw1W0tvMobAFPnVoibhWLdbIdkXfrJJqGln6AtDtqFEIAtyTohOEPEQV127Bp-phps2_eT4NFRAmY9q29Lz-5VrtZ6AMmnVd01_qlWc11sF8yKER2XKCOYcWyI5sGYH-kzmvfJ5UKpuuxbeFYI8Aw"
    },
    date: "Oct 12, 2023",
    status: "Published",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100 bubble-emerald-600"
  },
  {
    title: "Cloud Architecture Guide",
    wordCount: "5,120",
    approver: {
      name: "Marcus Chen",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA14S5yekg_i5Zxt8VT_nYODSkydWdbPeX_pVcR7LexBYZ_zhFvNBmAd9CIowb9vLzRsIRsmQroYDFfIlYhPnUZ2p3E5rk-h65Aao8J9Olt6JyO6xrh9BEc3Gzm7eQRx4JrOaCfBNz3d3e1qMxoXa9sccEPSgHKdmYy-hMKKOmgmZnwAU4uUFlSz9nQqtNaume8FUC-hBNQO9rXN-j2M3lSGWJQaZzGQN8wYk27jm4d8Ome8qWTYynUGqHwcUuOQg021QJMHtG94g"
    },
    date: "Oct 11, 2023",
    status: "In Review",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100 bubble-amber-600"
  },
  {
    title: "Product Launch Script",
    wordCount: "850",
    approver: {
      name: "Alisha Reed",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7XeApS0a89alv5U8I-dvCm6lK8LdoQt4QPfhgzdWsvfVKnGVqpfz5_Fn5M3VTyqLUD5ONkq1JEJt-HfUAC2npj2V5xhlGol0PQiTzuwF_WSyEwQMNcu01u_QitgSc3EX5A7HFH_PVx3sEjr54pNnDkX52XC_3_KMFhSX88thbeGirdIXetuCvHjOISeSdY7eyDjO60BFELsl_i2kg58dUd4U7hi5WQiclHx6YLJeYiQVUYgdASnt1VomqyX9oE7vdCzC7BtKWDw"
    },
    date: "Oct 10, 2023",
    status: "Published",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100 bubble-emerald-600"
  }
];

export function ContentTable() {
  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm mt-8">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Previously Written Content</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input 
              className="w-full sm:w-64 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-zinc-900 dark:text-white" 
              placeholder="Search content..." 
              type="text"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          </div>
          <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-6 py-3">Document</th>
              <th className="px-6 py-3">Approver</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-800">
            {documents.map((doc, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <a className="font-semibold text-zinc-900 dark:text-white hover:text-primary transition-colors" href="#">{doc.title}</a>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Word count: {doc.wordCount}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-white dark:border-zinc-700 shadow-sm overflow-hidden relative">
                      <Image 
                        src={doc.approver.avatar}
                        alt={doc.approver.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{doc.approver.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{doc.date}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 w-fit",
                    doc.status === 'Published' 
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900" 
                      : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      doc.status === 'Published' ? "bg-emerald-600" : "bg-amber-600"
                    )}></span>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-sans">
        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          Showing <span className="text-zinc-900 dark:text-zinc-100 font-semibold">1-3</span> of <span className="text-zinc-900 dark:text-zinc-100 font-semibold">128</span> documents
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1" disabled>
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <button className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
