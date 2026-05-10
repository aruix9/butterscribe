'use client';

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useState } from "react";
import Image from "next/image";
import { 
  Dock, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sparkles,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/store/layoutStore";
import Link from "next/link";

export default function CreateContentPage() {
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-80px)] pb-16">
          {/* Document Outline Sidebar */}
          {isOutlineOpen && (
            <div className="w-72 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Document Outline</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    <span className="text-sm">Introduction</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 pl-4">
                    <span className="text-sm">The Evolution of AI</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                    <span className="text-sm">Core Methodologies</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 pl-4">
                    <span className="text-sm">Neural Networks</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 pl-4">
                    <span className="text-sm">Large Language Models</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                    <span className="text-sm">Future Predictions</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="relative w-full h-40 rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  <Image 
                    fill 
                    className="object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj5sioks0nv9AzRQ9XEXF59fHTryBNcvNu10dGvA5VmZGC6WLMYftYU91nJEj_vEfFj7HstwD7Sd598XP2oZ9eZarqEHPTRy66O9aGiZ_og_iT0wHzILIafNAUN2phMP7f3yEveGUcfFC-GtqWKS4UBFnpyfKG4-lOl6zvpqnReoKtmM1VexiJHNIZksNkX586nopgiWer8fD5P4sBN4ug7RNjvOFELpAGuLyscOKtQ51yAZhCtPB-mkgMx7i70gU-tvbHRWPmag" 
                    alt="Visualization"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Editor Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 relative">
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 p-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <button 
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 transition-colors" 
                  onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                  title="Toggle Outline"
                >
                  <Dock className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><Bold className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><Italic className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><Underline className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><List className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><ListOrdered className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><AlignLeft className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><AlignCenter className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400"><AlignRight className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center">
                <select className="bg-zinc-100 dark:bg-zinc-800 border-none rounded text-xs font-semibold py-1 px-3 focus:ring-0 cursor-pointer text-zinc-900 dark:text-zinc-100">
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Paragraph</option>
                </select>
              </div>

              <div className="flex items-center ml-auto pl-2 border-l border-zinc-200 dark:border-zinc-800 gap-3">
                <Link
                  href="/live-preview"
                  target="_blank"
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Live Preview
                </Link>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
                  isReviewMode 
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                )}>
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight hidden sm:inline">Review Mode</span>
                  <button 
                    onClick={() => setIsReviewMode(!isReviewMode)}
                    className={cn(
                      "relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none",
                      isReviewMode ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-700"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                        isReviewMode ? "translate-x-4" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <select className="bg-zinc-100 dark:bg-zinc-800 border-none rounded text-xs font-semibold py-1 px-3 focus:ring-0 cursor-pointer text-zinc-900 dark:text-zinc-100">
                  <option>ChatGPT</option>
                  <option>Perplexity</option>
                  <option>Gemini</option>
                  <option>Keywords</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:p-16 max-w-4xl mx-auto w-full">
              <h1 
                className="text-5xl font-bold text-zinc-900 dark:text-white mb-8 outline-none" 
                contentEditable="true"
                suppressContentEditableWarning={true}
              >
                The Future of Generative Ecosystems
              </h1>
              
              <div 
                className="space-y-6 text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed outline-none" 
              >
                {!isReviewMode ? (
                  <p contentEditable="true" suppressContentEditableWarning={true}>
                    In the rapidly evolving landscape of artificial intelligence, the concept of a "content ecosystem" has shifted from static repositories to dynamic, generative environments. These systems don't just store information; they synthesize, contextualize, and expand upon it in real-time.
                  </p>
                ) : (
                  <p>
                    In the rapidly evolving landscape of artificial intelligence, the concept of a "content ecosystem" has shifted from 
                    <span className="border-b-2 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 line-through cursor-pointer relative group mx-1">
                      static repositories
                      <span className="absolute -top-3 -right-3 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-green-700 dark:text-green-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">MK</span>
                    </span>
                    to 
                    <span className="bg-yellow-100/50 dark:bg-yellow-900/20 border-b-2 border-yellow-400 cursor-pointer relative group mx-1">
                      dynamic, generative environments
                      <span className="absolute -top-3 -right-3 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-blue-700 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">JD</span>
                    </span>
                    . These systems don't just store information; they synthesize, contextualize, and expand upon it in real-time.
                  </p>
                )}
                
                <div className="border-l-4 border-primary pl-6 py-2 bg-blue-50/30 dark:bg-blue-900/10">
                  <p contentEditable="true" suppressContentEditableWarning={true}>
                    As we look toward the next decade, the primary differentiator for high-performance AI will not be the scale of its training data, but the elegance of its <span className="text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 rounded px-1">contextual awareness and its ability to predict user intent before it is explicitly stated through prompt engineering and adaptive interfaces.</span>
                  </p>
                </div>
                
                <p contentEditable="true" suppressContentEditableWarning={true}>
                  Generative AI tools are moving beyond simple text completion. We are entering an era of "Structural Intelligence," where the AI understands the architectural requirements of different content types—from technical documentation to creative storytelling.
                </p>
                
                <p contentEditable="true" suppressContentEditableWarning={true}>
                  The integration of these tools into professional workflows requires a balance between automation and human oversight. <span className="text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 rounded px-1">This "Human-in-the-loop" model ensures that while the heavy lifting of synthesis is performed by the machine, the ultimate creative direction remains distinctly human.</span>
                </p>
                
                <div className="my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div className="relative w-full h-64">
                    <Image 
                      fill 
                      className="object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXMfvXf2ZkSB-6Xa8hu7tDc3oKljaMrHxgufbz2tWC4r3xkNbPu2ql14sq905lBjO_ki-rEiZWvl63xT5_MPG3a6SR9c01e8hsuN6v7lZwz9ce0azqwSeeRBRS9HxDK8NQQEmnCz1VLMv3GQQmedRCUlB5cXrR24_gzl8hfn4Go5wbaj0a92uNAw0j4gczG5wyemqLK8qVz7mV9t4TUR45meQAhLtNVPgK3USmAkkI6z7lyjSYR30_FLRZWJou4A-OEp7kVpabrg" 
                      alt="Digital Intelligence"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-500 dark:text-zinc-400 italic font-mono">
                    Fig 1: The intersection of physical environments and digital intelligence.
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <button className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-full px-6 py-3 flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 group">
                <Sparkles className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white font-sans">Ask AI Ghostwriter</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar - Conditional Suite */}
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

                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 tracking-wide uppercase text-[10px]">Keyword Density</h4>
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
        </div>

        <Footer />
      </main>
    </div>
  );
}
