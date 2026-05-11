import { create } from 'zustand';

interface KeywordsState {
  keywords: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
}

export const useKeywordStore = create<KeywordsState>((set) => ({
  keywords: ['nextjs', 'saas', 'modular', 'frontend'],
  addKeyword: (keyword) => set((state) => ({ 
    keywords: [...state.keywords, keyword] 
  })),
  removeKeyword: (keyword) => set((state) => ({ 
    keywords: state.keywords.filter(k => k !== keyword) 
  })),
}));
