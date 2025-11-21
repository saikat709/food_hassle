import Tesseract from 'tesseract.js';

export interface ExtractedData {
    itemName: string;
    quantity: string;
    unit: string;
    date: string;
    rawText: string;
}

/**
 * Process an image and extract text using Tesseract OCR
 */
export async function extractTextFromImage(
    imageFile: File | string,
    onProgress?: (progress: number) => void
): Promise<ExtractedData> {
    try {
        const result = await Tesseract.recognize(
            imageFile,
            'eng',
            {
                logger: (m) => {
                    if (m.status === 'recognizing text' && onProgress) {
                        onProgress(Math.round(m.progress * 100));
                    }
                },
            }
        );

        const text = result.data.text;
        return parseExtractedText(text);
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from image');
    }
}

/**
 * Parse extracted text to identify food items, quantities, and dates
 */
function parseExtractedText(text: string): ExtractedData {
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    let itemName = '';
    let quantity = '';
    let unit = '';
    let date = '';

    // Common units to look for
    const units = ['kg', 'g', 'lb', 'oz', 'ml', 'l', 'pcs', 'pieces', 'cups', 'tbsp', 'tsp', 'dozen'];

    // Try to find quantities with units
    const quantityPattern = /(\d+(?:\.\d+)?)\s*(kg|g|lb|oz|ml|l|pcs|pieces|cups|tbsp|tsp|dozen)/i;

    // Try to find dates (various formats)
    const datePatterns = [
        /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // MM/DD/YYYY or DD/MM/YYYY
        /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,    // YYYY/MM/DD
    ];

    for (const line of lines) {
        // Look for quantity and unit
        const quantityMatch = line.match(quantityPattern);
        if (quantityMatch && !quantity) {
            quantity = quantityMatch[1];
            unit = quantityMatch[2].toLowerCase();
        }

        // Look for dates
        for (const pattern of datePatterns) {
            const dateMatch = line.match(pattern);
            if (dateMatch && !date) {
                // Try to format as YYYY-MM-DD for HTML date input
                const parts = dateMatch[0].split(/[\/\-]/);
                if (parts.length === 3) {
                    // Assume MM/DD/YYYY format for now
                    const [month, day, year] = parts;
                    const fullYear = year.length === 2 ? `20${year}` : year;
                    date = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                }
                break;
            }
        }

        // If we haven't found an item name yet, use the first substantial line
        if (!itemName && line.length > 2 && !line.match(/^\d+$/)) {
            // Skip lines that are just numbers or common receipt headers
            const skipWords = ['receipt', 'total', 'subtotal', 'tax', 'thank you'];
            if (!skipWords.some(word => line.toLowerCase().includes(word))) {
                itemName = line.trim();
            }
        }
    }

    // If no date found, use today's date
    if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];
    }

    // Default values if nothing found
    if (!itemName && lines.length > 0) {
        itemName = lines[0].trim();
    }
    if (!quantity) {
        quantity = '1';
    }
    if (!unit) {
        unit = 'pcs';
    }

    return {
        itemName,
        quantity,
        unit,
        date,
        rawText: text,
    };
}
