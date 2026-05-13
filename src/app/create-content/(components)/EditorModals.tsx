'use client';

import { Editor } from "@tiptap/react";
import { Image as ImageIcon, Sparkles, Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import { RefObject, useState } from "react";
import ReactMarkdown from "react-markdown";

interface AiGeneration {
  title: string;
  prompt: string;
  response: string;
  createdAt: string;
}

interface EditorModalsProps {
  editor: Editor | null;
  linkModal: { isOpen: boolean; url: string };
  setLinkModal: (modal: { isOpen: boolean; url: string }) => void;
  imageModal: { isOpen: boolean; url: string };
  setImageModal: (modal: { isOpen: boolean; url: string }) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  aiGhostwriterModal: { isOpen: boolean };
  setAiGhostwriterModal: (modal: { isOpen: boolean }) => void;
  aiGeneration: AiGeneration | null;
}

export function EditorModals({
  editor,
  linkModal,
  setLinkModal,
  imageModal,
  setImageModal,
  fileInputRef,
  aiGhostwriterModal,
  setAiGhostwriterModal,
  aiGeneration,
}: EditorModalsProps) {
  const [copied, setCopied] = useState(false);

  return (
    <>
      {/* Link Modal */}
      {linkModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Edit Link</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Enter the URL for the selected text.</p>
              <input 
                autoFocus
                type="text" 
                value={linkModal.url}
                onChange={(e) => setLinkModal({ ...linkModal, url: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (linkModal.url) editor?.chain().focus().setLink({ href: linkModal.url }).run();
                    else editor?.chain().focus().unsetLink().run();
                    setLinkModal({ isOpen: false, url: '' });
                  }
                  if (e.key === 'Escape') setLinkModal({ isOpen: false, url: '' });
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none mb-6"
                placeholder="https://example.com"
              />
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setLinkModal({ isOpen: false, url: '' })}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-tight text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >Cancel</button>
                <button 
                  onClick={() => {
                    if (linkModal.url) editor?.chain().focus().setLink({ href: linkModal.url }).run();
                    else editor?.chain().focus().unsetLink().run();
                    setLinkModal({ isOpen: false, url: '' });
                  }}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-tight text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                >Save Link</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Insert Image</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Upload from local or paste a URL.</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Image URL</label>
                  <input 
                    type="text" 
                    value={imageModal.url}
                    onChange={(e) => setImageModal({ ...imageModal, url: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100 dark:border-zinc-800"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-zinc-400 bg-white dark:bg-zinc-900 px-2">Or</div>
                </div>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                >
                  <ImageIcon className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Choose local file</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (readerEvent) => {
                        const content = readerEvent.target?.result as string;
                        editor?.chain().focus().setImage({ src: content }).run();
                        setImageModal({ isOpen: false, url: '' });
                        toast.success("Image uploaded successfully!");
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setImageModal({ isOpen: false, url: '' })}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-tight text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >Cancel</button>
                <button 
                  disabled={!imageModal.url}
                  onClick={() => {
                    if (imageModal.url) {
                      editor?.chain().focus().setImage({ src: imageModal.url }).run();
                      setImageModal({ isOpen: false, url: '' });
                    }
                  }}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-tight text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-lg shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                >Insert</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Ghostwriter Modal */}
      {aiGhostwriterModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Ghostwriter Strategy</h3>
                  {aiGeneration?.prompt && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Based on: <span className="font-medium text-zinc-700 dark:text-zinc-300">{aiGeneration.prompt}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAiGhostwriterModal({ isOpen: false })}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!aiGeneration ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <Sparkles className="w-8 h-8 text-zinc-300" />
                  <p className="text-sm text-zinc-400 text-center">No AI strategy linked to this document.<br/>Generate one from the dashboard.</p>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-h2:text-zinc-900 dark:prose-h2:text-zinc-100">
                  <ReactMarkdown>{aiGeneration.response}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
