'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EndDatePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (endDate: string) => void;
  startDate: string;
  position: { x: number; y: number } | null;
}

export function EndDatePopover({ isOpen, onClose, onConfirm, startDate, position }: EndDatePopoverProps) {
  const [endDate, setEndDate] = useState(startDate);

  if (!position) return null;

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverContent 
        className="w-64 p-4 shadow-xl border-zinc-200 dark:border-zinc-800" 
        style={{ 
          position: 'fixed', 
          left: position.x, 
          top: position.y,
          transform: 'translate(-50%, -100%)'
        }}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-none">Select End Date</h4>
            <p className="text-[10px] text-zinc-500">When should this content be finished?</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="popoverEndDate" className="text-[10px] uppercase tracking-widest font-black text-zinc-400">End Date</Label>
            <Input 
              id="popoverEndDate" 
              type="date" 
              className="h-8 text-xs" 
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1 text-[10px] h-7 uppercase font-black" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1 text-[10px] h-7 uppercase font-black" onClick={() => onConfirm(endDate)}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
