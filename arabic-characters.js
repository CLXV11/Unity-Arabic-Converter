// js/data/arabic-characters.js
// Arabic character data and mappings

export const ArabicCharacterData = {
    // Basic Arabic letters with their Unicode data
    letters: {
        'ا': { code: 0x0627, name: 'ARABIC LETTER ALEF', isolated: 'ا', final: 'ـا', initial: null, medial: null },
        'ب': { code: 0x0628, name: 'ARABIC LETTER BEH', isolated: 'ب', final: 'ـب', initial: 'بـ', medial: 'ـبـ' },
        'ت': { code: 0x062A, name: 'ARABIC LETTER TEH', isolated: 'ت', final: 'ـت', initial: 'تـ', medial: 'ـتـ' },
        'ث': { code: 0x062B, name: 'ARABIC LETTER THEH', isolated: 'ث', final: 'ـث', initial: 'ثـ', medial: 'ـثـ' },
        'ج': { code: 0x062C, name: 'ARABIC LETTER JEEM', isolated: 'ج', final: 'ـج', initial: 'جـ', medial: 'ـجـ' },
        'ح': { code: 0x062D, name: 'ARABIC LETTER HAH', isolated: 'ح', final: 'ـح', initial: 'حـ', medial: 'ـحـ' },
        'خ': { code: 0x062E, name: 'ARABIC LETTER KHAH', isolated: 'خ', final: 'ـخ', initial: 'خـ', medial: 'ـخـ' },
        'د': { code: 0x062F, name: 'ARABIC LETTER DAL', isolated: 'د', final: 'ـد', initial: null, medial: null },
        'ذ': { code: 0x0630, name: 'ARABIC LETTER THAL', isolated: 'ذ', final: 'ـذ', initial: null, medial: null },
        'ر': { code: 0x0631, name: 'ARABIC LETTER REH', isolated: 'ر', final: 'ـر', initial: null, medial: null },
        'ز': { code: 0x0632, name: 'ARABIC LETTER ZAIN', isolated: 'ز', final: 'ـز', initial: null, medial: null },
        'س': { code: 0x0633, name: 'ARABIC LETTER SEEN', isolated: 'س', final: 'ـس', initial: 'سـ', medial: 'ـسـ' },
        'ش': { code: 0x0634, name: 'ARABIC LETTER SHEEN', isolated: 'ش', final: 'ـش', initial: 'شـ', medial: 'ـشـ' },
        'ص': { code: 0x0635, name: 'ARABIC LETTER SAD', isolated: 'ص', final: 'ـص', initial: 'صـ', medial: 'ـصـ' },
        'ض': { code: 0x0636, name: 'ARABIC LETTER DAD', isolated: 'ض', final: 'ـض', initial: 'ضـ', medial: 'ـضـ' },
        'ط': { code: 0x0637, name: 'ARABIC LETTER TAH', isolated: 'ط', final: 'ـط', initial: 'طـ', medial: 'ـطـ' },
        'ظ': { code: 0x0638, name: 'ARABIC LETTER ZAH', isolated: 'ظ', final: 'ـظ', initial: 'ظـ', medial: 'ـظـ' },
        'ع': { code: 0x0639, name: 'ARABIC LETTER AIN', isolated: 'ع', final: 'ـع', initial: 'عـ', medial: 'ـعـ' },
        'غ': { code: 0x063A, name: 'ARABIC LETTER GHAIN', isolated: 'غ', final: 'ـغ', initial: 'غـ', medial: 'ـغـ' },
        'ف': { code: 0x0641, name: 'ARABIC LETTER FEH', isolated: 'ف', final: 'ـف', initial: 'فـ', medial: 'ـفـ' },
        'ق': { code: 0x0642, name: 'ARABIC LETTER QAF', isolated: 'ق', final: 'ـق', initial: 'قـ', medial: 'ـقـ' },
        'ك': { code: 0x0643, name: 'ARABIC LETTER KAF', isolated: 'ك', final: 'ـك', initial: 'كـ', medial: 'ـكـ' },
        'ل': { code: 0x0644, name: 'ARABIC LETTER LAM', isolated: 'ل', final: 'ـل', initial: 'لـ', medial: 'ـلـ' },
        'م': { code: 0x0645, name: 'ARABIC LETTER MEEM', isolated: 'م', final: 'ـم', initial: 'مـ', medial: 'ـمـ' },
        'ن': { code: 0x0646, name: 'ARABIC LETTER NOON', isolated: 'ن', final: 'ـن', initial: 'نـ', medial: 'ـنـ' },
        'ه': { code: 0x0647, name: 'ARABIC LETTER HEH', isolated: 'ه', final: 'ـه', initial: 'هـ', medial: 'ـهـ' },
        'و': { code: 0x0648, name: 'ARABIC LETTER WAW', isolated: 'و', final: 'ـو', initial: null, medial: null },
        'ي': { code: 0x064A, name: 'ARABIC LETTER YEH', isolated: 'ي', final: 'ـي', initial: 'يـ', medial: 'ـيـ' },
        'ى': { code: 0x0649, name: 'ARABIC LETTER ALEF MAKSURA', isolated: 'ى', final: 'ـى', initial: null, medial: null },
        'ة': { code: 0x0629, name: 'ARABIC LETTER TEH MARBUTA', isolated: 'ة', final: 'ـة', initial: null, medial: null },
        'ء': { code: 0x0621, name: 'ARABIC LETTER HAMZA', isolated: 'ء', final: 'ـء', initial: null, medial: null },
        'أ': { code: 0x0623, name: 'ARABIC LETTER ALEF WITH HAMZA ABOVE', isolated: 'أ', final: 'ـأ', initial: null, medial: null },
        'إ': { code: 0x0625, name: 'ARABIC LETTER ALEF WITH HAMZA BELOW', isolated: 'إ', final: 'ـإ', initial: null, medial: null },
        'آ': { code: 0x0622, name: 'ARABIC LETTER ALEF WITH MADDA ABOVE', isolated: 'آ', final: 'ـآ', initial: null, medial: null },
        'ؤ': { code: 0x0624, name: 'ARABIC LETTER WAW WITH HAMZA ABOVE', isolated: 'ؤ', final: 'ـؤ', initial: null, medial: null },
        'ئ': { code: 0x0626, name: 'ARABIC LETTER YEH WITH HAMZA ABOVE', isolated: 'ئ', final: 'ـئ', initial: 'ئـ', medial: 'ـئـ' }
    },

    // Diacritics
    diacritics: {
        'َ': { code: 0x064E, name: 'ARABIC FATHA' },
        'ً': { code: 0x064B, name: 'ARABIC FATHATAN' },
        'ُ': { code: 0x064F, name: 'ARABIC DAMMA' },
        'ٌ': { code: 0x064C, name: 'ARABIC DAMMATAN' },
        'ِ': { code: 0x0650, name: 'ARABIC KASRA' },
        'ٍ': { code: 0x064D, name: 'ARABIC KASRATAN' },
        'ْ': { code: 0x0652, name: 'ARABIC SUKUN' },
        'ّ': { code: 0x0651, name: 'ARABIC SHADDA' }
    },

    // Presentation forms
    presentationForms: {
        // Isolated forms
        'ﺀ': 0xFE80, 'ﺁ': 0xFE81, 'ﺂ': 0xFE82, 'ﺃ': 0xFE83, 'ﺄ': 0xFE84,
        'ﺅ': 0xFE85, 'ﺆ': 0xFE86, 'ﺇ': 0xFE87, 'ﺈ': 0xFE88, 'ﺉ': 0xFE89,
        'ﺊ': 0xFE8A, 'ﺋ': 0xFE8B, 'ﺌ': 0xFE8C, 'ﺍ': 0xFE8D, 'ﺎ': 0xFE8E,
        'ﺏ': 0xFE8F, 'ﺐ': 0xFE90, 'ﺑ': 0xFE91, 'ﺒ': 0xFE92, 'ﺓ': 0xFE93,
        'ﺔ': 0xFE94, 'ﺕ': 0xFE95, 'ﺖ': 0xFE96, 'ﺗ': 0xFE97, 'ﺘ': 0xFE98,
        'ﺙ': 0xFE99, 'ﺚ': 0xFE9A, 'ﺛ': 0xFE9B, 'ﺜ': 0xFE9C, 'ﺝ': 0xFE9D,
        'ﺞ': 0xFE9E, 'ﺟ': 0xFE9F, 'ﺠ': 0xFEA0, 'ﺡ': 0xFEA1, 'ﺢ': 0xFEA2,
        'ﺣ': 0xFEA3, 'ﺤ': 0xFEA4, 'ﺥ': 0xFEA5, 'ﺦ': 0xFEA6, 'ﺧ': 0xFEA7,
        'ﺨ': 0xFEA8, 'ﺩ': 0xFEA9, 'ﺪ': 0xFEAA, 'ﺫ': 0xFEAB, 'ﺬ': 0xFEAC,
        'ﺭ': 0xFEAD, 'ﺮ': 0xFEAE, 'ﺯ': 0xFEAF, 'ﺰ': 0xFEB0, 'ﺱ': 0xFEB1,
        'ﺲ': 0xFEB2, 'ﺳ': 0xFEB3, 'ﺴ': 0xFEB4, 'ﺵ': 0xFEB5, 'ﺶ': 0xFEB6,
        'ﺷ': 0xFEB7, 'ﺸ': 0xFEB8, 'ﺹ': 0xFEB9, 'ﺺ': 0xFEBA, 'ﺻ': 0xFEBB,
        'ﺼ': 0xFEBC, 'ﺽ': 0xFEBD, 'ﺾ': 0xFEBE, 'ﺿ': 0xFEBF, 'ﻀ': 0xFEC0,
        'ﻁ': 0xFEC1, 'ﻂ': 0xFEC2, 'ﻃ': 0xFEC3, 'ﻄ': 0xFEC4, 'ﻅ': 0xFEC5,
        'ﻆ': 0xFEC6, 'ﻇ': 0xFEC7, 'ﻈ': 0xFEC8, 'ﻉ': 0xFEC9, 'ﻊ': 0xFECA,
        'ﻋ': 0xFECB, 'ﻌ': 0xFECC, 'ﻍ': 0xFECD, 'ﻎ': 0xFECE, 'ﻏ': 0xFECF,
        'ﻐ': 0xFED0, 'ﻑ': 0xFED1, 'ﻒ': 0xFED2, 'ﻓ': 0xFED3, 'ﻔ': 0xFED4,
        'ﻕ': 0xFED5, 'ﻖ': 0xFED6, 'ﻗ': 0xFED7, 'ﻘ': 0xFED8, 'ﻙ': 0xFED9,
        'ﻚ': 0xFEDA, 'ﻛ': 0xFEDB, 'ﻜ': 0xFEDC, 'ﻝ': 0xFEDD, 'ﻞ': 0xFEDE,
        'ﻟ': 0xFEDF, 'ﻠ': 0xFEE0, 'ﻡ': 0xFEE1, 'ﻢ': 0xFEE2, 'ﻣ': 0xFEE3,
        'ﻤ': 0xFEE4, 'ﻥ': 0xFEE5, 'ﻦ': 0xFEE6, 'ﻧ': 0xFEE7, 'ﻨ': 0xFEE8,
        'ﻩ': 0xFEE9, 'ﻪ': 0xFEEA, 'ﻫ': 0xFEEB, 'ﻬ': 0xFEEC, 'ﻭ': 0xFEED,
        'ﻮ': 0xFEEE, 'ﻯ': 0xFEEF, 'ﻰ': 0xFEF0, 'ﻱ': 0xFEF1, 'ﻲ': 0xFEF2,
        'ﻳ': 0xFEF3, 'ﻴ': 0xFEF4
    }
};

export const UnicodeBlockRanges = {
    arabic: [0x0600, 0x06FF],
    arabicSupplement: [0x0750, 0x077F],
    arabicExtendedA: [0x08A0, 0x08FF],
    arabicPresentationFormsA: [0xFB50, 0xFDFF],
    arabicPresentationFormsB: [0xFE70, 0xFEFF]
};

export function isArabicChar(char) {
    const code = char.codePointAt(0);
    return (code >= 0x0600 && code <= 0x06FF) ||
           (code >= 0x0750 && code <= 0x077F) ||
           (code >= 0x08A0 && code <= 0x08FF) ||
           (code >= 0xFB50 && code <= 0xFDFF) ||
           (code >= 0xFE70 && code <= 0xFEFF);
}

export function isArabicLetter(char) {
    return char in ArabicCharacterData.letters;
}

export function isArabicDiacritic(char) {
    return char in ArabicCharacterData.diacritics;
}