'use client';

import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { 
  Dock, Undo2, Redo2, Bold, Italic, Underline, Strikethrough, 
  Type, Eraser,  Highlighter, Sparkles, Link2, Quote, Code, 
  Image as ImageIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, MessageSquare,
  Save, Loader2
} from "lucide-react";
import Link from "next/link";

interface ToolbarProps {
  editor: Editor | null;
  documentId: string | null;
  isOutlineOpen: boolean;
  setIsOutlineOpen: (open: boolean) => void;
  isReviewMode: boolean;
  setIsReviewMode: (open: boolean) => void;
  setLinkModal: (modal: { isOpen: boolean; url: string }) => void;
  setImageModal: (modal: { isOpen: boolean; url: string }) => void;
  handleSave: () => void;
  isSaving: boolean;
}

export function Toolbar({
  editor,
  documentId,
  isOutlineOpen,
  setIsOutlineOpen,
  isReviewMode,
  setIsReviewMode,
  setLinkModal,
  setImageModal,
  handleSave,
  isSaving
}: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 p-2 flex items-center gap-1">
      <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
        <button 
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", isOutlineOpen ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")} 
          onClick={() => setIsOutlineOpen(!isOutlineOpen)}
          title="Toggle Outline"
        >
          <Dock className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
        <button 
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 disabled:opacity-30 transition-colors"
          title="Undo"
        ><Undo2 className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 disabled:opacity-30 transition-colors"
          title="Redo"
        ><Redo2 className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('bold') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Bold"
        ><Bold className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('italic') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Italic"
        ><Italic className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('underline') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Underline"
        ><Underline className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('strike') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Strikethrough"
        ><Strikethrough className="w-4 h-4" /></button>
        
        <div className="group relative px-1 flex items-center h-full">
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 transition-colors">
            <Type className="w-4 h-4" />
          </button>
          <div className="absolute top-full left-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-2 flex items-center gap-1.5 min-w-max">
              <button 
                onClick={() => editor.chain().focus().setColor('#3b82f6').run()}
                className={cn("w-6 h-6 rounded-full bg-blue-500 border-2 transition-all hover:scale-110", editor.isActive('textStyle', { color: '#3b82f6' }) ? "border-zinc-900 dark:border-white" : "border-transparent")}
                title="Blue Text"
              />
              <button 
                onClick={() => editor.chain().focus().setColor('#a855f7').run()}
                className={cn("w-6 h-6 rounded-full bg-purple-500 border-2 transition-all hover:scale-110", editor.isActive('textStyle', { color: '#a855f7' }) ? "border-zinc-900 dark:border-white" : "border-transparent")}
                title="Purple Text"
              />
              <button 
                onClick={() => editor.chain().focus().setColor('#10b981').run()}
                className={cn("w-6 h-6 rounded-full bg-emerald-500 border-2 transition-all hover:scale-110", editor.isActive('textStyle', { color: '#10b981' }) ? "border-zinc-900 dark:border-white" : "border-transparent")}
                title="Emerald Text"
              />
              <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
              <button 
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                title="Reset Color"
              ><Eraser className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        <div className="group relative px-1 flex items-center h-full">
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 transition-colors">
            <Highlighter className="w-4 h-4" />
          </button>
          <div className="absolute top-full left-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-2 flex items-center gap-1.5 min-w-max">
              <button 
                onClick={() => editor.chain().focus().unsetHighlight().run()}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                title="Remove Highlight"
              ><Eraser className="w-3.5 h-3.5" /></button>
              <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
              <button 
                onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
                className={cn("w-6 h-6 rounded-full bg-yellow-200 border-2 transition-all hover:scale-110", editor.isActive('highlight', { color: '#fef08a' }) ? "border-zinc-900 dark:border-white" : "border-transparent")}
                title="Yellow Highlight"
              />
              <button 
                onClick={() => editor.chain().focus().toggleHighlight({ color: '#bfdbfe' }).run()}
                className={cn("w-6 h-6 rounded-full bg-blue-200 border-2 transition-all hover:scale-110", editor.isActive('highlight', { color: '#bfdbfe' }) ? "border-zinc-900 dark:border-white" : "border-transparent")}
                title="Blue Highlight"
              />
              <button 
                onClick={() => editor.chain().focus().toggleHighlight({ color: '#bbf7d0' }).run()}
                className={cn("w-6 h-6 rounded-full bg-emerald-200 border-2 transition-all hover:scale-110", editor.isActive('highlight', { color: '#bbf7d0' }) ? "border-zinc-900 dark:border-white" : "border-transparent")}
                title="Emerald Highlight"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
        <button 
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            setLinkModal({ isOpen: true, url: previousUrl || '' });
          }}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('link') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Link"
        ><Link2 className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('blockquote') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Blockquote"
        ><Quote className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('code') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Inline Code"
        ><Code className="w-4 h-4" /></button>
        <button 
          onClick={() => setImageModal({ isOpen: true, url: '' })}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400 transition-colors"
          title="Insert Image"
        ><ImageIcon className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('bulletList') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Bullet List"
        ><List className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive('orderedList') ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Numbered List"
        ><ListOrdered className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
        <button 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive({ textAlign: 'left' }) ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Align Left"
        ><AlignLeft className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive({ textAlign: 'center' }) ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Align Center"
        ><AlignCenter className="w-4 h-4" /></button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn("p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors", editor.isActive({ textAlign: 'right' }) ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400")}
          title="Align Right"
        ><AlignRight className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center">
        <select 
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else if (val.startsWith('h')) {
              const level = parseInt(val.substring(1)) as 1|2|3|4|5|6;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' : 
            editor.isActive('heading', { level: 2 }) ? 'h2' : 
            editor.isActive('heading', { level: 3 }) ? 'h3' : 
            editor.isActive('heading', { level: 4 }) ? 'h4' : 
            editor.isActive('heading', { level: 5 }) ? 'h5' : 
            editor.isActive('heading', { level: 6 }) ? 'h6' : 'p'
          }
          className="bg-zinc-100 dark:bg-zinc-800 border-none rounded text-xs font-semibold py-1 px-3 focus:ring-0 cursor-pointer text-zinc-900 dark:text-zinc-100"
        >
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="p">Paragraph</option>
        </select>
      </div>

      <div className="flex items-center ml-auto pl-2 border-l border-zinc-200 dark:border-zinc-800 gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>
        <Link
          href={documentId ? `/live-preview/${documentId}` : "#"}
          target={documentId ? "_blank" : "_self"}
          className={cn(
            "px-3 py-1.5 text-xs font-bold uppercase tracking-tight rounded-lg transition-opacity",
            documentId 
              ? "text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90" 
              : "text-zinc-400 bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
          )}
          onClick={(e) => !documentId && e.preventDefault()}
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
      </div>
    </div>
  );
}
