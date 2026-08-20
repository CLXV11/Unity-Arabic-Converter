// js/storage.js
// Local storage management
export class StorageManager {
    constructor() {
        this.prefix = 'uatc_';
        this.available = this.checkAvailability();
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} True if available
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get value from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
        if (!this.available) return defaultValue;
        
        try {
            const fullKey = this.prefix + key;
            const value = localStorage.getItem(fullKey);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Failed to get from storage:', e);
            return defaultValue;
        }
    }

    /**
     * Set value in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} True if successful
     */
    set(key, value) {
        if (!this.available) return false;
        
        try {
            const fullKey = this.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to set in storage:', e);
            return false;
        }
    }

    /**
     * Remove value from storage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful
     */
    remove(key) {
        if (!this.available) return false;
        
        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (e) {
            console.error('Failed to remove from storage:', e);
            return false;
        }
    }

    /**
     * Clear all stored values
     * @returns {boolean} True if successful
     */
    clear() {
        if (!this.available) return false;
        
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Failed to clear storage:', e);
            return false;
        }
    }
}

export const storage = new StorageManager();
export default StorageManager;