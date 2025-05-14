// Spanish invoice field extraction helper

// Extract invoice data using regex patterns
export const extractInvoiceData = (text) => {
    return {
      invoiceNumber: extractInvoiceNumber(text),
      date: extractDate(text),
      vendor: extractVendor(text),
      total: extractTotal(text),
      vat: extractVAT(text),
      // Add other fields as needed
    };
  };
  
  // Extract invoice number
  export const extractInvoiceNumber = (text) => {
    const patterns = [
      /Factura\s*N[oº°]?[.:]\s*([A-Z0-9\/-]+)/i,
      /N[oº°]?[.:]\s*Factura\s*:?\s*([A-Z0-9\/-]+)/i,
      /Número\s*de\s*factura\s*:?\s*([A-Z0-9\/-]+)/i,
      /Factura\s*:?\s*([A-Z0-9\/-]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };
  
  // Extract date
  export const extractDate = (text) => {
    // Spanish date formats: DD/MM/YYYY, DD-MM-YYYY
    const patterns = [
      /Fecha\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i,
      /Date\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i,
      /(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };
  
  // Extract vendor (company name)
  export const extractVendor = (text) => {
    // Look for common Spanish business identifiers
    const nifPattern = /NIF\s*:?\s*([A-Z0-9\-]+)/i;
    const cifPattern = /CIF\s*:?\s*([A-Z0-9\-]+)/i;
    
    // First try to find company name based on known patterns
    const companyPatterns = [
      // Look for lines before NIF/CIF often contains company name
      new RegExp(`(.+?)\\s*(?:${nifPattern.source}|${cifPattern.source})`, 'i'),
      // Look for "Emisor:" which often indicates the vendor in Spanish invoices
      /Emisor\s*:?\s*(.+?)(?:\n|$)/i,
      // Look for beginning of document - often has company name as header
      /^(.+?)(?:\n|$)/
    ];
    
    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].length > 3) { // Avoid too short matches
        return match[1].trim();
      }
    }
    
    return null;
  };
  
  // Extract total amount
  export const extractTotal = (text) => {
    const patterns = [
      /Total\s*:?\s*€?\s*(\d+[.,]\d{2})/i, 
      /Total\s*factura\s*:?\s*€?\s*(\d+[.,]\d{2})/i,
      /Importe\s*total\s*:?\s*€?\s*(\d+[.,]\d{2})/i,
      /€\s*(\d+[.,]\d{2})/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };
  
  // Extract VAT (IVA in Spanish)
  export const extractVAT = (text) => {
    const patterns = [
      /IVA\s*\(\s*\d+%\s*\)\s*:?\s*€?\s*(\d+[.,]\d{2})/i,
      /IVA\s*:?\s*€?\s*(\d+[.,]\d{2})/i,
      /VAT\s*:?\s*€?\s*(\d+[.,]\d{2})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };