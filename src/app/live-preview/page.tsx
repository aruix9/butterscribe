'use client';

import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Edit, 
  CheckCircle,
  ChevronRight,
  MessageSquare,
  MoreVertical
} from "lucide-react";

export default function LivePreviewPage() {
  const { theme } = useLayoutStore();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-zinc-900 dark:text-white tracking-tighter flex items-center gap-2">
            Butterscribe
          </div>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700"></div>
          <Link href="/create-content" className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-4 hidden sm:flex">
            <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden relative">
              <Image 
                fill
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChdDyNlsTwijRrQBsRUTqaIRov7JarEE2u3XXqCVr7v12wNeZEIO3iv8KwBU6I41J-Y14eYg6sEeHcCGA8cisoXslBwO7onmT3jcm93olS2GD9qZJCGOoVkOtPDdOdT9X5fJKXPrwqDuBn4LVzM7nl8NmVGZ0QJUQOERmgcOc5dxXOsMLspBuR9-xt3onsAX1mkX2iwmgqlH7vZx0MoP0wwq6kJgcoOJ1FHN7_ZNvpJXFJiy2yDPMiKNa0EoORRdARVxbsogtQ1g"
                alt="User profile"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">Sarah Jenkins</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">Author</span>
            </div>
          </div>
          
          <button className="px-4 py-2 border border-red-500 text-red-600 dark:text-red-400 font-bold text-sm rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Request Changes</span>
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Approve</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
        
        {/* Left Sidebar: Table of Contents */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">Table of Contents</h4>
            <nav className="flex flex-col gap-3 relative border-l border-zinc-200 dark:border-zinc-800 ml-2">
              <a href="#" className="pl-4 py-1 text-sm text-blue-600 dark:text-blue-400 font-medium relative hover:underline">
                <div className="absolute -left-[1.5px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                Introduction to CWV
              </a>
              <a href="#" className="pl-4 py-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">
                LCP Optimization
              </a>
              <a href="#" className="pl-4 py-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">
                FID to INP Transition
              </a>
              <a href="#" className="pl-4 py-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">
                CLS Reduction Strategies
              </a>
              <a href="#" className="pl-4 py-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">
                Measuring Tools
              </a>
            </nav>
          </div>
        </aside>

        {/* Center Content Canvas */}
        <div className="flex-1 max-w-3xl w-full mx-auto">
          <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:tracking-tight">
            
            <div className="mb-12 relative">
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight mb-6 font-serif">
                Core Web Vitals Guide 2025: Optimization Strategies
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Understanding the latest shifts in Google's page experience signals and how to structure your front-end for maximum performance.
              </p>
            </div>
            
            <div className="relative group">
              <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed mb-6">
                As we move further into 2025, the landscape of technical SEO continues to refine its focus on 
                <span className="bg-yellow-100/80 dark:bg-yellow-900/40 border-b-2 border-yellow-300 dark:border-yellow-600 pb-0.5 mx-1 cursor-pointer">
                  user experience
                </span>. 
                The Core Web Vitals (CWV) metrics—initially introduced to quantify the essential facets of a healthy website—have evolved. Notably, the transition from First Input Delay (FID) to Interaction to Next Paint (INP) marks a significant shift toward measuring full-page-lifecycle responsiveness.
              </p>
            </div>
            
            <figure className="my-10 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
              <div className="relative w-full h-[400px]">
                <Image 
                  fill
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFvshdx-jMUZ_02lQCDvN1VOvqJzx1_ek9Ii7H-u8ghpx3y31uMqrVmZ90f0APJVt6waIqh6Yt98W6c-FXSqGguTFdhCcQvRD77NapJlA5CZQbjHOmZIaRgGMqD_PvG1zzxSLYBH9sM1TCj5ceSiBtO3xpJ2K9R8iNS4e8_qB78hVubSey2DO7six8nBw-hXQoApciYfc4HtYN5LoqEJ4ee7IGItloFQQG7qLfB41ChUhbH8dfS-2GUc51t34WvKG-VhY8IZHyRw"
                  alt="Data visualization dashboard"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                Monitoring real-time performance metrics in the Nexus Dashboard.
              </figcaption>
            </figure>
            
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6 font-serif">
              The INP Paradigm Shift
            </h2>
            
            <div className="relative group">
              <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed mb-6">
                Unlike FID, which only captured the delay of the first interaction, INP considers the latency of all interactions throughout a user's visit. This requires a 
                <span className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 relative cursor-pointer px-1 rounded mx-1">
                  more holistic approach to JavaScript execution
                  <button className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg shadow-xl p-2 items-center justify-center hover:scale-105 transition-all z-20 hidden group-hover:flex">
                    <MessageSquare className="w-4 h-4" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 dark:bg-white rotate-45"></div>
                  </button>
                </span> 
                and main-thread management.
              </p>
            </div>
            
            <ul className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-3 mb-10 list-disc pl-6 marker:text-zinc-400">
              <li><strong className="text-zinc-900 dark:text-white">Yielding to the Main Thread:</strong> Break up long tasks to allow the browser to respond to user input.</li>
              <li><strong className="text-zinc-900 dark:text-white">Optimizing DOM Complexity:</strong> Deep DOM trees increase the cost of style recalculations and layout.</li>
              <li><strong className="text-zinc-900 dark:text-white">Efficient Event Listeners:</strong> Debounce or throttle frequent events like scroll and resize.</li>
            </ul>
          </article>
        </div>

        {/* Right Sidebar: Insights & Comments */}
        <aside className="hidden xl:block w-80 shrink-0 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Content Stats Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden group">
              <button className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-none text-left focus:outline-none">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Content Stats</h4>
                <ChevronRight className="w-5 h-5 text-zinc-400 group-focus-within:rotate-90 transition-transform" />
              </button>
              
              <div className="p-5 pt-0 block">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Words</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">1,245</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Read Time</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">8m</span>
                  </div>
                </div>
                
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4"></div>
                
                <ul className="space-y-3">
                  <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">H1 Tags</span>
                    <span className="text-xs font-bold bg-white dark:bg-zinc-700 px-2.5 py-1 rounded shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-600">1</span>
                  </li>
                  <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">H2 Tags</span>
                    <span className="text-xs font-bold bg-white dark:bg-zinc-700 px-2.5 py-1 rounded shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-600">4</span>
                  </li>
                  <li className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Internal Links</span>
                    <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded shadow-sm">12</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Inline Comments Section */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden group">
              <button className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-none text-left focus:outline-none">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Inline Comments</h4>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400 group-focus-within:rotate-90 transition-transform" />
              </button>
              
              <div className="p-5 pt-0 block">
                <div className="space-y-4">
                  {/* Comment 1 */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 relative">
                    <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-yellow-400 dark:bg-yellow-600 rounded-r-md"></div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300">MR</div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Marcus Reed</span>
                      </div>
                      <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">2h</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Should we expand slightly on how UX specifically ties to retention in this context?
                    </p>
                    <div className="mt-3 pt-3 border-t border-yellow-100 dark:border-yellow-900/30 flex gap-3">
                      <button className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Resolve</button>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline transition-colors">Reply</button>
                    </div>
                  </div>

                  {/* Comment 2 */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 relative">
                    <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-blue-400 dark:bg-blue-600 rounded-r-md"></div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-[10px] font-bold text-purple-700 dark:text-purple-300">SL</div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Sarah Lin</span>
                      </div>
                      <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">45m</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Great phrasing. Might be worth dropping a link to the web.dev article on JS execution here.
                    </p>
                    <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-900/30 flex gap-3">
                      <button className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Resolve</button>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </aside>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0 mt-auto">
        <span className="font-bold text-zinc-900 dark:text-white">Butterscribe</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">© 2024 Butterscribe. All rights reserved.</span>
      </footer>
    </div>
  );
}
