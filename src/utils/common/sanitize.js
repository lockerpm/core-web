import DOMPurify from 'dompurify'

/**
 * Sanitize the HTML description of an activity log.
 * Only <b> (no attributes) is allowed, then a margin class style is applied safely.
 */
export const sanitizeLogHtml = (html = '') => {
  const clean = DOMPurify.sanitize(String(html || ''), {
    ALLOWED_TAGS: ['b'],
    ALLOWED_ATTR: [],
  })
  return clean.replace(/<b>/g, '<b style="margin: 0 4px">')
}

/**
 * Sanitize third-party rich text (e.g. breach description).
 */
export const sanitizeRichHtml = (html = '') => {
  return DOMPurify.sanitize(String(html || ''), {
    ALLOWED_TAGS: ['a', 'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href'],
    ALLOWED_URI_REGEXP: /^https?:/i,
  })
}
