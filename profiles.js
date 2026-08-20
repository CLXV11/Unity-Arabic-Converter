// js/profiles.js
// Conversion profile definitions and management
import { storage } from './storage.js';

export class ProfileManager {
    constructor() {
        this.defaultProfiles = this.createDefaultProfiles();
        this.customProfiles = this.loadCustomProfiles();
    }

    createDefaultProfiles() {
        return [
            {
                id: 'unity-legacy',
                name: 'Unity Legacy',
                nameAr: 'Unity القديم',
                description: 'For Unity UI Text and legacy systems',
                descriptionAr: 'لنظام Unity UI Text والأنظمة القديمة',
                type: 'unity-legacy',
                normalize: true,
                shaping: true,
                bidi: true,
                presentationForms: true,
                rtlReverse: false,
                createdAt: Date.now(),
                isDefault: true
            },
            {
                id: 'textmeshpro',
                name: 'Unity TextMeshPro',
                nameAr: 'Unity TextMeshPro',
                description: 'For Unity TextMeshPro components',
                descriptionAr: 'لمكونات Unity TextMeshPro',
                type: 'textmeshpro',
                normalize: true,
                shaping: true,
                bidi: true,
                presentationForms: false,
                rtlReverse: false,
                createdAt: Date.now(),
                isDefault: true
            },
            {
                id: 'presentation-forms',
                name: 'Unicode Presentation Forms',
                nameAr: 'نماذج Unicode التقديمية',
                description: 'Convert to Arabic Presentation Forms',
                descriptionAr: 'تحويل إلى نماذج Unicode التقديمية',
                type: 'presentation-forms',
                normalize: true,
                shaping: true,
                bidi: true,
                presentationForms: true,
                rtlReverse: false,
                warning: 'This conversion may not work with every Unity text renderer.',
                warningAr: 'قد لا يعمل هذا التحويل مع كل عارض نصوص في Unity.',
                createdAt: Date.now(),
                isDefault: true
            },
            {
                id: 'rtl-processing',
                name: 'RTL Processing',
                nameAr: 'معالجة RTL',
                description: 'Basic RTL text processing',
                descriptionAr: 'معالجة أساسية للنصوص من اليمين لليسار',
                type: 'rtl-processing',
                normalize: true,
                shaping: true,
                bidi: true,
                presentationForms: false,
                rtlReverse: true,
                createdAt: Date.now(),
                isDefault: true
            }
        ];
    }

    loadCustomProfiles() {
        const stored = storage.get('customProfiles', []);
        return Array.isArray(stored) ? stored : [];
    }

    saveCustomProfiles() {
        storage.set('customProfiles', this.customProfiles);
    }

    getAllProfiles() {
        return [...this.defaultProfiles, ...this.customProfiles];
    }

    getProfileById(id) {
        return this.getAllProfiles().find(profile => profile.id === id);
    }

    addCustomProfile(profile) {
        profile.id = `custom-${Date.now()}`;
        profile.isDefault = false;
        profile.createdAt = Date.now();
        this.customProfiles.push(profile);
        this.saveCustomProfiles();
        return profile;
    }

    updateCustomProfile(id, updates) {
        const index = this.customProfiles.findIndex(profile => profile.id === id);
        if (index !== -1) {
            this.customProfiles[index] = { ...this.customProfiles[index], ...updates };
            this.saveCustomProfiles();
            return this.customProfiles[index];
        }
        return null;
    }

    removeCustomProfile(id) {
        this.customProfiles = this.customProfiles.filter(profile => profile.id !== id);
        this.saveCustomProfiles();
    }

    exportProfile(id) {
        const profile = this.getProfileById(id);
        if (!profile) return null;
        return JSON.stringify(profile, null, 2);
    }

    importProfile(jsonString) {
        try {
            const profile = JSON.parse(jsonString);
            if (!profile.name || !profile.type) {
                throw new Error('Invalid profile format');
            }
            return this.addCustomProfile(profile);
        } catch (error) {
            console.error('Failed to import profile:', error);
            return null;
        }
    }
}

export const profileManager = new ProfileManager();