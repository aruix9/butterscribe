'use client';

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { CalendarSidebar } from '@/modules/calendar/components/CalendarSidebar';
import { DraftModal } from '@/modules/calendar/components/DraftModal';
import { EndDatePopover } from '@/modules/calendar/components/EndDatePopover';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContentCalendarPage() {
  const { isSidebarCollapsed } = useLayoutStore();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  
  // Popover state for drag & drop
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverData, setPopoverData] = useState<{
    id: string;
    startDate: string;
    position: { x: number; y: number } | null;
  } | null>(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents?limit=100');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      const docs = Array.isArray(data) ? data : data.documents || [];
      setDocuments(docs);
    } catch (err) {
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchDocuments();
  }, []);

  const draggableRef = useRef<Draggable | null>(null);

  // Initialize Draggable for sidebar
  useEffect(() => {
    if (isLoading) return;

    const draggableEl = document.querySelector('.custom-scrollbar');
    if (draggableEl && !draggableRef.current) {
      draggableRef.current = new Draggable(draggableEl as HTMLElement, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
          const data = JSON.parse(eventEl.getAttribute('data-event') || '{}');
          return {
            ...data,
            create: true // Ensure it creates an event in FullCalendar
          };
        }
      });
    }

    return () => {
      if (draggableRef.current) {
        draggableRef.current.destroy();
        draggableRef.current = null;
      }
    };
  }, [isLoading]);


  const handleDateClick = (arg: any) => {
    setSelectedDraft({ startDate: arg.dateStr });
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
    setSelectedDraft(arg.event.extendedProps);
    setIsModalOpen(true);
  };

  const handleEventDrop = async (arg: any) => {
    const { event } = arg;
    try {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: event.id,
          startDate: event.startStr,
          endDate: event.endStr || event.startStr,
        }),
      });
      fetchDocuments();
      toast.success("Schedule updated");
    } catch (error) {
      toast.error("Failed to update schedule");
      arg.revert();
    }
  };

  const handleExternalDrop = (arg: any) => {
    const { draggedEl, dateStr, jsEvent } = arg;
    const eventData = JSON.parse(draggedEl.getAttribute('data-event') || '{}');
    
    setPopoverData({
      id: eventData.id,
      startDate: dateStr,
      position: { x: jsEvent.clientX, y: jsEvent.clientY }
    });
    setIsPopoverOpen(true);
  };

  const handleConfirmEndDate = async (endDate: string) => {
    if (!popoverData) return;
    
    // Optimistic update
    setDocuments(prev => {
      const next = prev.map(doc => 
        String(doc._id) === String(popoverData.id) 
          ? { ...doc, startDate: popoverData.startDate, endDate: endDate } 
          : doc
      );
      return next;
    });


    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: popoverData.id,
          startDate: popoverData.startDate,
          endDate: endDate,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to save on server');
      
      fetchDocuments();
      toast.success("Content scheduled");
    } catch (error) {
      toast.error("Failed to schedule content");
      fetchDocuments(); // Rollback on error
    } finally {
      setIsPopoverOpen(false);
      setPopoverData(null);
    }
  };



  const unscheduledDrafts = documents.filter(doc => !doc.startDate);
  const scheduledEvents = documents.filter(doc => !!doc.startDate).map(doc => ({
    id: String(doc._id),
    title: doc.title,
    start: doc.startDate,
    end: doc.endDate || doc.startDate,
    extendedProps: doc,
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
    className: 'cursor-pointer hover:brightness-95 transition-all'
  }));


  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header />
      <Sidebar />
      <main className={cn(
        "w-full transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="flex h-[calc(100vh-138px)]">          
          <div className="flex-1 p-8 overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-50">Syncing Calendar...</p>
              </div>
            ) : (
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={scheduledEvents}
                  editable={true}
                  droppable={true}
                  selectable={true}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  eventDrop={handleEventDrop}
                  drop={handleExternalDrop}
                  height="100%"
                  eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                  }}
                />
            )}
          </div>
          <CalendarSidebar 
            drafts={unscheduledDrafts}
            onNewDraft={() => {
              setSelectedDraft(null);
              setIsModalOpen(true);
            }}
            onEditDraft={(draft) => {
              setSelectedDraft(draft);
              setIsModalOpen(true);
            }}
          />

          <DraftModal 
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedDraft(null);
            }}
            onSave={() => fetchDocuments()}
            initialData={selectedDraft}
          />

          <EndDatePopover 
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            startDate={popoverData?.startDate || ''}
            position={popoverData?.position || null}
            onConfirm={handleConfirmEndDate}
          />
        </div>
      <Footer />
      </main>

      <style jsx global>{`
        .fc {
          --fc-border-color: #e4e4e7;
          --fc-button-bg-color: #3b82f6;
          --fc-button-border-color: #3b82f6;
          --fc-button-hover-bg-color: #2563eb;
          --fc-button-active-bg-color: #1d4ed8;
          --fc-today-bg-color: rgba(59, 130, 246, 0.05);
          font-family: inherit;
        }
        .dark .fc {
          --fc-border-color: #27272a;
          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
          --fc-page-bg-color: #18181b;
          --fc-neutral-bg-color: #18181b;
          --fc-list-event-hover-bg-color: #27272a;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          text-transform: uppercase;
        }
        .fc .fc-button {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          padding: 0.5rem 1rem;
        }
        .fc .fc-col-header-cell {
          padding: 0.75rem 0;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: #71717a;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: var(--fc-border-color);
        }
        .fc-daygrid-day-number {
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.5rem !important;
        }
        .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
