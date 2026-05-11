'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

export function RichTextEditor() {
  const { content, setContent } = useEditorStore();
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] border rounded-md p-4',
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="p-1 hover:bg-muted rounded text-sm font-bold"
        >
          B
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="p-1 hover:bg-muted rounded text-sm italic"
        >
          I
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
