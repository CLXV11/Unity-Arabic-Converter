// js/shaping-engine.js
// Arabic text shaping engine
import { ArabicCharacterData, isArabicLetter } from './arabic-characters.js';

export class ShapingEngine {
    constructor() {
        this.ligatures = {
            'لا': 'لا', // lam-alef ligature
            'لآ': 'لآ',
            'لأ': 'لأ',
            'لإ': 'لإ'
        };
    }

    /**
     * Shape Arabic text
     * @param {string} text - Input text
     * @returns {string} Shaped text
     */
    shape(text) {
        if (!text) return '';
        
        const chars = [...text];
        const result = [];
        
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            
            // Skip non-Arabic characters
            if (!isArabicLetter(char)) {
                result.push(char);
                continue;
            }
            
            // Get letter information
            const letterData = ArabicCharacterData.letters[char];
            if (!letterData) {
                result.push(char);
                continue;
            }
            
            // Check previous and next characters
            const prevChar = i > 0 ? chars[i - 1] : null;
            const nextChar = i < chars.length - 1 ? chars[i + 1] : null;
            
            // Determine connection context
            const prevConnects = this.canConnectToNext(prevChar);
            const nextConnects = this.canConnectFromPrev(nextChar);
            
            // Apply shaping rules
            let shapedChar = this.applyShapingRules(char, letterData, prevConnects, nextConnects);
            
            result.push(shapedChar);
        }
        
        // Apply ligatures
        return this.applyLigatures(result.join(''));
    }

    /**
     * Check if character can connect to next
     * @param {string} char - Character to check
     * @returns {boolean} True if can connect
     */
    canConnectToNext(char) {
        if (!char || !isArabicLetter(char)) return false;
        const letterData = ArabicCharacterData.letters[char];
        return letterData && letterData.medial !== null;
    }

    /**
     * Check if character can connect from previous
     * @param {string} char - Character to check
     * @returns {boolean} True if can connect from previous
     */
    canConnectFromPrev(char) {
        if (!char || !isArabicLetter(char)) return false;
        const letterData = ArabicCharacterData.letters[char];
        return letterData && letterData.final !== null;
    }

    /**
     * Apply shaping rules to character
     * @param {string} char - Character to shape
     * @param {object} letterData - Letter data
     * @param {boolean} prevConnects - Previous character connects
     * @param {boolean} nextConnects - Next character connects
     * @returns {string} Shaped character
     */
    applyShapingRules(char, letterData, prevConnects, nextConnects) {
        if (!prevConnects && !nextConnects) {
            return letterData.isolated || char;
        } else if (!prevConnects && nextConnects) {
            return letterData.initial || char;
        } else if (prevConnects && !nextConnects) {
            return letterData.final || char;
        } else {
            return letterData.medial || char;
        }
    }

    /**
     * Apply Arabic ligatures
     * @param {string} text - Shaped text
     * @returns {string} Text with ligatures
     */
    applyLigatures(text) {
        let result = text;
        
        for (const [ligature, replacement] of Object.entries(this.ligatures)) {
            result = result.replace(new RegExp(ligature, 'g'), replacement);
        }
        
        return result;
    }

    /**
     * Process entire text with shaping     * @param {string} text - Input text
     * @returns {string} Fully shaped text
     */
    process(text) {
        if (!text) return '';
        
        // Split into lines
        const lines = text.split('\n');
        
        // Process each line
        const shapedLines = lines.map(line => {
            // Split into words
            const words = line.split(/(\s+)/);
            
            // Shape each Arabic word
            const shapedWords = words.map(word => {
                if (this.containsArabic(word)) {
                    return this.shape(word);
                }
                return word;
            });
            
            return shapedWords.join('');
        });
        
        return shapedLines.join('\n');
    }

    /**
     * Check if string contains Arabic characters
     * @param {string} text - Text to check
     * @returns {boolean} True if contains Arabic
     */
    containsArabic(text) {
        for (const char of text) {
            if (isArabicLetter(char)) return true;
        }
        return false;
    }
}

export default ShapingEngine;