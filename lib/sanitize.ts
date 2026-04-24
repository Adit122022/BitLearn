// Server-side HTML sanitizer — strips XSS vectors from rich-text content
// Tiptap already sanitizes on input, but this is a server-side safety net.
const DANGEROUS_TAGS = /(<\s*(script|iframe|object|embed|form|input|button|link|meta|style|base)[^>]*>[\s\S]*?<\/\2>|<\s*(script|iframe|object|embed|form|input|button|link|meta|style|base)[^>]*\/?>)/gi
const EVENT_HANDLERS = /\s+on\w+\s*=\s*["'][^"']*["']/gi
const JAVASCRIPT_URLS = /javascript\s*:/gi
const DATA_URLS = /data\s*:\s*[^;]+;base64/gi
const SELF_CLOSING_DANGEROUS = /<\s*(script|iframe|object|embed|form|input|link|meta|style|base)[^>]*>/gi

export function sanitizeHtml(html: string): string {
  return html
    .replace(DANGEROUS_TAGS, "")
    .replace(SELF_CLOSING_DANGEROUS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JAVASCRIPT_URLS, "blocked:")
    .replace(DATA_URLS, "blocked:")
}
