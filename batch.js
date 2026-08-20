// js/batch.js
// Batch conversion processor
import { ArabicTextEngine } from './arabic-engine.js';
import { profileManager } from './profiles.js';

export class BatchConverter {
    constructor() {
        this.engine = new ArabicTextEngine();
    }

    /**
     * Convert multiple lines of text
     * @param {string} text - Multi-line text
     * @param {string} profileId - Profile ID to use
     * @returns {object} Conversion results
     */
    convertBatch(text, profileId) {
        const profile = profileManager.getProfileById(profileId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        
        // Split into lines
        const lines = text.split('\n');
        
        // Convert each line
        const results = lines.map((line, index) => {
            try {
                const converted = this.engine.convert(line, profile);
                return {
                    index,
                    original: line,
                    converted,
                    success: true
                };
            } catch (error) {
                return {
                    index,
                    original: line,
                    converted: line,
                    success: false,
                    error: error.message
                };
            }
        });
        
        return {
            lines: results,
            totalLines: lines.length,
            successfulLines: results.filter(r => r.success).length,
            failedLines: results.filter(r => !r.success).length
        };
    }

    /**
     * Generate download content
     * @param {object} results - Batch results
     * @param {string} format - Output format
     * @returns {string} Downloadable content
     */
    generateDownloadContent(results, format = 'txt') {
        const lines = results.lines;
        
        switch (format) {
            case 'txt':
                return lines.map(line => line.converted).join('\n');
                
            case 'json':
                return JSON.stringify({
                    totalLines: results.totalLines,
                    successfulLines: results.successfulLines,
                    failedLines: results.failedLines,
                    lines: lines.map(line => ({
                        original: line.original,
                        converted: line.converted,
                        success: line.success
                    }))
                }, null, 2);
                
            default:
                return lines.map(line => line.converted).join('\n');
        }
    }
}

export default BatchConverter;