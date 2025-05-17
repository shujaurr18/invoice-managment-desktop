/**
 * Extracts data from BBVA direct debit receipts
 * This function is designed to extract common fields from OCR text of BBVA receipts
 * 
 * @param {string} text - The raw OCR text extracted from the receipt image
 * @return {object} - Structured data from the receipt and missing fields
 */
const extractBBVADirectDebitData = (text) => {
  console.log("Starting extraction process from BBVA direct debit OCR text");
  
  // Initialize with empty values based on BBVA direct debit structure
  const data = {
    acreedor: '',               // Creditor name (e.g., AYUNTAMIENTO DE CASTRO URDIALES)
    idAcreedor: '',             // Creditor ID (e.g., ES75235P3902000C)
    refMandato: '',             // Mandate reference (e.g., 0000000883171)
    vencimiento: '',            // Due date (e.g., 06-10-2023)
    refAdeudo: '',              // Debit reference (e.g., 2865850-0 ED-353-R)
    deudor: '',                 // Debtor name (e.g., PEREZ JIMENEZ DIANA TAMARA)
    concepto: '',               // Concept (e.g., PLAN DE PAGO A LA CARTA: 66,59)
    importeTotal: '',           // Total amount (e.g., 66,59)
    numAdeudo: '',              // Debit number (e.g., 2023276001327527)
    titular: '',                // Account holder (e.g., DIANA TAMARA PEREZ JIMENEZ)
    oficina: '',                // Office (e.g., CASTRO URDIALES-CONSTITUCION)
    fecha: '',                  // Date (e.g., 06-10-23)
    iban: '',                   // Bank account number (e.g., ES52 0182 3020 9600 1150 2943)
    cargo: '',                  // Charge type (e.g., CARGO POR ADEUDO DIRECTO)
  };
  
  // Clean and normalize text
  const cleanText = text.replace(/\r\n/g, '\n');
  
  // Split text into lines for easier processing
  const lines = cleanText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  console.log(`Extracted ${lines.length} text lines from OCR`);
  
  // Print all lines for debugging
  console.log("All OCR lines:");
  lines.forEach((line, index) => {
    console.log(`Line ${index}: "${line}"`);
  });
  
  // Function to find a line that contains a specific term
  const findLine = (term, startIndex = 0, caseSensitive = false) => {
    const searchTerm = caseSensitive ? term : term.toLowerCase();
    for (let i = startIndex; i < lines.length; i++) {
      const line = caseSensitive ? lines[i] : lines[i].toLowerCase();
      if (line.includes(searchTerm)) {
        console.log(`Found "${term}" in line ${i}: "${lines[i]}"`);
        return { line: lines[i], index: i };
      }
    }
    console.log(`Term "${term}" not found in any line`);
    return null;
  };
  
  // Extract BBVA direct debit header
  const cargoLine = findLine('CARGO POR ADEUDO DIRECTO');
  if (cargoLine) {
    data.cargo = cargoLine.line.trim();
    console.log(`Extracted cargo: "${data.cargo}"`);
  }
  
  // Extract creditor information
  const acreedorLine = findLine('ACREEDOR:');
  if (acreedorLine) {
    // Extract creditor name
    const acreedorText = acreedorLine.line.replace('ACREEDOR:', '').trim();
    data.acreedor = acreedorText;
    console.log(`Extracted acreedor: "${data.acreedor}"`);
  }
  
  // Extract creditor ID
  const idAcreedorLine = findLine('ID ACREEDOR:');
  if (idAcreedorLine) {
    const idAcreedorText = idAcreedorLine.line.replace('ID ACREEDOR:', '').trim();
    data.idAcreedor = idAcreedorText;
    console.log(`Extracted idAcreedor: "${data.idAcreedor}"`);
  }
  
  // Extract mandate reference
  const refMandatoLine = findLine('REF. MANDATO:');
  if (refMandatoLine) {
    const refMandatoText = refMandatoLine.line.replace('REF. MANDATO:', '').trim();
    data.refMandato = refMandatoText;
    console.log(`Extracted refMandato: "${data.refMandato}"`);
  }
  
  // Extract due date
  const vencimientoLine = findLine('VENCIMIENTO:');
  if (vencimientoLine) {
    const vencimientoText = vencimientoLine.line.replace('VENCIMIENTO:', '').trim();
    data.vencimiento = vencimientoText;
    console.log(`Extracted vencimiento: "${data.vencimiento}"`);
  }
  
  // Extract debit reference
  const refAdeudoLine = findLine('REF. ADEUDO:');
  if (refAdeudoLine) {
    const refAdeudoText = refAdeudoLine.line.replace('REF. ADEUDO:', '').trim();
    data.refAdeudo = refAdeudoText;
    console.log(`Extracted refAdeudo: "${data.refAdeudo}"`);
  }
  
  // Extract debtor information
  const deudorLine = findLine('DEUDOR:');
  if (deudorLine) {
    const deudorText = deudorLine.line.replace('DEUDOR:', '').trim();
    data.deudor = deudorText;
    console.log(`Extracted deudor: "${data.deudor}"`);
  }
  
  // Extract concept
  const conceptoLine = findLine('Concepto:');
  if (conceptoLine) {
    // The concept may contain multiple parts, get the full line
    data.concepto = conceptoLine.line.replace('Concepto:', '').trim();
    console.log(`Extracted concepto: "${data.concepto}"`);
    
    // Try to extract amount from concept if it contains it
    const amountMatch = data.concepto.match(/(\d+,\d+)/);
    if (amountMatch && amountMatch[1] && !data.importeTotal) {
      data.importeTotal = amountMatch[1];
      console.log(`Extracted importeTotal from concepto: "${data.importeTotal}"`);
    }
  }
  
  // Try alternative concept format
  if (!conceptoLine) {
    const altConceptoLine = findLine('PLAN DE PAGO');
    if (altConceptoLine) {
      data.concepto = altConceptoLine.line.trim();
      console.log(`Extracted concepto (alternative): "${data.concepto}"`);
      
      // Try to extract amount from concept if it contains it
      const amountMatch = data.concepto.match(/(\d+,\d+)/);
      if (amountMatch && amountMatch[1] && !data.importeTotal) {
        data.importeTotal = amountMatch[1];
        console.log(`Extracted importeTotal from alternative concepto: "${data.importeTotal}"`);
      }
    }
  }
  
  // Extract total amount
  const importeTotalLine = findLine('IMPORTE TOTAL:');
  if (importeTotalLine) {
    const importeMatch = importeTotalLine.line.match(/(\d+,\d+)/);
    if (importeMatch && importeMatch[1]) {
      data.importeTotal = importeMatch[1];
      console.log(`Extracted importeTotal: "${data.importeTotal}"`);
    }
  }
  
  // Try alternative amount format
  if (!data.importeTotal) {
    const euroLine = findLine('EUROS');
    if (euroLine) {
      const euroMatch = euroLine.line.match(/(\d+,\d+)/);
      if (euroMatch && euroMatch[1]) {
        data.importeTotal = euroMatch[1];
        console.log(`Extracted importeTotal (alternative): "${data.importeTotal}"`);
      }
    }
  }
  
  // Extract debit number
  const numAdeudoLine = findLine('Nº ADEUDO:');
  if (numAdeudoLine) {
    const numAdeudoText = numAdeudoLine.line.replace('Nº ADEUDO:', '').trim();
    data.numAdeudo = numAdeudoText;
    console.log(`Extracted numAdeudo: "${data.numAdeudo}"`);
  }
  
  // Extract account holder
  const titularLine = findLine('TITULARES');
  if (titularLine && titularLine.index + 1 < lines.length) {
    data.titular = lines[titularLine.index + 1].trim();
    console.log(`Extracted titular: "${data.titular}"`);
  }
  
  // Extract office
  const oficinaLine = findLine('OFICINA');
  if (oficinaLine && oficinaLine.index + 1 < lines.length) {
    data.oficina = lines[oficinaLine.index + 1].trim();
    console.log(`Extracted oficina: "${data.oficina}"`);
  }
  
  // Extract date
  const fechaLine = findLine('FECHA');
  if (fechaLine && fechaLine.index + 1 < lines.length) {
    data.fecha = lines[fechaLine.index + 1].trim();
    console.log(`Extracted fecha: "${data.fecha}"`);
  }
  
  // Extract IBAN
  const ibanLine = findLine('IBAN');
  if (ibanLine && ibanLine.index + 1 < lines.length) {
    data.iban = lines[ibanLine.index + 1].trim();
    console.log(`Extracted iban: "${data.iban}"`);
  }
  
  // Verify fields and compile list of missing fields
  const missingFields = [];
  if (!data.acreedor) missingFields.push('Creditor');
  if (!data.idAcreedor) missingFields.push('Creditor ID');
  if (!data.refMandato) missingFields.push('Mandate Reference');
  if (!data.vencimiento) missingFields.push('Due Date');
  if (!data.refAdeudo) missingFields.push('Debit Reference');
  if (!data.deudor) missingFields.push('Debtor');
  if (!data.importeTotal) missingFields.push('Total Amount');
  if (!data.iban) missingFields.push('IBAN');
  
  console.log("Extracted BBVA direct debit data:", data);
  console.log("Missing fields:", missingFields);
  
  return {
    data,
    missingFields
  };
};

// Export as a standalone function and as the default export
export { extractBBVADirectDebitData };
export default extractBBVADirectDebitData;