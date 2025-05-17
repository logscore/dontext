// Simple markdown sanitizer to remove links, headers, and footers
export default function sanitizeMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') return '';

  // Remove markdown links: [text](url)
  let sanitized = markdown.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // Remove HTML links: <a href="...">text</a>
  sanitized = sanitized.replace(/<a [^>]+>(.*?)<\/a>/gi, '$1');

  // Remove headers (lines starting with #)
  sanitized = sanitized.replace(/^#+ .+$/gm, '');

  // Remove footers (common footer patterns, e.g., lines with 'previous next', 'edit this page', etc.)
  sanitized = sanitized.replace(/\n?\s*(previous|next|edit this page|copyright|all rights reserved)[^\n]*\n?/gi, '\n');

  // Remove empty lines at start/end and multiple blank lines
  sanitized = sanitized.replace(/(^\s*\n)|(\n\s*$)/g, '');
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  return sanitized.trim();
}
