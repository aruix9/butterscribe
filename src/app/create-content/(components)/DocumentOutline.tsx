'use client';

import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";

interface DocumentOutlineProps {
  headings: { text: string; level: number; pos: number }[];
  editor: Editor | null;
}

export function DocumentOutline({ headings, editor }: DocumentOutlineProps) {
  return (
    <div className="w-72 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Document Outline</h4>
        <div className="space-y-1">
          {headings.length > 0 ? (
            headings.map((heading, index) => (
              <button
                key={`${heading.pos}-${index}`}
                onClick={() => {
                  if (editor) {
                    editor.commands.focus(heading.pos);
                    const node = editor.view.nodeDOM(heading.pos) as HTMLElement;
                    if (node) {
                      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                }}
                className={cn(
                  "w-full text-left flex items-center gap-2 py-1.5 px-3 rounded-md transition-colors text-sm",
                  heading.level === 1 ? "font-bold text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400",
                  heading.level === 2 && "pl-4",
                  heading.level === 3 && "pl-8",
                  heading.level === 4 && "pl-12",
                  heading.level === 5 && "pl-16",
                  heading.level === 6 && "pl-20"
                )}
              >
                {heading.level === 1 && <div className="w-1 h-4 bg-primary rounded-full flex-shrink-0"></div>}
                <span className="truncate">{heading.text || "Untitled Section"}</span>
              </button>
            ))
          ) : (
            <div className="text-xs text-zinc-400 dark:text-zinc-500 italic py-4">
              Add headings to see them in the outline...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
