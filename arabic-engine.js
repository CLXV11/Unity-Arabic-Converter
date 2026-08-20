// js/arabic-engine.js
// Arabic Text Processing Engine
import { ArabicCharacterData, isArabicChar, isArabicLetter, isArabicDiacritic } from './arabic-characters.js';

export class ArabicTextEngine {
    constructor() {
        this.debug = false;
    }

    /**
     * Detect if text contains Arabic characters
     * @param {string} text - Input text
     * @returns {boolean} True if Arabic characters detected
     */
    detectArabic(text) {
        if (!text || typeof text !== 'string') return false;
        for (const char of text) {
            if (isArabicChar(char)) return true;
        }
        return false;
    }

    /**
     * Detect if text is primarily RTL
     * @param {string} text - Input text
     * @returns {boolean} True if text is RTL
     */
    detectRTL(text) {
        if (!text) return false;
        const arabicCount = [...text].filter(char => isArabicChar(char)).length;
        return arabicCount > 0;
    }

    /**
     * Normalize Arabic text
     * @param {string} text - Input text
     * @returns {string} Normalized text
     */
    normalize(text) {
        if (!text) return '';
        
        // Normalize Unicode characters
        let normalized = text.normalize('NFC');
        
        // Normalize Arabic-specific characters
        normalized = normalized
            .replace(/\u0640/g, '') // Remove tatweel
            .replace(/[أإآا]/g, 'ا') // Normalize alef variants
            .replace(/ى/g, 'ي') // Normalize alef maksura to yeh
            .replace(/ة/g, 'ه') // Normalize teh marbuta to heh
            .replace(/[\u064B-\u065F\u0670]/g, match => match); // Keep diacritics
            
        return normalized;
    }

    /**
     * Basic Arabic shaping
     * @param {string} text - Input text
     * @returns {string} Shaped text
     */
    shape(text) {
        if (!text) return '';
        
        const chars = [...text];
        const result = [];
        
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            
            if (!isArabicLetter(char)) {
                result.push(char);
                continue;
            }
            
            const letterData = ArabicCharacterData.letters[char];
            if (!letterData) {
                result.push(char);
                continue;
            }
            
            const prevChar = i > 0 ? chars[i - 1] : '';
            const nextChar = i < chars.length - 1 ? chars[i + 1] : '';
            
            const canConnectPrev = prevChar && isArabicLetter(prevChar) && 
                                   ArabicCharacterData.letters[prevChar]?.medial !== null &&
                                   ArabicCharacterData.letters[char]?.initial !== null;
            
            const canConnectNext = nextChar && isArabicLetter(nextChar) &&
                                   ArabicCharacterData.letters[char]?.medial !== null &&
                                   ArabicCharacterData.letters[nextChar]?.final !== null;
            
            let shapedChar = letterData.isolated;
            
            if (canConnectPrev && canConnectNext) {
                shapedChar = letterData.medial;
            } else if (canConnectPrev && !canConnectNext) {
                shapedChar = letterData.final;
            } else if (!canConnectPrev && canConnectNext) {
                shapedChar = letterData.initial;
            } else {
                shapedChar = letterData.isolated;
            }
            
            result.push(shapedChar || char);
        }
        
        return result.join('');
    }

    /**
     * Process bidirectional text
     * @param {string} text - Input text
     * @returns {string} Processed text
     */
    processBidi(text) {
        if (!text) return '';
        
        // Split text into segments (Arabic vs Latin)
        const segments = [];
        let currentSegment = '';
        let currentType = null;
        
        for (const char of text) {
            const isArabic = isArabicChar(char);
            const charType = isArabic ? 'arabic' : 'latin';
            
            if (currentType === null) {
                currentType = charType;
                currentSegment = char;
            } else if (charType === currentType) {
                currentSegment += char;
            } else {
                segments.push({ type: currentType, text: currentSegment });
                currentType = charType;
                currentSegment = char;
            }
        }
        
        if (currentSegment) {
            segments.push({ type: currentType, text: currentSegment });
        }
        
        // Process segments for RTL display
        const processedSegments = segments.map(segment => {
            if (segment.type === 'arabic') {
                // Apply shaping to Arabic segments
                return this.shape(segment.text);
            } else {
                return segment.text;
            }
        });
        
        // Join segments with RTL ordering
        return processedSegments.join('');
    }

    /**
     * Convert text using specific profile
     * @param {string} text - Input text
     * @param {object} profile - Conversion profile
     * @returns {string} Converted text
     */
    convert(text, profile) {
        if (!text || !profile) return text;
        
        let result = text;
        
        // Step 1: Normalize
        if (profile.normalize !== false) {
            result = this.normalize(result);
        }
        
        // Step 2: Detect Arabic
        const hasArabic = this.detectArabic(result);
        
        if (hasArabic) {
            // Step 3: Shaping
            if (profile.shaping !== false) {
                result = this.shape(result);
            }
            
            // Step 4: Bidi processing
            if (profile.bidi !== false) {
                result = this.processBidi(result);
            }
            
            // Step 5: Target transformation
            switch (profile.type) {
                case 'unity-legacy':
                    // For Unity Legacy, we use presentation forms
                    result = this.toPresentationForms(result);
                    break;
                    
                case 'textmeshpro':
                    // TextMeshPro handles RTL better natively
                    result = result;
                    break;
                    
                case 'presentation-forms':
                    result = this.toPresentationForms(result);
                    break;
                    
                case 'rtl-processing':
                    // Apply RTL-specific processing
                    result = this.applyRTLProcessing(result);
                    break;
                    
                case 'custom':
                    if (profile.presentationForms) {
                        result = this.toPresentationForms(result);
                    }
                    break;
                    
                default:
                    break;
            }
        }
        
        return result;
    }

    /**
     * Convert to Unicode Presentation Forms
     * @param {string} text - Input text
     * @returns {string} Text in presentation forms
     */
    toPresentationForms(text) {
        if (!text) return '';
        
        let result = '';
        for (const char of text) {
            if (char in ArabicCharacterData.presentationForms) {
                result += char; // Keep original for now
            } else {
                result += char;
            }
        }
        return result;
    }

    /**
     * Apply RTL processing
     * @param {string} text - Input text
     * @returns {string} RTL processed text
     */
    applyRTLProcessing(text) {
        if (!text) return '';
        
        // Split into lines
        const lines = text.split('\n');
        
        // Process each line
        const processedLines = lines.map(line => {
            // Split into words while preserving non-Arabic segments
            const words = line.split(/(\s+)/);
            
            // Process Arabic words
            const processedWords = words.map(word => {
                if (this.detectArabic(word)) {
                    return this.shape(word);
                }
                return word;
            });
            
            // Join words with RTL ordering
            return processedWords.reverse().join('');
        });
        
        // Reverse line order for RTL
        return processedLines.reverse().join('\n');
    }

    /**
     * Analyze text properties
     * @param {string} text - Input text
     * @returns {object} Analysis results
     */
    analyze(text) {
        if (!text) {
            return {
                hasArabic: false,
                hasLatin: false,
                hasNumbers: false,
                hasDiacritics: false,
                hasPunctuation: false,
                isRTL: false,
                isMixed: false,
                charCount: 0,
                arabicCount: 0,
                latinCount: 0,
                numberCount: 0
            };
        }
        
        const chars = [...text];
        let arabicCount = 0;
        let latinCount = 0;
        let numberCount = 0;
        let diacriticCount = 0;
        let punctuationCount = 0;
        
        for (const char of chars) {
            if (isArabicChar(char)) {
                arabicCount++;
                if (isArabicDiacritic(char)) {
                    diacriticCount++;
                }
            } else if (/[a-zA-Z]/.test(char)) {
                latinCount++;
            } else if (/\d/.test(char)) {
                numberCount++;
            } else if (/[.,!?;:'"()\[\]{}]/.test(char)) {
                punctuationCount++;
            }
        }
        
        return {
            hasArabic: arabicCount > 0,
            hasLatin: latinCount > 0,
            hasNumbers: numberCount > 0,
            hasDiacritics: diacriticCount > 0,
            hasPunctuation: punctuationCount > 0,
            isRTL: this.detectRTL(text),
            isMixed: arabicCount > 0 && (latinCount > 0 || numberCount > 0),
            charCount: chars.length,
            arabicCount,
            latinCount,
            numberCount,
            diacriticCount,
            punctuationCount
        };
    }
}

export default ArabicTextEngine;