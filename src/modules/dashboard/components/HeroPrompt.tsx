"use client";

import { useState } from "react";
import { Wand2, Zap, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function HeroPrompt() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a content prompt");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/generate", { prompt });
      toast.success("AI strategy generated! Redirecting to editor...");
      router.push(`/create-content/${data.documentId}?aiGenerationId=${data.aiGenerationId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 overflow-hidden relative shadow-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Welcome back, Intelligence Engine</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Start a new project by defining your prompt and selecting an engine model.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Content Prompt</label>
            <div className="relative group">
              <input 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-3 pr-12 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-zinc-900 dark:text-white" 
                placeholder="e.g., Write a technical whitepaper on LLM optimization strategies..." 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <Wand2 className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary w-5 h-5 transition-colors" />
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="h-[52px] px-8 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer shadow-sm shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 fill-white" />
            )}
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </section>
  );
}
