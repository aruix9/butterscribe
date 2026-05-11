'use client';

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreVertical,
  Clock
} from "lucide-react";
import Image from "next/image";

const calendarDays = [
  { day: 28, isCurrentMonth: false }, { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false }, { day: 31, isCurrentMonth: false },
  { day: 1, isCurrentMonth: true }, { day: 2, isCurrentMonth: true, isWeekend: true }, { day: 3, isCurrentMonth: true, isWeekend: true },
  { day: 4, isCurrentMonth: true }, 
  { 
    day: 5, 
    isCurrentMonth: true, 
    task: { 
      title: "Q4 Report Draft", 
      time: "Nov 5 - Nov 7", 
      color: "border-l-blue-600",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBChDU5u4btXsBq6MziIErTL2AKNp1HqoTUVmWcjBBB-6KwX4uGZn7gJicpFrLE4tTBbT3t3sXnbtO87hmdA6ZuPwGgIyZc-kDdazf9OjLRB5cCqfnAEnkBRt5a_I25XMhDhTnHwYoD6Szc0jjo3gloMUtBcMXp1Fm9GzldxTWyPQeWmhH7lrkTa1Dj_6RlbU05GxDAbgZkOAT-Wqqfec7FQOBOzUSeGXNQf18LbtgbGdgqAxZt87D5N1RO98Oyakg7a4zLNreSNw"
    } 
  },
  { day: 6, isCurrentMonth: true, inProgress: true },
  { day: 7, isCurrentMonth: true },
  { 
    day: 8, 
    isCurrentMonth: true, 
    task: { 
      title: "Social Campaign", 
      time: "Nov 8", 
      color: "border-l-emerald-500",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsTvmxL4RQ5L_ofklB6jp_H7CzPNwQkCxwfhs2RZ3FGmIdhCYNryCDF8i-m36eZdIq84CLww41OaAxmEeDvfcxvJixEaeM5OFt0LoFIxHmS3eOGM8wnv1ThJTJK_QA6In0TpUsDMccIzIqHSC8GKaOlrrgFOwEkPn4AVh05bKT8I_nk36VI8ohkZXGzHHqSM2qCbT9PMn6kJyWDodpL896uGcUiCrA_GM1wqy9qvG338SKz2bNG90pXIMjjx1mO4ZnNj7nuxpdTw"
    } 
  },
  { day: 9, isCurrentMonth: true, isWeekend: true }, { day: 10, isCurrentMonth: true, isWeekend: true },
  { day: 11, isCurrentMonth: true }, { day: 12, isCurrentMonth: true },
  { 
    day: 13, 
    isCurrentMonth: true, 
    task: { 
      title: "Product Release Notes", 
      time: "Nov 13 - Nov 14", 
      color: "border-l-amber-500",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeAY8MBAWdD1NR2hyBpZ-mpg5dxqRRospFMkEAg_BFPcvtP5IkvdGCKw0a1NLZoLoGJYLGMmQApXMcEJTZp041efwO54gS4ZVS2vW8S4V4yTjJdPgUBI1aR2-jpgj-4moS-Twz6NAHnd2OlNiW8AjoqOplyjea8QBRfEQMOikgmBzgmf28apEAgSp2L_a_wOo3NowdMZHcZY9fFtphc6pknQOTtmuO-j3UrMtl7WiPpzTD3fzh6LUgB2HfIHgSZFLOg-KhpVt2sg"
    } 
  },
  { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true },
  { day: 16, isCurrentMonth: true, isWeekend: true }, { day: 17, isCurrentMonth: true, isWeekend: true },
  { day: 18, isCurrentMonth: true },
  { 
    day: 19, 
    isCurrentMonth: true, 
    isToday: true,
    task: { 
      title: "AI Ethics Whitepaper", 
      time: "Nov 19 - Nov 22", 
      color: "border-l-blue-600",
      isHighlighted: true,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCib1aea_ewE1Srb3DvLM1hMFZWD34nsrpcoiMz1hOzH2LHDtjtquDx6Ov5sZEp7ytE9tSS_NJ5wpzjmunXbp2Iw4-DD2DdlNvH8fVhziVqIWhkCxE7SK6p6kYl-HD-395rXjf1gVHjn41li2fm8pVySJ_9oeAzNsbYb67lmqU9b4ukrRkRNlEmvq-O__h-1ZE4w9QJFq7uJ_Swzz-SU_Jil1_Tm2rOTo5WF_xiQ_Y4iyjMiDMHjhqjKim-3xhnVFbbl38sUYoIRw"
    } 
  },
  { day: 20, isCurrentMonth: true }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true },
  { day: 23, isCurrentMonth: true, isWeekend: true }, { day: 24, isCurrentMonth: true, isWeekend: true },
  { day: 25, isCurrentMonth: true }, { day: 26, isCurrentMonth: true }, { day: 27, isCurrentMonth: true }, { day: 28, isCurrentMonth: true }, { day: 29, isCurrentMonth: true },
  { day: 30, isCurrentMonth: true, isWeekend: true }, { day: 1, isCurrentMonth: false, isWeekend: true }
];

const unscheduledDrafts = [
  { type: "Blog Post", title: "Top 10 ML Frameworks in 2025", est: "3 Days", color: "border-l-purple-500" },
  { type: "Case Study", title: "Scaling Inference for Enterprise", est: "5 Days", color: "border-l-rose-500" },
  { type: "AI Generated", title: "Weekly Newsletter Template", est: "1 Day", color: "border-l-blue-600", isAI: true }
];

export default function ContentCalendarPage() {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16 h-screen overflow-hidden",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="flex-1 flex overflow-hidden">
          {/* Calendar Section */}
          <section className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950">
            {/* Header Area */}
            <div className="px-6 py-6 flex justify-between items-end flex-shrink-0">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">November 2024</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 mr-2">
                  <button className="px-4 py-1.5 rounded-md hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <button className="px-4 py-1.5 bg-white dark:bg-zinc-700 shadow-sm rounded-md text-sm font-bold text-zinc-900 dark:text-white">
                    Today
                  </button>
                  <button className="px-4 py-1.5 rounded-md hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="flex-1 flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 mx-6 mb-6 rounded-xl shadow-sm bg-zinc-50/50 dark:bg-zinc-900/50">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex-shrink-0">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div 
                    key={day} 
                    className={cn(
                      "p-3 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 text-center border-r border-zinc-200 dark:border-zinc-800 uppercase tracking-widest last:border-r-0",
                      i >= 5 && "bg-zinc-100/50 dark:bg-zinc-800/50"
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto no-scrollbar">
                {calendarDays.map((date, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "border-r border-b border-zinc-200 dark:border-zinc-800 p-3 min-h-[120px] flex flex-col transition-colors last:border-r-0 hover:bg-white dark:hover:bg-zinc-800/30",
                      !date.isCurrentMonth && "bg-zinc-50/30 dark:bg-zinc-900/30",
                      date.isWeekend && "bg-zinc-100/20 dark:bg-zinc-800/20",
                      date.isToday && "bg-blue-50/20 dark:bg-blue-900/10"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={cn(
                        "text-sm font-bold leading-none",
                        date.isCurrentMonth ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-600",
                        date.isToday && "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-1 rounded-md -ml-1 -mt-1"
                      )}>
                        {date.day}
                      </span>
                      {date.isToday && <span className="w-2 h-2 rounded-full bg-blue-600 shadow-sm shadow-blue-500/50"></span>}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      {date.inProgress && (
                        <div className="h-6 rounded bg-blue-100/40 dark:bg-blue-900/20 border border-dashed border-blue-300/50 dark:border-blue-700/50 flex items-center justify-center">
                          <span className="text-[9px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest opacity-80">In Progress</span>
                        </div>
                      )}

                      {date.task && (
                        <div className={cn(
                          "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 flex flex-col gap-1.5 border-l-4 shadow-sm cursor-pointer hover:shadow-md hover:translate-y-[-1px] transition-all group",
                          date.task.color,
                          date.task.isHighlighted && "ring-1 ring-blue-400/30 dark:ring-blue-500/30 border-blue-400/50 dark:border-blue-500/50"
                        )}>
                          <span className="text-[11px] font-bold leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-primary transition-colors">
                            {date.task.title}
                          </span>
                          <div className="flex justify-between items-center mt-auto pt-1 border-t border-zinc-50 dark:border-zinc-800/50">
                            <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-tight flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {date.task.time.split(' - ')[0]}
                            </span>
                            <div className="w-5 h-5 rounded-full overflow-hidden relative border-2 border-white dark:border-zinc-800 shadow-sm">
                              <Image 
                                fill 
                                src={date.task.avatar} 
                                alt="User" 
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Sidebar: Unscheduled Drafts */}
          <aside className="w-[320px] bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col flex-shrink-0 transition-colors">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Unscheduled Drafts</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Drag and drop to calendar</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {unscheduledDrafts.map((draft, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-grab border-l-4 group",
                    draft.color
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-tight",
                      draft.isAI 
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    )}>
                      {draft.type}
                    </span>
                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight group-hover:text-primary transition-colors">
                    {draft.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center font-bold uppercase tracking-wider">
                      <Plus className="w-3 h-3 mr-1" /> Est. {draft.est}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center shadow-lg shadow-primary/20 active:scale-[0.98] hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Draft
              </button>
            </div>
          </aside>
        </div>

        <Footer />
      </main>
    </div>
  );
}
