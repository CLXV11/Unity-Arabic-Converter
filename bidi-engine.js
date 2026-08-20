// js/bidi-engine.js
// Bidirectional text processing engine
import { isArabicChar } from './arabic-characters.js';

export class BidiEngine {
    constructor() {
        this.algorithm = 'UNICODE_BIDI';
    }

    /**
     * Process text with bidirectional algorithm
     * @param {string} text - Input text
     * @param {string} direction - Base direction ('rtl' or 'ltr')
     * @returns {string} Processed text
     */
    process(text, direction = 'rtl') {
        if (!text) return '';
        
        // Split into lines
        const lines = text.split('\n');
        
        // Process each line
        const processedLines = lines.map(line => this.processLine(line, direction));
        
        // Rejoin lines
        return processedLines.join('\n');
    }

    processLine(line, direction) {
        // Split into tokens (Arabic words, Latin words, numbers, punctuation)
        const tokens = this.tokenize(line);
        
        // Determine token types
        const typedTokens = tokens.map(token => ({
            text: token,
            type: this.getTokenType(token)
        }));
        
        // Process tokens based on direction
        if (direction === 'rtl') {
            return this.processRTL(typedTokens);
        } else {
            return this.processLTR(typedTokens);
        }
    }

    tokenize(text) {
        // Split into meaningful tokens
        const tokens = [];
        let current = '';
        let currentType = null;
        
        for (const char of text) {
            const charType = this.getCharType(char);
            
            if (currentType === null) {
                currentType = charType;
                current = char;
            } else if (this.canMergeTypes(currentType, charType)) {
                current += char;
            } else {
                tokens.push(current);
                currentType = charType;
                current = char;
            }
        }
        
        if (current) {
            tokens.push(current);
        }
        
        return tokens;
    }

    getCharType(char) {
        if (isArabicChar(char)) return 'arabic';
        if (/[a-zA-Z]/.test(char)) return 'latin';
        if (/\d/.test(char)) return 'number';
        if (/\s/.test(char)) return 'space';
        if (/[.,!?;:'"()\[\]{}]/.test(char)) return 'punctuation';
        return 'other';
    }

    canMergeTypes(type1, type2) {
        if (type1 === type2) return true;
        if (type1 === 'number' && type2 === 'number') return true;
        return false;
    }

    getTokenType(token) {
        if (!token) return 'empty';
        if (isArabicChar(token[0])) return 'arabic';
        if (/[a-zA-Z]/.test(token[0])) return 'latin';
        if (/\d/.test(token[0])) return 'number';
        if (/\s/.test(token[0])) return 'space';
        return 'punctuation';
    }

    processRTL(tokens) {
        // Implement RTL processing
        const result = [];
        let i = tokens.length - 1;
        
        while (i >= 0) {
            const token = tokens[i];
            
            if (token.type === 'arabic') {
                // Collect consecutive Arabic tokens
                const arabicGroup = [];
                while (i >= 0 && tokens[i].type === 'arabic') {
                    arabicGroup.unshift(tokens[i].text);
                    i--;
                }
                result.push(arabicGroup.join(''));
            } else {
                result.push(token.text);
                i--;
            }
        }
        
        return result.join('');
    }

    processLTR(tokens) {
        return tokens.map(token => token.text).join('');
    }

    /**
     * Detect if text needs bidi processing
     * @param {string} text - Input text
     * @returns {boolean} True if bidi processing needed
     */
    needsBidiProcessing(text) {
        let hasArabic = false;
        let hasLatin = false;
        
        for (const char of text) {
            if (isArabicChar(char)) hasArabic = true;
            if (/[a-zA-Z]/.test(char)) hasLatin = true;
        }
        
        return hasArabic && hasLatin;
    }

    /**
     * Extract URLs from text to protect them
     * @param {string} text - Input text
     * @returns {string[]} Array of URLs
     */
    extractURLs(text) {
        const urlRegex = /https?:\/\/[^\s]+/g;
        return text.match(urlRegex) || [];
    }

    /**
     * Protect URLs from processing
     * @param {string} text - Input text
     * @returns {object} Text with URLs replaced by placeholders
     */
    protectURLs(text) {
        const urls = this.extractURLs(text);
        let protectedText = text;
        const placeholderMap = {};
        
        urls.forEach((url, index) => {
            const placeholder = `__URL_${index}__`;
            placeholderMap[placeholder] = url;
            protectedText = protectedText.replace(url, placeholder);
        });
        
        return {
            text: protectedText,
            placeholders: placeholderMap
        };
    }

    /**
     * Restore URLs from placeholders
     * @param {string} text - Text with placeholders
     * @param {object} placeholders - Placeholder map
     * @returns {string} Text with restored URLs
     */
    restoreURLs(text, placeholders) {
        let restoredText = text;
        for (const [placeholder, url] of Object.entries(placeholders)) {
            restoredText = restoredText.replace(placeholder, url);
        }
        return restoredText;
    }
}

export default BidiEngine;