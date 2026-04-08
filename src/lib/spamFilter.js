/**
 * Spam filter utility for user-generated content.
 * Blocks URLs, documents, and common spam patterns.
 */

// URL patterns to block
const URL_PATTERNS = [
    /https?:\/\//i,
    /www\./i,
    /\.[a-z]{2,6}\//i,          // .com/ .es/ .org/ etc
    /\.(com|es|org|net|io|xyz|info|biz|co|uk|de|fr|ru|cn)\b/i,
    /bit\.ly/i,
    /goo\.gl/i,
    /t\.co\//i,
    /tinyurl/i,
    /telegram\.me/i,
    /wa\.me/i,
    /discord\.gg/i,
]

// Document/file patterns
const DOC_PATTERNS = [
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|exe|dmg|apk)\b/i,
]

// Spam keyword patterns (Spanish + English)
const SPAM_PATTERNS = [
    /ganar?\s*dinero/i,
    /enlace|link\s*(aquí|here)/i,
    /promoción\s*especial/i,
    /casino\s*online/i,
    /apuesta\s*segura\s*100/i,
    /whatsapp.*\d{8,}/i,
    /telegram.*@/i,
    /sígueme|follow\s*me/i,
    /gratis.*dinero/i,
    /haz\s*click/i,
    /click\s*here/i,
]

/**
 * Validate comment content. Returns { valid, reason } 
 */
export function validateComment(content) {
    if (!content || typeof content !== 'string') {
        return { valid: false, reason: 'El comentario no puede estar vacío.' }
    }

    const trimmed = content.trim()
    
    if (trimmed.length < 1) {
        return { valid: false, reason: 'El comentario no puede estar vacío.' }
    }

    if (trimmed.length > 2000) {
        return { valid: false, reason: 'El comentario no puede superar los 2000 caracteres.' }
    }

    // Check for URLs
    for (const pattern of URL_PATTERNS) {
        if (pattern.test(trimmed)) {
            return { valid: false, reason: 'No se permiten enlaces o URLs en los comentarios.' }
        }
    }

    // Check for document links
    for (const pattern of DOC_PATTERNS) {
        if (pattern.test(trimmed)) {
            return { valid: false, reason: 'No se permiten enlaces a documentos o archivos.' }
        }
    }

    // Check for spam patterns
    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(trimmed)) {
            return { valid: false, reason: 'Tu comentario ha sido detectado como spam.' }
        }
    }

    // Check for excessive repeated characters (e.g. "aaaaaaaa")
    if (/(.)\1{9,}/i.test(trimmed)) {
        return { valid: false, reason: 'El comentario contiene demasiados caracteres repetidos.' }
    }

    // Check for all-caps (more than 80% uppercase, min 20 chars)
    if (trimmed.length >= 20) {
        const upperCount = (trimmed.match(/[A-ZÁÉÍÓÚÑ]/g) || []).length
        const letterCount = (trimmed.match(/[a-záéíóúñA-ZÁÉÍÓÚÑ]/g) || []).length
        if (letterCount > 0 && upperCount / letterCount > 0.8) {
            return { valid: false, reason: 'Por favor, no escribas todo en mayúsculas.' }
        }
    }

    return { valid: true, reason: null }
}
