'use client';

import { CheckCircle2 } from "lucide-react";

interface ReviewSidebarProps {
  isReviewMode: boolean;
}

export function ReviewSidebar({ isReviewMode }: ReviewSidebarProps) {
  return (
    <aside className="hidden xl:flex w-80 flex-shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-y-auto transition-colors">
      {isReviewMode ? (
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Review Comments</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Collaborate with your team</p>
            </div>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider">2 Open</span>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Comment 1 */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-blue-200 dark:border-blue-900/50 p-4 shadow-sm relative ring-1 ring-blue-100 dark:ring-blue-900/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 text-[10px] font-bold">JD</div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Jane Doe</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">2h ago</span>
              </div>
              <div className="border-l-2 border-yellow-400 pl-2 mb-3 bg-yellow-50/30 dark:bg-yellow-900/10 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 italic">
                "dynamic, generative environments"
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                Should we expand on what makes these environments dynamic? Maybe an example of real-time adaptation?
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Reply</button>
                <button className="text-[10px] font-bold text-zinc-400 hover:text-green-600 ml-auto uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resolve
                </button>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 text-[10px] font-bold">MK</div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Mark K.</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">Yesterday</span>
              </div>
              <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-2 mb-3 bg-zinc-50 dark:bg-zinc-800/50 py-1.5 text-xs text-zinc-500 dark:text-zinc-500 line-through italic">
                "static repositories"
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                I think we can just say "legacy databases" here to emphasize the shift.
              </p>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-zinc-900 dark:text-white">You</span>
                  <span className="text-[10px] text-zinc-400">12h ago</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Disagree, repositories sounds more appropriate for unstructured content.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Reply</button>
                <button className="text-[10px] font-bold text-zinc-400 hover:text-green-600 ml-auto uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Optimization Suite</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Real-time content analysis</p>
          
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">SEO Score</span>
              <span className="text-sm font-semibold text-primary">85/100</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 mb-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Good readability. Add more keywords.</p>
          </div>

          <h4 className="text-sm font-semibold text-zinc-900 dark:text-100 mb-3 tracking-wide uppercase text-[10px]">Keyword Density</h4>
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
