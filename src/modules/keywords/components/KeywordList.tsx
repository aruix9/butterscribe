'use client';

import { useKeywordStore } from '../store/keywordStore';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function KeywordList() {
  const { keywords, removeKeyword } = useKeywordStore();

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {keywords.map((keyword) => (
        <div 
          key={keyword}
          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium transition-all hover:bg-secondary/80"
        >
          {keyword}
          <button 
            onClick={() => removeKeyword(keyword)}
            className="hover:text-destructive transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
