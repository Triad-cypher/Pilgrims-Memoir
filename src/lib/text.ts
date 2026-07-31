export function stripMonthPrefix(title: string): string {
  return title.replace(/^[A-Za-z]+ \d{4}:\s*/, "");
}

/** Splits HTML body content (produced by the CMS rich-text editor, i.e. concatenated <p> blocks)
 * back into plain-text paragraphs for use in previews/excerpts where markup isn't wanted. */
export function htmlToParagraphs(html: string): string[] {
  return html
    .split(/<\/p>/i)
    .map((chunk) => chunk.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim())
    .filter(Boolean);
}

export function stripHtml(html: string): string {
  return htmlToParagraphs(html).join(" ");
}
