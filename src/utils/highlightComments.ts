/**
 * Highlights commented phrases/sentences in HTML content body by wrapping matching selections
 * in a highlighted <mark> element with tooltips and custom styling.
 * Automatically removes highlights for resolved comments.
 */
export function highlightCommentedSelections(htmlContent: string, comments: any[]): string {
  if (!htmlContent) return htmlContent;

  // 1. Thoroughly strip any existing <mark> tags so resolved comment highlights are completely removed
  let processedHtml = htmlContent.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '$1');

  if (!comments || comments.length === 0) return processedHtml;

  // 2. Filter valid selections from ONLY UNRESOLVED (open) top-level comments
  const openSelections = comments
    .filter(c => !c.isResolved && c.selection && typeof c.selection === 'string' && c.selection.trim().length > 0)
    .map(c => ({
      selection: c.selection.trim(),
      commentText: c.text,
      userName: c.userName || 'Comment'
    }));

  if (openSelections.length === 0) return processedHtml;

  openSelections.forEach(({ selection, commentText, userName }) => {
    const escapedCommentText = commentText.replace(/"/g, '&quot;');
    const escapedSelection = selection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    try {
      // Regex to find selection phrase outside of HTML tags (only in text content)
      const regex = new RegExp(`(?<!<[^>]*)${escapedSelection}(?![^<]*>)`, 'gi');

      processedHtml = processedHtml.replace(regex, (match) => {
        return `<mark class="comment-highlight bg-amber-100 dark:bg-amber-950/60 border-b-2 border-amber-400 dark:border-amber-500 text-zinc-900 dark:text-white px-1.5 py-0.5 rounded font-medium cursor-pointer shadow-xs hover:bg-amber-200 dark:hover:bg-amber-900/80 transition-all inline" title="${userName}: &quot;${escapedCommentText}&quot;">${match}</mark>`;
      });
    } catch (e) {
      console.warn("Could not apply highlight for phrase:", selection, e);
    }
  });

  return processedHtml;
}
