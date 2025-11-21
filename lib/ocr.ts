import * as Tesseract from 'tesseract.js';

export interface ExtractedData {
    itemName: string;
    quantity: string;
    unit: string;
    date: string;
    rawText: string;
}

/**
 * Process an image and extract text using Tesseract OCR with optimized settings
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
 * Parse extracted text to identify food items, quantities, and dates with improved accuracy
 */
function parseExtractedText(text: string): ExtractedData {
    // Preprocess text: clean up and normalize
    const cleanedText = text
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/[^\w\s.,\-\/()$%]/g, '')  // Remove special characters except common ones
        .trim();

    const lines = cleanedText.split('\n').filter(line => line.trim().length > 0);

    let itemName = '';
    let quantity = '';
    let unit = '';
    let date = '';

    // Enhanced units list
    const units = [
        'kg', 'kilogram', 'kilograms', 'g', 'gram', 'grams', 'lb', 'pound', 'pounds',
        'oz', 'ounce', 'ounces', 'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters',
        'pcs', 'pieces', 'piece', 'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons',
        'tsp', 'teaspoon', 'teaspoons', 'dozen', 'pack', 'packs', 'bottle', 'bottles',
        'can', 'cans', 'box', 'boxes', 'bag', 'bags'
    ];

    // Improved quantity patterns
    const quantityPatterns = [
        /(\d+(?:\.\d+)?)\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i,  // number followed by unit
        /qty:?\s*(\d+(?:\.\d+)?)/i,  // qty: number
        /quantity:?\s*(\d+(?:\.\d+)?)/i,  // quantity: number
        /(\d+(?:\.\d+)?)\s*x\s*([a-zA-Z]+)/i,  // number x unit
    ];

    // Enhanced date patterns
    const datePatterns = [
        /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // MM/DD/YYYY or DD/MM/YYYY
        /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,    // YYYY/MM/DD
        /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{2,4})/i,  // Month DD, YYYY
        /(\d{1,2})\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{2,4})/i,  // DD Month YYYY
    ];

    // Common food items for better identification
    const commonFoods = [
        'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'milk', 'bread',
        'cheese', 'chicken', 'beef', 'pork', 'fish', 'rice', 'pasta', 'tomato', 'tomatoes',
        'potato', 'potatoes', 'carrot', 'carrots', 'lettuce', 'spinach', 'broccoli',
        'eggs', 'butter', 'yogurt', 'cereal', 'oatmeal', 'coffee', 'tea', 'sugar',
        'flour', 'salt', 'pepper', 'oil', 'vinegar', 'juice', 'water', 'soda'
    ];

    // Skip lines that are likely headers, totals, or non-item text
    const skipPatterns = [
        /receipt/i, /total/i, /subtotal/i, /tax/i, /thank you/i, /change/i,
        /cash/i, /card/i, /credit/i, /debit/i, /store/i, /market/i, /grocery/i,
        /phone/i, /address/i, /website/i, /email/i, /date/i, /time/i
    ];

    // First pass: look for quantity and unit combinations
    for (const line of lines) {
        // Skip irrelevant lines
        if (skipPatterns.some(pattern => pattern.test(line))) continue;

        // Look for quantity patterns
        for (const pattern of quantityPatterns) {
            const match = line.match(pattern);
            if (match && !quantity) {
                const qty = match[1];
                const potentialUnit = match[2]?.toLowerCase();
                if (potentialUnit && units.some(u => potentialUnit.includes(u) || u.includes(potentialUnit))) {
                    quantity = qty;
                    unit = potentialUnit;
                    // Extract item name from the same line
                    const itemPart = line.replace(match[0], '').trim();
                    if (itemPart && itemPart.length > 1) {
                        itemName = itemPart;
                    }
                }
                break;
            }
        }

        // Look for dates
        if (!date) {
            for (const pattern of datePatterns) {
                const dateMatch = line.match(pattern);
                if (dateMatch) {
                    date = parseDateString(dateMatch[0]);
                    break;
                }
            }
        }

        // If we found quantity and unit, and item name, we can break early
        if (quantity && unit && itemName) break;
    }

    // Second pass: find item name if not found yet
    if (!itemName) {
        for (const line of lines) {
            if (skipPatterns.some(pattern => pattern.test(line))) continue;

            // Look for lines that contain food items
            const lowerLine = line.toLowerCase();
            if (commonFoods.some(food => lowerLine.includes(food))) {
                itemName = line.trim();
                break;
            }

            // Fallback: use the longest line that's not just numbers
            if (line.length > itemName.length && !/^\d+$/.test(line.trim()) && line.trim().length > 2) {
                itemName = line.trim();
            }
        }
    }

    // Third pass: extract standalone quantities if not found
    if (!quantity) {
        for (const line of lines) {
            const qtyMatch = line.match(/(\d+(?:\.\d+)?)/);
            if (qtyMatch && qtyMatch[1] !== '0' && qtyMatch[1].length <= 3) {  // Reasonable quantity
                quantity = qtyMatch[1];
                break;
            }
        }
    }

    // If no date found, use today's date
    if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];
    }

    // Default values
    if (!itemName && lines.length > 0) {
        itemName = lines.find(line => line.trim().length > 0 && !skipPatterns.some(pattern => pattern.test(line))) || lines[0];
    }
    if (!quantity) {
        quantity = '1';
    }
    if (!unit) {
        unit = 'pcs';
    }

    return {
        itemName: itemName.trim(),
        quantity,
        unit,
        date,
        rawText: text,
    };
}

/**
 * Parse various date formats into YYYY-MM-DD
 */
function parseDateString(dateStr: string): string {
    const today = new Date();
    const currentYear = today.getFullYear();

    // MM/DD/YYYY or MM/DD/YY
    const slashMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (slashMatch) {
        let [, month, day, year] = slashMatch;
        year = year.length === 2 ? (parseInt(year) > 50 ? '19' : '20') + year : year;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Month DD, YYYY
    const monthDayMatch = dateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{2,4})/i);
    if (monthDayMatch) {
        const [, monthStr, day, year] = monthDayMatch;
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const month = monthNames.indexOf(monthStr.toLowerCase().substring(0, 3)) + 1;
        const fullYear = year.length === 2 ? (parseInt(year) > 50 ? '19' : '20') + year : year;
        return `${fullYear}-${month.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // DD Month YYYY
    const dayMonthMatch = dateStr.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{2,4})/i);
    if (dayMonthMatch) {
        const [, day, monthStr, year] = dayMonthMatch;
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const month = monthNames.indexOf(monthStr.toLowerCase().substring(0, 3)) + 1;
        const fullYear = year.length === 2 ? (parseInt(year) > 50 ? '19' : '20') + year : year;
        return `${fullYear}-${month.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Fallback to today
    return today.toISOString().split('T')[0];
}
