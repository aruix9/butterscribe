'use client';

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import {TextStyle} from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useEditorStore } from '@/modules/editor/store/editorStore';
import { 
  Sparkles,
  CheckCircle,
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/store/layoutStore";
import { DocumentOutline } from "../(components)/DocumentOutline";
import { Toolbar } from "../(components)/Toolbar";
import { ReviewSidebar } from "../(components)/ReviewSidebar";
import { EditorModals } from "../(components)/EditorModals";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function CreateContentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const aiGenerationId = searchParams.get('aiGenerationId');

  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const { isSidebarCollapsed } = useLayoutStore();
  const { content, setContent } = useEditorStore();
  const [headings, setHeadings] = useState<{ text: string; level: number; pos: number }[]>([]);
  const [linkModal, setLinkModal] = useState({ isOpen: false, url: '' });
  const [imageModal, setImageModal] = useState({ isOpen: false, url: '' });
  const [aiGhostwriterModal, setAiGhostwriterModal] = useState({ isOpen: false });
  const [aiGeneration, setAiGeneration] = useState<{ title: string; prompt: string; response: string; createdAt: string } | null>(null);
  const [title, setTitle] = useState("New Document");
  const [documentId, setDocumentId] = useState<string | null>(id !== "new" ? id : null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("draft");
  const lastSavedContent = useRef<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-zinc-200 dark:border-zinc-800 my-8 w-full max-w-4xl mx-auto',
        },
      }),
    ],
    content: content || '<p>Start writing...</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      
      // Extract headings
      const extractedHeadings: { text: string; level: number; pos: number }[] = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          extractedHeadings.push({
            text: node.textContent,
            level: node.attrs.level,
            pos: pos,
          });
        }
      });
      setHeadings(extractedHeadings);
    },
    editorProps: {
      handlePaste: () => {
        const allowPaste = process.env.NEXT_PUBLIC_ALLOW_PASTE === 'true';
        if (allowPaste) return false; // Let default paste handle it

        toast.error("Pasting is not allowed inside the editor. Please type your content manually.", {
          description: "This is a security measure to ensure content authenticity.",
          duration: 4000,
        });
        return true;
      },
      attributes: {
        class: 'space-y-6 text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed focus:outline-none min-h-[400px]',
      },
    },
  });

  // Load document if id is provided
  useEffect(() => {
    if (id && id !== "new") {
      const fetchDoc = async () => {
        try {
          const res = await fetch(`/api/documents/${id}`);
          if (res.ok) {
            const data = await res.json();
            setTitle(data.title);
            setContent(data.body);
            setStatus(data.status);
            lastSavedContent.current = data.body;
            // Set linked AI generation if present
            if (data.aiGeneration) setAiGeneration(data.aiGeneration);
            if (editor) {
              editor.commands.setContent(data.body);
              if (data.status === 'approved') {
                editor.setEditable(false);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch document", err);
        }
      };
      fetchDoc();
    }
  }, [id, editor, setContent]);

  useEffect(() => {
    if (editor && status === 'approved') {
      editor.setEditable(false);
    }
  }, [editor, status]);

  const handleSave = useCallback(async (showToast = true) => {
    if (!editor || status === 'approved') return;
    const currentContent = editor.getHTML();
    setIsSaving(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: documentId,
          title,
          body: currentContent,
          status: status,
          ...(aiGenerationId ? { aiGenerationId } : {}),
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      const data = await response.json();
      if (!documentId) {
        setDocumentId(data._id);
        router.replace(`/create-content/${data._id}`);
      }
      lastSavedContent.current = currentContent;
      setLastSaved(new Date());
      if (showToast) toast.success('Document saved successfully');
    } catch (error) {
      console.error(error);
      if (showToast) toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  }, [documentId, title, router, editor, status, aiGenerationId]);

  // Autosave effect
  useEffect(() => {
    if (status === 'approved') return;
    const interval = Number(process.env.NEXT_PUBLIC_AUTOSAVE_INTERVAL) || 30000;
    const timer = setInterval(() => {
      // @ts-ignore
      const currentContent = editor?.getHTML();
      if (currentContent && currentContent !== '<p></p>' && currentContent !== lastSavedContent.current) {
        handleSave(false);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [handleSave, editor, status]);

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

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
          {isOutlineOpen && <DocumentOutline headings={headings} editor={editor} />}

          {/* Editor Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 relative">
            <Toolbar 
              editor={editor}
              documentId={documentId}
              isOutlineOpen={isOutlineOpen}
              setIsOutlineOpen={setIsOutlineOpen}
              isReviewMode={isReviewMode}
              setIsReviewMode={setIsReviewMode}
              setLinkModal={setLinkModal}
              setImageModal={setImageModal}
              handleSave={() => handleSave(true)}
              isSaving={isSaving}
            />

            <div className="flex-1 overflow-y-auto p-8 lg:p-16 max-w-4xl mx-auto w-full relative">
              {status === 'approved' && (
                <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">Approved Document</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">This document is approved and is now read-only. Request changes in live preview to edit again.</p>
                  </div>
                </div>
              )}
              {status === 'changes_requested' && (
                <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3">
                  <Edit className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm font-bold text-red-900 dark:text-red-100 uppercase tracking-tight">Changes Requested</p>
                    <p className="text-xs text-red-600 dark:text-red-400">Feedback has been provided. Please review the live preview and update the content.</p>
                  </div>
                </div>
              )}
              <h1 
                className={cn(
                  "text-5xl font-bold mb-8 outline-none",
                  status === 'approved' ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-900 dark:text-white"
                )} 
                contentEditable={status !== 'approved'}
                suppressContentEditableWarning={true}
                onBlur={(e) => setTitle(e.currentTarget.textContent || "")}
              >
                {title}
              </h1>
              
              {!isReviewMode ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="space-y-6 text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed outline-none">
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
                  
                  <div className="border-l-4 border-primary pl-6 py-2 bg-blue-50/30 dark:bg-blue-900/10">
                    <p>
                      As we look toward the next decade, the primary differentiator for high-performance AI will not be the scale of its training data, but the elegance of its <span className="text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 rounded px-1">contextual awareness and its ability to predict user intent before it is explicitly stated through prompt engineering and adaptive interfaces.</span>
                    </p>
                  </div>
                  
                  <p>
                    Generative AI tools are moving beyond simple text completion. We are entering an era of "Structural Intelligence," where the AI understands the architectural requirements of different content types—from technical documentation to creative storytelling.
                  </p>
                  
                  <p>
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
              )}
            </div>

            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <button
                onClick={() => setAiGhostwriterModal({ isOpen: true })}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-full px-6 py-3 flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 group"
              >
                <Sparkles className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white font-sans">Ask AI Ghostwriter</span>
                {aiGeneration && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Right Sidebar - Conditional Suite */}
          <ReviewSidebar isReviewMode={isReviewMode} />
        </div>

        <Footer />
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <div className={cn(
            "w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]",
            isSaving ? "bg-amber-500" : "bg-green-500"
          )}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {isSaving ? "Saving..." : lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : "Autosaved"}
          </span>
        </div>

        <EditorModals 
          editor={editor}
          linkModal={linkModal}
          setLinkModal={setLinkModal}
          imageModal={imageModal}
          setImageModal={setImageModal}
          fileInputRef={fileInputRef}
          aiGhostwriterModal={aiGhostwriterModal}
          setAiGhostwriterModal={setAiGhostwriterModal}
          aiGeneration={aiGeneration}
        />
      </main>
    </div>
  );
}
