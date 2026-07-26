import { Suspense } from 'react';
import CreateContentEditor from './[id]/page';

export default function CreateContentPage() {
  return (
    <Suspense fallback={<div className="p-8 font-sans">Loading editor...</div>}>
      <CreateContentEditor />
    </Suspense>
  );
}
