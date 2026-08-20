// js/file-handler.js
// File handling utilities
export class FileHandler {
    /**
     * Read file content
     * @param {File} file - File object
     * @returns {Promise<string>} File content
     */
    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    /**
     * Parse file content based on type
     * @param {string} content - File content
     * @param {string} type - File type
     * @returns {object} Parsed content
     */
    static parseContent(content, type) {
        switch (type) {
            case 'json':
                return JSON.parse(content);
                
            case 'csv':
                return this.parseCSV(content);
                
            case 'xml':
                return this.parseXML(content);
                
            default:
                return content;
        }
    }

    /**
     * Parse CSV content
     * @param {string} content - CSV content
     * @returns {array} Parsed rows
     */
    static parseCSV(content) {
        const lines = content.split('\n');
        return lines.map(line => line.split(','));
    }

    /**
     * Parse XML content (basic)
     * @param {string} content - XML content
     * @returns {object} Parsed XML
     */
    static parseXML(content) {
        const parser = new DOMParser();
        return parser.parseFromString(content, 'text/xml');
    }

    /**
     * Process JSON safely
     * @param {object} jsonData - JSON data
     * @param {function} converter - Conversion function
     * @returns {object} Processed JSON
     */
    static processJSON(jsonData, converter) {
        if (typeof jsonData === 'string') {
            return converter(jsonData);
        } else if (Array.isArray(jsonData)) {
            return jsonData.map(item => this.processJSON(item, converter));
        } else if (typeof jsonData === 'object' && jsonData !== null) {
            const result = {};
            for (const [key, value] of Object.entries(jsonData)) {
                result[key] = this.processJSON(value, converter);
            }
            return result;
        }
        return jsonData;
    }

    /**
     * Download content as file
     * @param {string} content - File content
     * @param {string} filename - File name
     * @param {string} type - MIME type
     */
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Give the browser time to start the download before releasing the URL.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /**
     * Get file extension from filename
     * @param {string} filename - File name
     * @returns {string} File extension
     */
    static getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    /**
     * Get MIME type for file extension
     * @param {string} extension - File extension
     * @returns {string} MIME type
     */
    static getMimeType(extension) {
        const mimeTypes = {
            'txt': 'text/plain',
            'json': 'application/json',
            'csv': 'text/csv',
            'xml': 'application/xml'
        };
        return mimeTypes[extension] || 'text/plain';
    }
}

export default FileHandler;