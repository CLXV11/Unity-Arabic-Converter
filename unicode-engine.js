// js/unicode-engine.js
// Unicode inspection and analysis engine
import { ArabicCharacterData, UnicodeBlockRanges } from './arabic-characters.js';

export class UnicodeEngine {
    constructor() {
        this.blocks = this.initUnicodeBlocks();
    }

    initUnicodeBlocks() {
        return {
            'Arabic': UnicodeBlockRanges.arabic,
            'Arabic Supplement': UnicodeBlockRanges.arabicSupplement,
            'Arabic Extended-A': UnicodeBlockRanges.arabicExtendedA,
            'Arabic Presentation Forms-A': UnicodeBlockRanges.arabicPresentationFormsA,
            'Arabic Presentation Forms-B': UnicodeBlockRanges.arabicPresentationFormsB
        };
    }

    /**
     * Get detailed Unicode information for a character
     * @param {string} char - Single character
     * @returns {object} Character details
     */
    getCharacterInfo(char) {
        if (!char || char.length === 0) return null;
        
        const codePoint = char.codePointAt(0);
        const hex = codePoint.toString(16).toUpperCase().padStart(4, '0');
        const decimal = codePoint;
        
        // Calculate UTF-8 encoding
        const utf8 = this.getUTF8Encoding(codePoint);
        
        // Calculate UTF-16 encoding
        const utf16 = this.getUTF16Encoding(codePoint);
        
        // Find Unicode block
        const block = this.findUnicodeBlock(codePoint);
        
        // Get character name (basic)
        const name = this.getCharacterName(char, codePoint);
        
        // Determine bidirectional class
        const bidiClass = this.getBidiClass(char, codePoint);
        
        return {
            character: char,
            codePoint: `U+${hex}`,
            hex: `0x${hex}`,
            decimal,
            utf8,
            utf16,
            name,
            block,
            bidiClass
        };
    }

    getUTF8Encoding(codePoint) {
        if (codePoint < 0x80) {
            return [codePoint.toString(16).toUpperCase().padStart(2, '0')];
        } else if (codePoint < 0x800) {
            return [
                (0xC0 | (codePoint >> 6)).toString(16).toUpperCase().padStart(2, '0'),
                (0x80 | (codePoint & 0x3F)).toString(16).toUpperCase().padStart(2, '0')
            ];
        } else if (codePoint < 0x10000) {
            return [
                (0xE0 | (codePoint >> 12)).toString(16).toUpperCase().padStart(2, '0'),
                (0x80 | ((codePoint >> 6) & 0x3F)).toString(16).toUpperCase().padStart(2, '0'),
                (0x80 | (codePoint & 0x3F)).toString(16).toUpperCase().padStart(2, '0')
            ];
        } else {
            return [
                (0xF0 | (codePoint >> 18)).toString(16).toUpperCase().padStart(2, '0'),
                (0x80 | ((codePoint >> 12) & 0x3F)).toString(16).toUpperCase().padStart(2, '0'),
                (0x80 | ((codePoint >> 6) & 0x3F)).toString(16).toUpperCase().padStart(2, '0'),
                (0x80 | (codePoint & 0x3F)).toString(16).toUpperCase().padStart(2, '0')
            ];
        }
    }

    getUTF16Encoding(codePoint) {
        if (codePoint < 0x10000) {
            return [codePoint.toString(16).toUpperCase().padStart(4, '0')];
        } else {
            const adjusted = codePoint - 0x10000;
            const high = 0xD800 + (adjusted >> 10);
            const low = 0xDC00 + (adjusted & 0x3FF);
            return [
                high.toString(16).toUpperCase().padStart(4, '0'),
                low.toString(16).toUpperCase().padStart(4, '0')
            ];
        }
    }

    findUnicodeBlock(codePoint) {
        for (const [name, [start, end]] of Object.entries(this.blocks)) {
            if (codePoint >= start && codePoint <= end) {
                return name;
            }
        }
        return 'Basic Latin / Other';
    }

    getCharacterName(char, codePoint) {
        // Check if it's a known Arabic character
        if (char in ArabicCharacterData.letters) {
            return ArabicCharacterData.letters[char].name;
        }
        if (char in ArabicCharacterData.diacritics) {
            return ArabicCharacterData.diacritics[char].name;
        }
        
        // Basic names for common characters
        const commonNames = {
            ' ': 'SPACE',
            '\n': 'NEW LINE',
            '\t': 'TAB',
            '.': 'FULL STOP',
            ',': 'COMMA',
            '!': 'EXCLAMATION MARK',
            '?': 'QUESTION MARK',
            ':': 'COLON',
            ';': 'SEMICOLON',
            '(': 'LEFT PARENTHESIS',
            ')': 'RIGHT PARENTHESIS',
            '[': 'LEFT SQUARE BRACKET',
            ']': 'RIGHT SQUARE BRACKET',
            '{': 'LEFT CURLY BRACKET',
            '}': 'RIGHT CURLY BRACKET'
        };
        
        return commonNames[char] || `UNICODE CHARACTER U+${codePoint.toString(16).toUpperCase()}`;
    }

    getBidiClass(char, codePoint) {
        if (codePoint >= 0x0600 && codePoint <= 0x06FF) return 'AL (Arabic Letter)';
        if (codePoint >= 0x05D0 && codePoint <= 0x05EA) return 'R (Right-to-Left)';
        if (codePoint >= 0x0041 && codePoint <= 0x005A) return 'L (Left-to-Right)';
        if (codePoint >= 0x0030 && codePoint <= 0x0039) return 'EN (European Number)';
        if (char === ' ') return 'WS (Whitespace)';
        if (char === '\n') return 'B (Paragraph Separator)';
        return 'L (Left-to-Right)';
    }

    /**
     * Get all character forms for Arabic letters
     * @param {string} char - Single character
     * @returns {object} Character forms
     */
    getArabicForms(char) {
        if (char in ArabicCharacterData.letters) {
            const letterData = ArabicCharacterData.letters[char];
            return {
                isolated: letterData.isolated,
                initial: letterData.initial || 'Not available',
                medial: letterData.medial || 'Not available',
                final: letterData.final || 'Not available'
            };
        }
        return null;
    }
}

export default UnicodeEngine;