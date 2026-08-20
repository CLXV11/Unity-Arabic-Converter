// js/analyzer.js
// Game text analyzer
import { ArabicTextEngine } from './arabic-engine.js';

export class GameTextAnalyzer {
    constructor() {
        this.engine = new ArabicTextEngine();
    }

    /**
     * Analyze game text issues
     * @param {string} original - Original Arabic text
     * @param {string} gameOutput - Text as displayed in game
     * @returns {object} Analysis results
     */
    analyze(original, gameOutput) {
        if (!original || !gameOutput) {
            return {
                issues: [],
                suggestions: [],
                confidence: 'unknown'
            };
        }
        
        const issues = [];
        const suggestions = [];
        
        // Check 1: Arabic characters detected
        const hasArabic = this.engine.detectArabic(original);
        issues.push({
            type: 'arabic_detection',
            status: hasArabic ? '✓' : '✗',
            label: 'Arabic characters detected',
            labelAr: 'تم اكتشاف أحرف عربية',
            confidence: 'confirmed'
        });
        
        // Check 2: RTL text detection
        const isRTL = this.engine.detectRTL(original);
        issues.push({
            type: 'rtl_detection',
            status: isRTL ? '✓' : '✗',
            label: 'RTL text detected',
            labelAr: 'تم اكتشاف نص من اليمين لليسار',
            confidence: isRTL ? 'confirmed' : 'unknown'
        });
        
        // Check 3: Character connections
        const disconnected = this.checkDisconnected(original, gameOutput);
        issues.push({
            type: 'character_connection',
            status: disconnected ? '⚠' : '✓',
            label: disconnected ? 'Characters may be disconnected' : 'Characters appear connected',
            labelAr: disconnected ? 'قد تكون الأحرف منفصلة' : 'تبدو الأحرف متصلة',
            confidence: disconnected ? 'likely' : 'confirmed'
        });
        
        // Check 4: Renderer support
        issues.push({
            type: 'renderer_support',
            status: '⚠',
            label: 'Renderer may not support Arabic',
            labelAr: 'قد لا يدعم العارض اللغة العربية',
            confidence: 'possible'
        });
        
        // Check 5: Font glyph support
        issues.push({
            type: 'font_support',
            status: '⚠',
            label: 'Font may not contain Arabic glyphs',
            labelAr: 'قد لا يحتوي الخط على حروف عربية',
            confidence: 'possible'
        });
        
        // Generate suggestions
        if (disconnected) {
            suggestions.push({
                label: 'Try using a profile with Arabic shaping',
                labelAr: 'جرب استخدام ملف مع تشكيل عربي'
            });
            suggestions.push({
                label: 'Consider using TextMeshPro with Arabic font',
                labelAr: 'فكر في استخدام TextMeshPro مع خط عربي'
            });
        }
        
        if (!isRTL) {
            suggestions.push({
                label: 'Enable RTL support in your text renderer',
                labelAr: 'قم بتفعيل دعم RTL في عارض النصوص'
            });
        }
        
        return {
            issues,
            suggestions,
            confidence: this.calculateOverallConfidence(issues)
        };
    }

    /**
     * Check if characters appear disconnected
     * @param {string} original - Original text
     * @param {string} gameOutput - Game output
     * @returns {boolean} True if characters appear disconnected
     */
    checkDisconnected(original, gameOutput) {
        // Compare character positions
        const originalArabic = [...original].filter(char => this.engine.detectArabic(char));
        const outputArabic = [...gameOutput].filter(char => this.engine.detectArabic(char));
        
        // If output has fewer Arabic characters, some may be lost
        if (outputArabic.length < originalArabic.length) {
            return true;
        }
        
        // Check if Arabic characters are separated by spaces incorrectly
        const originalJoined = original.replace(/\s+/g, '');
        const outputJoined = gameOutput.replace(/\s+/g, '');
        
        return originalJoined.length !== outputJoined.length;
    }

    /**
     * Calculate overall confidence
     * @param {array} issues - Array of issues
     * @returns {string} Overall confidence level
     */
    calculateOverallConfidence(issues) {
        const confirmedCount = issues.filter(issue => issue.confidence === 'confirmed').length;
        const likelyCount = issues.filter(issue => issue.confidence === 'likely').length;
        
        if (confirmedCount >= 3) return 'high';
        if (confirmedCount + likelyCount >= 3) return 'medium';
        return 'low';
    }
}

export default GameTextAnalyzer;