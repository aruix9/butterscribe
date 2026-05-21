import { Eye, TrendingUp, Key, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Impressions",
    value: "142,800",
    change: "12.5% vs last month",
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50",
    trending: true
  },
  {
    label: "SEO Score",
    value: "92/100",
    progress: 92,
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    label: "Keywords",
    value: "1,240",
    change: "Top 5% of niche average",
    icon: Key,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    label: "AI Output",
    value: "2.4M",
    change: "Tokens processed",
    icon: Terminal,
    color: "text-blue-600",
    bg: "bg-blue-50"
  }
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg flex flex-col justify-between group hover:border-primary/50 hover:shadow-md transition-all h-full"
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{stat.label}</span>
            <div className={cn("w-8 h-8 rounded flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors", stat.bg, stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{stat.value}</div>
            
            {stat.progress ? (
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            ) : (
              <div className={cn(
                "flex items-center gap-1 text-xs mt-1",
                stat.trending ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-zinc-500 dark:text-zinc-400"
              )}>
                {stat.trending && <TrendingUp className="w-3 h-3" />}
                <span>{stat.change}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
