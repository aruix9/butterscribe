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
import { TextStyle } from '@tiptap/extension-text-style';
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
import { highlightCommentedSelections } from "@/utils/highlightComments";

export default function CreateContentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || "new";
  const aiGenerationId = searchParams?.get('aiGenerationId');

  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const { isSidebarCollapsed } = useLayoutStore();
  const { content, setContent } = useEditorStore();
  const [headings, setHeadings] = useState<{ text: string; level: number; pos: number }[]>([]);
  const [linkModal, setLinkModal] = useState({ isOpen: false, url: '' });
  const [imageModal, setImageModal] = useState({ isOpen: false, url: '' });
  const [aiGeneration, setAiGeneration] = useState<{ title: string; prompt: string; response: string; createdAt: string } | null>(null);
  const [title, setTitle] = useState("New Document");
  const [documentId, setDocumentId] = useState<string | null>(id !== "new" ? id : null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("draft");
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

  const [comments, setComments] = useState<any[]>([]);

  const fetchComments = useCallback(async () => {
    if (!documentId && id === "new") return;
    const docIdToFetch = documentId || id;
    try {
      const res = await fetch(`/api/comments?documentId=${docIdToFetch}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  }, [documentId, id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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
            // If status is changes_requested, automatically open Review Mode
            if (data.status === 'changes_requested') {
              setIsReviewMode(true);
            }
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
      if (showToast) toast.success('Document saved successfully');
    } catch (error) {
      console.error(error);
      if (showToast) toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  }, [documentId, title, router, editor, status, aiGenerationId]);

  useEffect(() => {
    if (editor && content) {
      const openComments = comments.filter(c => !c.isResolved);
      if (isReviewMode && openComments.length > 0) {
        const highlighted = highlightCommentedSelections(content, comments);
        if (editor.getHTML() !== highlighted) {
          editor.commands.setContent(highlighted);
        }
      } else {
        const cleanContent = content.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '$1');
        if (editor.getHTML() !== cleanContent) {
          editor.commands.setContent(cleanContent);
        }
      }
    }
  }, [content, editor, isReviewMode, comments]);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
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
          status={status}
          title={title}
        />
        <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-12rem)]">
          {/* Document Outline Sidebar */}
          {isOutlineOpen && <DocumentOutline headings={headings} editor={editor} />}

          {/* Editor Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 relative">
            <div className="flex-1 overflow-y-auto p-8 mx-auto w-full relative">
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
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3">
                  <Edit className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm text-red-900 dark:text-red-100 tracking-tight"><strong className="uppercase">Changes Requested:</strong> Feedback has been provided. Please review the live preview and update the content.</p>
                  </div>
                </div>
              )}
              <h1
                className={cn(
                  "text-3xl font-bold mb-8 outline-none",
                  status === 'approved' ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-900 dark:text-white"
                )}
                contentEditable={status !== 'approved'}
                suppressContentEditableWarning={true}
                onBlur={(e) => setTitle(e.currentTarget.textContent || "")}
              >
                {title}
              </h1>

              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Right Sidebar - Conditional Review & Optimization Suite */}
          <ReviewSidebar
            isReviewMode={isReviewMode}
            comments={comments}
            onRefreshComments={fetchComments}
            documentId={documentId || id}
            aiGeneration={aiGeneration}
            editor={editor}
            title={title}
          />
        </div>

        <Footer />

        <EditorModals
          editor={editor}
          linkModal={linkModal}
          setLinkModal={setLinkModal}
          imageModal={imageModal}
          setImageModal={setImageModal}
          fileInputRef={fileInputRef}
        />
      </main>
    </div>
  );
}
