'use client';

import { DocumentTable } from "@/components/shared/DocumentTable";
import { useState, useEffect } from "react";

interface DocumentData {
  _id: string;
  title: string;
  body: string;
  status: string;
  updatedAt: string;
}

export function ContentTable() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestDocuments = async () => {
      try {
        const response = await fetch('/api/documents?limit=10&page=1');
        if (!response.ok) throw new Error('Failed to fetch latest content');
        const data = await response.json();
        setDocuments(data.documents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestDocuments();
  }, []);

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">Previously Written Content</h3>
      
      <DocumentTable 
        documents={documents}
        isLoading={isLoading}
        error={error}
        emptyMessage="You haven't written any content yet."
      />
    </section>
  );
}

