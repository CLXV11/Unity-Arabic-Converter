// js/app.js
// Main application logic
import { ArabicTextEngine } from './arabic-engine.js';
import { UnicodeEngine } from './unicode-engine.js';
import { BidiEngine } from './bidi-engine.js';
import { ShapingEngine } from './shaping-engine.js';
import { profileManager } from './profiles.js';
import { GameTextAnalyzer } from './analyzer.js';
import { BatchConverter } from './batch.js';
import { FileHandler } from './file-handler.js';
import { storage } from './storage.js';

class UnityArabicConverterApp {
    constructor() {
        this.engine = new ArabicTextEngine();
        this.unicodeEngine = new UnicodeEngine();
        this.bidiEngine = new BidiEngine();
        this.shapingEngine = new ShapingEngine();
        this.analyzer = new GameTextAnalyzer();
        this.batchConverter = new BatchConverter();
        
        this.language = storage.get('language', 'ar');
        this.theme = storage.get('theme', 'dark');
        this.currentProfile = storage.get('currentProfile', 'unity-legacy');
        this.autoConvert = storage.get('autoConvert', false);
        
        this.init();
    }

    async init() {
        this.setupDOM();
        this.setupEventListeners();
        this.loadProfiles();
        this.applySettings();
        this.updateUI();

        // Register the offline cache only when the app is served over HTTP(S).
        // Service workers are intentionally unavailable on file:// URLs.
        if ('serviceWorker' in navigator && window.isSecureContext) {
            navigator.serviceWorker.register('./service-worker.js').catch((error) => {
                console.warn('Service worker registration failed:', error);
            });
        }
    }

    setupDOM() {
        // Cache DOM elements
        this.elements = {
            inputText: document.getElementById('inputText'),
            outputText: document.getElementById('outputText'),
            convertBtn: document.getElementById('convertBtn'),
            clearBtn: document.getElementById('clearBtn'),
            pasteBtn: document.getElementById('pasteBtn'),
            copyBtn: document.getElementById('copyBtn'),
            profileSelect: document.getElementById('profileSelect'),
            analysisDisplay: document.getElementById('analysisDisplay'),
            themeToggle: document.getElementById('themeToggle'),
            langAr: document.getElementById('langAr'),
            langEn: document.getElementById('langEn'),
            autoConvert: document.getElementById('autoConvert'),
            showUnicode: document.getElementById('showUnicode'),
            showDiagnostics: document.getElementById('showDiagnostics'),
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modalTitle'),
            modalBody: document.getElementById('modalBody'),
            modalClose: document.getElementById('modalClose'),
            toast: document.getElementById('toast'),
            charInspectorBtn: document.getElementById('charInspectorBtn'),
            unicodeInspectorBtn: document.getElementById('unicodeInspectorBtn'),
            gameAnalyzerBtn: document.getElementById('gameAnalyzerBtn'),
            batchConverterBtn: document.getElementById('batchConverterBtn'),
            fileConverterBtn: document.getElementById('fileConverterBtn'),
            customProfilesBtn: document.getElementById('customProfilesBtn')
        };
    }

    setupEventListeners() {
        // Conversion
        this.elements.convertBtn.addEventListener('click', () => this.convert());
        this.elements.inputText.addEventListener('input', () => {
            if (this.autoConvert) this.convert();
            this.analyzeInput();
        });
        
        // Profile change
        this.elements.profileSelect.addEventListener('change', (e) => {
            this.currentProfile = e.target.value;
            storage.set('currentProfile', this.currentProfile);
            if (this.autoConvert && this.elements.inputText.value) {
                this.convert();
            }
        });
        
        // Clear
        this.elements.clearBtn.addEventListener('click', () => {
            this.elements.inputText.value = '';
            this.elements.outputText.value = '';
            this.elements.analysisDisplay.innerHTML = '';
        });
        
        // Paste
        this.elements.pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                this.elements.inputText.value = text;
                if (this.autoConvert) this.convert();
                this.analyzeInput();
            } catch (error) {
                this.showToast('فشل اللصق من الحافظة', 'error');
            }
        });
        
        // Copy
        this.elements.copyBtn.addEventListener('click', () => {
            const output = this.elements.outputText.value;
            if (!output) return;
            if (!navigator.clipboard?.writeText) {
                this.showToast(this.language === 'ar' ? 'النسخ غير مدعوم في هذا المتصفح' : 'Clipboard is not supported in this browser', 'error');
                return;
            }
            navigator.clipboard.writeText(output)
                .then(() => this.showToast(this.language === 'ar' ? 'تم النسخ بنجاح' : 'Copied successfully', 'success'))
                .catch(() => this.showToast(this.language === 'ar' ? 'فشل النسخ' : 'Copy failed', 'error'));
        });
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            storage.set('theme', this.theme);
            this.applySettings();
        });
        
        // Language
        this.elements.langAr.addEventListener('click', () => this.setLanguage('ar'));
        this.elements.langEn.addEventListener('click', () => this.setLanguage('en'));
        
        // Settings
        this.elements.autoConvert.addEventListener('change', (e) => {
            this.autoConvert = e.target.checked;
            storage.set('autoConvert', this.autoConvert);
        });

        this.elements.showUnicode.addEventListener('change', (e) => {
            storage.set('showUnicode', e.target.checked);
        });

        this.elements.showDiagnostics.addEventListener('change', (e) => {
            storage.set('showDiagnostics', e.target.checked);
            this.analyzeInput();
        });
        
        // Tools
        this.elements.charInspectorBtn.addEventListener('click', () => this.openCharInspector());
        this.elements.unicodeInspectorBtn.addEventListener('click', () => this.openUnicodeInspector());
        this.elements.gameAnalyzerBtn.addEventListener('click', () => this.openGameAnalyzer());
        this.elements.batchConverterBtn.addEventListener('click', () => this.openBatchConverter());
        this.elements.fileConverterBtn.addEventListener('click', () => this.openFileConverter());
        this.elements.customProfilesBtn.addEventListener('click', () => this.openCustomProfiles());
        
        // Modal
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });
    }

    loadProfiles() {
        const profiles = profileManager.getAllProfiles();
        this.elements.profileSelect.innerHTML = '';
        
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            option.textContent = this.language === 'ar' ? (profile.nameAr || profile.name) : profile.name;
            this.elements.profileSelect.appendChild(option);
        });
        
        this.elements.profileSelect.value = this.currentProfile;
    }

    applySettings() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Apply language
        document.documentElement.setAttribute('lang', this.language);
        document.documentElement.setAttribute('dir', this.language === 'ar' ? 'rtl' : 'ltr');
        
        // Apply settings
        this.elements.autoConvert.checked = this.autoConvert;
        this.elements.showUnicode.checked = storage.get('showUnicode', true);
        this.elements.showDiagnostics.checked = storage.get('showDiagnostics', true);
        
        // Update language buttons
        this.elements.langAr.classList.toggle('active', this.language === 'ar');
        this.elements.langEn.classList.toggle('active', this.language === 'en');
    }

    setLanguage(lang) {
        this.language = lang;
        storage.set('language', lang);
        this.applySettings();
        this.updateUI();
        this.loadProfiles();
    }

    updateUI() {
        const isArabic = this.language === 'ar';
        
        // Update main texts
        document.getElementById('mainTitle').textContent = isArabic ? 'محول النصوص' : 'Text Converter';
        document.getElementById('inputLabel').textContent = isArabic ? 'النص الأصلي' : 'Original Text';
        document.getElementById('outputLabel').textContent = isArabic ? 'النتيجة' : 'Result';
        document.getElementById('profileLabel').textContent = isArabic ? 'ملف التحويل' : 'Conversion Profile';
        document.getElementById('toolsTitle').textContent = isArabic ? 'أدوات متقدمة' : 'Advanced Tools';
        document.getElementById('settingsTitle').textContent = isArabic ? 'الإعدادات' : 'Settings';
        
        // Update buttons
        document.querySelector('#convertBtn span').textContent = isArabic ? 'تحويل' : 'Convert';
        document.querySelector('#clearBtn span').textContent = isArabic ? 'مسح' : 'Clear';
        document.querySelector('#pasteBtn span').textContent = isArabic ? 'لصق' : 'Paste';
        document.querySelector('#copyBtn span').textContent = isArabic ? 'نسخ' : 'Copy';
        
        // Update placeholders
        this.elements.inputText.placeholder = isArabic ? 'اكتب النص العربي هنا...' : 'Type Arabic text here...';
        
        // Update tool buttons
        document.querySelector('#charInspectorBtn span').textContent = isArabic ? 'فحص الأحرف' : 'Character Inspector';
        document.querySelector('#unicodeInspectorBtn span').textContent = isArabic ? 'مفتش Unicode' : 'Unicode Inspector';
        document.querySelector('#gameAnalyzerBtn span').textContent = isArabic ? 'محلل النصوص' : 'Game Analyzer';
        document.querySelector('#batchConverterBtn span').textContent = isArabic ? 'تحويل دفعة' : 'Batch Converter';
        document.querySelector('#fileConverterBtn span').textContent = isArabic ? 'محول الملفات' : 'File Converter';
        document.querySelector('#customProfilesBtn span').textContent = isArabic ? 'الملفات المخصصة' : 'Custom Profiles';
    }

    convert() {
        const input = this.elements.inputText.value;
        if (!input) {
            this.showToast(this.language === 'ar' ? 'الرجاء إدخال نص أولاً' : 'Please enter text first', 'error');
            return;
        }
        
        try {
            const profile = profileManager.getProfileById(this.currentProfile);
            if (!profile) {
                throw new Error('Profile not found');
            }
            
            const output = this.engine.convert(input, profile);
            this.elements.outputText.value = output;
            
            // Show warning if profile has one
            if (profile.warningAr && this.language === 'ar') {
                this.showToast(profile.warningAr, 'warning');
            } else if (profile.warning && this.language === 'en') {
                this.showToast(profile.warning, 'warning');
            }
            
        } catch (error) {
            console.error('Conversion failed:', error);
            this.showToast(
                this.language === 'ar' ? 'فشل التحويل. قد لا يدعم الملف المحدد هذا النص.' : 'Conversion failed. The selected profile may not support this text.',
                'error'
            );
            this.elements.outputText.value = input; // Restore original
        }
    }

    analyzeInput() {
        const input = this.elements.inputText.value;
        if (!input || !this.elements.showDiagnostics.checked) {
            this.elements.analysisDisplay.innerHTML = '';
            return;
        }
        
        const analysis = this.engine.analyze(input);
        const isArabic = this.language === 'ar';
        
        const items = [
            {
                label: isArabic ? 'عربي:' : 'Arabic:',
                value: analysis.hasArabic ? (isArabic ? 'نعم' : 'YES') : (isArabic ? 'لا' : 'NO')
            },
            {
                label: isArabic ? 'RTL:' : 'RTL:',
                value: analysis.isRTL ? (isArabic ? 'نعم' : 'YES') : (isArabic ? 'لا' : 'NO')
            },
            {
                label: isArabic ? 'لاتيني:' : 'Latin:',
                value: analysis.hasLatin ? (isArabic ? 'نعم' : 'YES') : (isArabic ? 'لا' : 'NO')
            },
            {
                label: isArabic ? 'أرقام:' : 'Numbers:',
                value: analysis.hasNumbers ? (isArabic ? 'نعم' : 'YES') : (isArabic ? 'لا' : 'NO')
            },
            {
                label: isArabic ? 'نص مختلط:' : 'Mixed Text:',
                value: analysis.isMixed ? (isArabic ? 'نعم' : 'YES') : (isArabic ? 'لا' : 'NO')
            }
        ];
        
        this.elements.analysisDisplay.innerHTML = items.map(item => `
            <div class="analysis-item">
                <span class="analysis-label">${item.label}</span>
                <span class="analysis-value">${item.value}</span>
            </div>
        `).join('');
    }

    openCharInspector() {
        const input = this.elements.inputText.value;
        if (!input) {
            this.showToast(this.language === 'ar' ? 'الرجاء إدخال نص أولاً' : 'Please enter text first', 'error');
            return;
        }
        
        const isArabic = this.language === 'ar';
        this.elements.modalTitle.textContent = isArabic ? 'فحص الأحرف' : 'Character Inspector';
        
        const chars = [...input];
        this.elements.modalBody.innerHTML = `
            <div class="char-inspector">
                ${chars.map(char => {
                    const info = this.unicodeEngine.getCharacterInfo(char);
                    const forms = this.unicodeEngine.getArabicForms(char);
                    
                    return `
                        <div class="char-card">
                            <div class="char-display">${char}</div>
                            <div class="char-info">
                                <div><strong>${isArabic ? 'Unicode:' : 'Unicode:'}</strong> ${info.codePoint}</div>
                                <div><strong>${isArabic ? 'الاسم:' : 'Name:'}</strong> ${info.name}</div>
                                <div><strong>${isArabic ? 'سداسي عشري:' : 'Hex:'}</strong> ${info.hex}</div>
                                <div><strong>${isArabic ? 'عشري:' : 'Decimal:'}</strong> ${info.decimal}</div>
                                ${forms ? `
                                    <div class="char-forms">
                                        <div><strong>${isArabic ? 'معزول:' : 'Isolated:'}</strong> ${forms.isolated}</div>
                                        <div><strong>${isArabic ? 'بدائي:' : 'Initial:'}</strong> ${forms.initial}</div>
                                        <div><strong>${isArabic ? 'وسطي:' : 'Medial:'}</strong> ${forms.medial}</div>
                                        <div><strong>${isArabic ? 'نهائي:' : 'Final:'}</strong> ${forms.final}</div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        this.openModal();
    }

    openUnicodeInspector() {
        const input = this.elements.inputText.value;
        if (!input) {
            this.showToast(this.language === 'ar' ? 'الرجاء إدخال نص أولاً' : 'Please enter text first', 'error');
            return;
        }
        
        const isArabic = this.language === 'ar';
        this.elements.modalTitle.textContent = isArabic ? 'مفتش Unicode' : 'Unicode Inspector';
        
        const chars = [...input];
        this.elements.modalBody.innerHTML = `
            <div class="unicode-table">
                <table>
                    <thead>
                        <tr>
                            <th>${isArabic ? 'الحرف' : 'Char'}</th>
                            <th>Code Point</th>
                            <th>Hex</th>
                            <th>Decimal</th>
                            <th>UTF-8</th>
                            <th>UTF-16</th>
                            <th>${isArabic ? 'الاسم' : 'Name'}</th>
                            <th>${isArabic ? 'الفئة' : 'Class'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${chars.map(char => {
                            const info = this.unicodeEngine.getCharacterInfo(char);
                            return `
                                <tr>
                                    <td class="char-cell">${char}</td>
                                    <td>${info.codePoint}</td>
                                    <td>${info.hex}</td>
                                    <td>${info.decimal}</td>
                                    <td>${info.utf8.join(' ')}</td>
                                    <td>${info.utf16.join(' ')}</td>
                                    <td>${info.name}</td>
                                    <td>${info.bidiClass}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        this.openModal();
    }

    openGameAnalyzer() {
        const input = this.elements.inputText.value;
        if (!input) {
            this.showToast(this.language === 'ar' ? 'الرجاء إدخال نص أولاً' : 'Please enter text first', 'error');
            return;
        }
        
        const isArabic = this.language === 'ar';
        this.elements.modalTitle.textContent = isArabic ? 'محلل النصوص' : 'Game Text Analyzer';
        
        this.elements.modalBody.innerHTML = `
            <div class="game-analyzer">
                <div class="analyzer-input">
                    <label>${isArabic ? 'النص الأصلي:' : 'Original Text:'}</label>
                    <textarea id="analyzerOriginal" class="text-input">${input}</textarea>
                </div>
                <div class="analyzer-input">
                    <label>${isArabic ? 'النص في اللعبة:' : 'Game Output:'}</label>
                    <textarea id="analyzerGameOutput" class="text-input" placeholder="${isArabic ? 'الصق النص كما ظهر في اللعبة...' : 'Paste text as shown in game...'}"></textarea>
                </div>
                <button id="runAnalysis" class="btn-primary">
                    <span>${isArabic ? 'تحليل' : 'Analyze'}</span>
                </button>
                <div id="analysisResults"></div>
            </div>
        `;
        
        this.openModal();
        
        document.getElementById('runAnalysis').addEventListener('click', () => {
            const original = document.getElementById('analyzerOriginal').value;
            const gameOutput = document.getElementById('analyzerGameOutput').value;
            
            if (!gameOutput) {
                this.showToast(isArabic ? 'الرجاء إدخال النص من اللعبة' : 'Please enter game output', 'error');
                return;
            }
            
            const results = this.analyzer.analyze(original, gameOutput);
            this.displayAnalysisResults(results);
        });
    }

    displayAnalysisResults(results) {
        const isArabic = this.language === 'ar';
        const resultsDiv = document.getElementById('analysisResults');
        
        resultsDiv.innerHTML = `
            <div class="analysis-results">
                <h4>${isArabic ? 'المشاكل المحتملة:' : 'Possible Problems:'}</h4>
                ${results.issues.map(issue => `
                    <div class="analysis-result-item">
                        <span class="status-icon">${issue.status}</span>
                        <span>${isArabic ? (issue.labelAr || issue.label) : issue.label}</span>
                        <span class="confidence">${isArabic ? 'الثقة: ' : 'Confidence: '} ${issue.confidence}</span>
                    </div>
                `).join('')}
                
                ${results.suggestions.length > 0 ? `
                    <h4>${isArabic ? 'اقتراحات:' : 'Suggestions:'}</h4>
                    ${results.suggestions.map(suggestion => `
                        <div class="suggestion-item">
                            <span>${isArabic ? (suggestion.labelAr || suggestion.label) : suggestion.label}</span>
                        </div>
                    `).join('')}
                ` : ''}
                
                <div class="confidence-overall">
                    <strong>${isArabic ? 'الثقة الكلية:' : 'Overall Confidence:'}</strong>
                    <span>${results.confidence}</span>
                </div>
            </div>
        `;
    }

    openBatchConverter() {
        const isArabic = this.language === 'ar';
        this.elements.modalTitle.textContent = isArabic ? 'محول الدفعات' : 'Batch Converter';
        
        this.elements.modalBody.innerHTML = `
            <div class="batch-converter">
                <div class="batch-input">
                    <label>${isArabic ? 'أدخل النصوص (كل سطر على حدة):' : 'Enter texts (one per line):'}</label>
                    <textarea id="batchInput" class="text-input" rows="10" placeholder="${isArabic ? 'مرحبا\nابدأ اللعبة\nالإعدادات' : 'Hello\nStart game\nSettings'}"></textarea>
                </div>
                <div class="batch-actions">
                    <button id="convertAllBtn" class="btn-primary">
                        <span>${isArabic ? 'تحويل الكل' : 'Convert All'}</span>
                    </button>
                    <button id="copyAllBtn" class="btn-secondary">
                        <span>${isArabic ? 'نسخ الكل' : 'Copy All'}</span>
                    </button>
                    <button id="downloadBtn" class="btn-secondary">
                        <span>${isArabic ? 'تنزيل TXT' : 'Download TXT'}</span>
                    </button>
                </div>
                <div class="batch-results">
                    <textarea id="batchOutput" class="text-output" rows="10" readonly></textarea>
                </div>
            </div>
        `;
        
        this.openModal();
        
        document.getElementById('convertAllBtn').addEventListener('click', () => {
            const input = document.getElementById('batchInput').value;
            const results = this.batchConverter.convertBatch(input, this.currentProfile);
            document.getElementById('batchOutput').value = results.lines.map(line => line.converted).join('\n');
        });
        
        document.getElementById('copyAllBtn').addEventListener('click', () => {
            const output = document.getElementById('batchOutput').value;
            if (!output) return;
            if (!navigator.clipboard?.writeText) {
                this.showToast(isArabic ? 'النسخ غير مدعوم في هذا المتصفح' : 'Clipboard is not supported in this browser', 'error');
                return;
            }
            navigator.clipboard.writeText(output)
                .then(() => this.showToast(isArabic ? 'تم النسخ' : 'Copied', 'success'))
                .catch(() => this.showToast(isArabic ? 'فشل النسخ' : 'Copy failed', 'error'));
        });
        
        document.getElementById('downloadBtn').addEventListener('click', () => {
            const output = document.getElementById('batchOutput').value;
            if (output) {
                FileHandler.downloadFile(output, 'converted_text.txt', 'text/plain');
            }
        });
    }

    openFileConverter() {
        const isArabic = this.language === 'ar';
        this.elements.modalTitle.textContent = isArabic ? 'محول الملفات' : 'File Converter';
        
        this.elements.modalBody.innerHTML = `
            <div class="file-converter">
                <div class="file-upload">
                    <input type="file" id="fileInput" accept=".txt,.json,.csv,.xml" style="display: none;">
                    <button id="chooseFileBtn" class="btn-secondary">
                        <span>${isArabic ? 'اختيار ملف' : 'Choose File'}</span>
                    </button>
                    <span id="fileName"></span>
                </div>
                <div id="fileContent" class="file-content"></div>
                <div id="fileResults" class="file-results"></div>
            </div>
        `;
        
        this.openModal();
        
        document.getElementById('chooseFileBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('fileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            document.getElementById('fileName').textContent = file.name;
            
            try {
                const content = await FileHandler.readFile(file);
                const extension = FileHandler.getFileExtension(file.name);
                
                if (extension === 'json') {
                    const jsonData = JSON.parse(content);
                    const processed = FileHandler.processJSON(jsonData, (text) => {
                        const profile = profileManager.getProfileById(this.currentProfile);
                        return this.engine.convert(text, profile);
                    });
                    document.getElementById('fileResults').textContent = JSON.stringify(processed, null, 2);
                } else {
                    const profile = profileManager.getProfileById(this.currentProfile);
                    const converted = this.engine.convert(content, profile);
                    document.getElementById('fileResults').textContent = converted;
                }
            } catch (error) {
                this.showToast(isArabic ? 'فشل معالجة الملف' : 'File processing failed', 'error');
            }
        });
    }

    openCustomProfiles() {
        const isArabic = this.language === 'ar';
        this.elements.modalTitle.textContent = isArabic ? 'الملفات المخصصة' : 'Custom Profiles';
        
        const profiles = profileManager.customProfiles;
        
        this.elements.modalBody.innerHTML = `
            <div class="custom-profiles">
                <button id="newProfileBtn" class="btn-primary">
                    <span>${isArabic ? 'ملف جديد' : 'New Profile'}</span>
                </button>
                
                <div class="profiles-list">
                    ${profiles.map(profile => `
                        <div class="profile-item" data-id="${profile.id}">
                            <div class="profile-info">
                                <strong>${isArabic ? (profile.nameAr || profile.name) : profile.name}</strong>
                                <span>${profile.description || ''}</span>
                            </div>
                            <div class="profile-actions">
                                <button class="btn-secondary export-profile">${isArabic ? 'تصدير' : 'Export'}</button>
                                <button class="btn-secondary delete-profile">${isArabic ? 'حذف' : 'Delete'}</button>
                            </div>
                        </div>
                    `).join('') || `<p>${isArabic ? 'لا توجد ملفات مخصصة' : 'No custom profiles'}</p>`}
                </div>
                
                <div class="profile-form" id="profileForm" style="display: none;">
                    <div class="form-group">
                        <label>${isArabic ? 'اسم الملف:' : 'Profile Name:'}</label>
                        <input type="text" id="profileName" class="text-input">
                    </div>
                    <div class="form-group">
                        <label>${isArabic ? 'الوصف:' : 'Description:'}</label>
                        <input type="text" id="profileDescription" class="text-input">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="profileShaping" checked>
                            ${isArabic ? 'تشكيل عربي' : 'Arabic Shaping'}
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="profileBidi" checked>
                            ${isArabic ? 'معالجة Bidi' : 'Bidi Processing'}
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="profilePresentationForms">
                            ${isArabic ? 'نماذج تقديمية' : 'Presentation Forms'}
                        </label>
                    </div>
                    <button id="saveProfileBtn" class="btn-primary">
                        <span>${isArabic ? 'حفظ' : 'Save'}</span>
                    </button>
                </div>
            </div>
        `;
        
        this.openModal();
        
        // Event listeners
        document.getElementById('newProfileBtn').addEventListener('click', () => {
            document.getElementById('profileForm').style.display = 'block';
        });
        
        document.getElementById('saveProfileBtn').addEventListener('click', () => {
            const name = document.getElementById('profileName').value;
            const description = document.getElementById('profileDescription').value;
            const shaping = document.getElementById('profileShaping').checked;
            const bidi = document.getElementById('profileBidi').checked;
            const presentationForms = document.getElementById('profilePresentationForms').checked;
            
            if (!name) {
                this.showToast(isArabic ? 'الرجاء إدخال اسم الملف' : 'Please enter profile name', 'error');
                return;
            }
            
            const profile = {
                name,
                nameAr: name,
                description,
                descriptionAr: description,
                type: 'custom',
                normalize: true,
                shaping,
                bidi,
                presentationForms,
                rtlReverse: false
            };
            
            profileManager.addCustomProfile(profile);
            this.loadProfiles();
            this.openCustomProfiles(); // Refresh
        });
        
        // Export profile
        document.querySelectorAll('.export-profile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.profile-item').dataset.id;
                const exported = profileManager.exportProfile(id);
                if (exported) {
                    FileHandler.downloadFile(exported, `profile_${id}.json`, 'application/json');
                }
            });
        });
        
        // Delete profile
        document.querySelectorAll('.delete-profile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.profile-item').dataset.id;
                profileManager.removeCustomProfile(id);
                this.loadProfiles();
                this.openCustomProfiles(); // Refresh
            });
        });
    }

    openModal() {
        this.elements.modal.classList.add('active');
    }

    closeModal() {
        this.elements.modal.classList.remove('active');
    }

    showToast(message, type = 'info') {
        this.elements.toast.textContent = message;
        this.elements.toast.className = `toast ${type}`;
        this.elements.toast.classList.add('show');
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new UnityArabicConverterApp();
});