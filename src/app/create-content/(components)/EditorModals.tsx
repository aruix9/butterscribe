'use client';

import { Editor } from "@tiptap/react";
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
  fileInputRef,
}: EditorModalsProps) {
  return (
    <>
      {/* Insert Link Modal */}
      {linkModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Insert Link</h3>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkModal.url}
              onChange={(e) => setLinkModal({ ...linkModal, url: e.target.value })}
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm mb-6 outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLinkModal({ isOpen: false, url: '' })}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 uppercase tracking-tight"
              >Cancel</button>
              <button
                onClick={() => {
                  if (linkModal.url) {
                    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkModal.url }).run();
                  } else {
                    editor?.chain().focus().unsetLink().run();
                  }
                  setLinkModal({ isOpen: false, url: '' });
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl shadow-sm hover:opacity-90 uppercase tracking-tight"
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Image Modal */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Insert Image</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-2 block">Upload Local Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          editor?.chain().focus().setImage({ src: reader.result }).run();
                          setImageModal({ isOpen: false, url: '' });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
              </div>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Or</span>
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-2 block">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageModal.url}
                  onChange={(e) => setImageModal({ ...imageModal, url: e.target.value })}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setImageModal({ isOpen: false, url: '' })}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 uppercase tracking-tight"
                >Cancel</button>
                <button
                  onClick={() => {
                    if (imageModal.url) {
                      editor?.chain().focus().setImage({ src: imageModal.url }).run();
                      setImageModal({ isOpen: false, url: '' });
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl shadow-sm hover:opacity-90 uppercase tracking-tight"
                >Insert</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
