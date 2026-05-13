'use client';

import { useState } from 'react';
import { Search, Plus, FileText, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentData {
  _id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface CalendarSidebarProps {
  drafts: DocumentData[];
  onNewDraft: () => void;
  onEditDraft: (draft: DocumentData) => void;
}

export function CalendarSidebar({ drafts, onNewDraft, onEditDraft }: CalendarSidebarProps) {
  const [search, setSearch] = useState('');

  const filteredDrafts = drafts.filter(draft => 
    draft.title.toLowerCase().includes(search.toLowerCase()) || 
    draft.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-80 flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 dark:text-white">Unscheduled Drafts</h2>
          <Button size="icon" variant="ghost" onClick={onNewDraft} className="h-8 w-8">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input 
            className="pl-9 h-9" 
            placeholder="Search ideas..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredDrafts.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-10 h-10 text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              No unscheduled drafts found. Create a new idea to get started.
            </p>
          </div>
        ) : (
          filteredDrafts.map((draft) => (
            <div 
              key={draft._id}
              className="fc-event group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md transition-all relative"
              data-event={JSON.stringify({
                id: draft._id,
                title: draft.title,
                extendedProps: { ...draft }
              })}
              onClick={() => onEditDraft(draft)}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate mb-1">
                    {draft.title}
                  </h4>
                  {draft.description && (
                    <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {draft.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button onClick={onNewDraft} className="w-full font-bold gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          New Idea
        </Button>
      </div>
    </aside>
  );
}
