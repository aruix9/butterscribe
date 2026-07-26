import { Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink, ImageRun } from "docx";

async function fetchImageBuffer(src: string): Promise<Uint8Array | null> {
  try {
    if (src.startsWith('data:image')) {
      const base64Data = src.split(',')[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    
    // Resolve relative URL to absolute
    let fullUrl = src;
    if (typeof window !== "undefined" && src.startsWith("/")) {
      fullUrl = `${window.location.origin}${src}`;
    }

    const response = await fetch(fullUrl, { mode: 'cors' });
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (e) {
    console.warn("Could not fetch image for docx export:", src, e);
    return null;
  }
}

export async function exportToDocx(title: string, htmlContent: string) {
  if (typeof window === "undefined") return;

  // Clean HTML from mark tags if any
  const cleanHtml = (htmlContent || "").replace(/<mark[^>]*>(.*?)<\/mark>/gi, '$1');

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, "text/html");

  const children: Paragraph[] = [];

  // Add Document Title
  children.push(
    new Paragraph({
      text: title || "Untitled Document",
      heading: HeadingLevel.TITLE,
      spacing: { after: 300 }
    })
  );

  // Helper to recursively parse inline nodes (Text, Bold, Italic, Links, Images)
  async function parseInlineNodes(element: HTMLElement): Promise<(TextRun | ExternalHyperlink | ImageRun)[]> {
    const inlineItems: (TextRun | ExternalHyperlink | ImageRun)[] = [];

    const walkNode = async (node: Node, parentFormatting: { bold?: boolean; italics?: boolean; underline?: boolean; strike?: boolean } = {}) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent;
        if (txt) {
          inlineItems.push(
            new TextRun({
              text: txt,
              bold: parentFormatting.bold,
              italics: parentFormatting.italics,
              underline: parentFormatting.underline ? {} : undefined,
              strike: parentFormatting.strike,
            })
          );
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        if (tag === "a") {
          let href = el.getAttribute("href") || "#";
          if (href.startsWith("/")) {
            href = `${window.location.origin}${href}`;
          } else if (href !== "#" && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("mailto:")) {
            href = `https://${href}`;
          }

          const linkText = el.textContent || href;

          inlineItems.push(
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: linkText,
                  color: "0563C1",
                  underline: {},
                  bold: parentFormatting.bold,
                  italics: parentFormatting.italics,
                }),
              ],
              link: href,
            })
          );
        } else if (tag === "img") {
          const src = el.getAttribute("src");
          if (src) {
            const buffer = await fetchImageBuffer(src);
            if (buffer) {
              inlineItems.push(
                new ImageRun({
                  data: buffer,
                  transformation: {
                    width: 500,
                    height: 280,
                  },
                })
              );
            }
          }
        } else if (tag === "br") {
          inlineItems.push(new TextRun({ break: 1 }));
        } else {
          const currentFormatting = {
            bold: parentFormatting.bold || tag === "b" || tag === "strong",
            italics: parentFormatting.italics || tag === "i" || tag === "em",
            underline: parentFormatting.underline || tag === "u",
            strike: parentFormatting.strike || tag === "s" || tag === "strike" || tag === "del",
          };

          for (const childNode of Array.from(el.childNodes)) {
            await walkNode(childNode, currentFormatting);
          }
        }
      }
    };

    for (const childNode of Array.from(element.childNodes)) {
      await walkNode(childNode);
    }

    return inlineItems;
  }

  // Parse block elements
  const bodyNodes = Array.from(doc.body.childNodes);

  for (const node of bodyNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === "h1") {
        children.push(new Paragraph({ text: el.textContent || "", heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 } }));
      } else if (tag === "h2") {
        children.push(new Paragraph({ text: el.textContent || "", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
      } else if (tag === "h3") {
        children.push(new Paragraph({ text: el.textContent || "", heading: HeadingLevel.HEADING_3, spacing: { before: 160, after: 80 } }));
      } else if (tag === "h4") {
        children.push(new Paragraph({ text: el.textContent || "", heading: HeadingLevel.HEADING_4, spacing: { before: 140, after: 60 } }));
      } else if (tag === "h5") {
        children.push(new Paragraph({ text: el.textContent || "", heading: HeadingLevel.HEADING_5, spacing: { before: 120, after: 40 } }));
      } else if (tag === "h6") {
        children.push(new Paragraph({ text: el.textContent || "", heading: HeadingLevel.HEADING_6, spacing: { before: 100, after: 20 } }));
      } else if (tag === "ul" || tag === "ol") {
        for (const li of Array.from(el.children)) {
          const inlineItems = await parseInlineNodes(li as HTMLElement);
          children.push(new Paragraph({ children: inlineItems.length > 0 ? inlineItems : [new TextRun(`• ${li.textContent || ""}`)], bullet: { level: 0 } }));
        }
      } else if (tag === "img") {
        const src = el.getAttribute("src");
        if (src) {
          const buffer = await fetchImageBuffer(src);
          if (buffer) {
            children.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: buffer,
                    transformation: {
                      width: 520,
                      height: 300,
                    },
                  }),
                ],
                spacing: { before: 120, after: 120 },
              })
            );
          }
        }
      } else {
        const inlineItems = await parseInlineNodes(el);

        if (inlineItems.length > 0) {
          children.push(new Paragraph({ children: inlineItems, spacing: { after: 120 } }));
        } else if (el.textContent?.trim()) {
          children.push(new Paragraph({ text: el.textContent, spacing: { after: 120 } }));
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      children.push(new Paragraph({ text: node.textContent.trim(), spacing: { after: 120 } }));
    }
  }

  const docxDocument = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(docxDocument);
  const fileName = `${(title || "document").toLowerCase().replace(/[^a-z0-9]/g, "_")}.docx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
