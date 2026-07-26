/**
 * Highlights commented phrases/sentences in HTML content body by wrapping matching selections
 * in a highlighted <mark> element with tooltips and custom styling.
 */
export function highlightCommentedSelections(htmlContent: string, comments: any[]): string {
  if (!htmlContent || !comments || comments.length === 0) return htmlContent;

  let processedHtml = htmlContent;

  // Filter valid selections from top-level comments
  const selectionsWithComments = comments
    .filter(c => c.selection && typeof c.selection === 'string' && c.selection.trim().length > 0)
    .map(c => ({
      selection: c.selection.trim(),
      commentText: c.text,
      userName: c.userName || 'Comment'
    }));

  if (selectionsWithComments.length === 0) return htmlContent;

  selectionsWithComments.forEach(({ selection, commentText, userName }) => {
    // Avoid double-wrapping already highlighted elements
    const escapedCommentText = commentText.replace(/"/g, '&quot;');
    if (processedHtml.includes(`title="${escapedCommentText}"`)) return;

    // Escape regex special characters in selection phrase
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
