'use client';

import { Editor } from "@tiptap/react";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { RefObject } from "react";

interface EditorModalsProps {
  editor: Editor | null;
  linkModal: { isOpen: boolean; url: string };
  setLinkModal: (modal: { isOpen: boolean; url: string }) => void;
  imageModal: { isOpen: boolean; url: string };
  setImageModal: (modal: { isOpen: boolean; url: string }) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function EditorModals({
  editor,
  linkModal,
  setLinkModal,
  imageModal,
  setImageModal,
  fileInputRef
}: EditorModalsProps) {
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
    </>
  );
}
