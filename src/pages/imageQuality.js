/**
 * Utility functions for image quality assessment specialized for OCR processing
 * These functions help determine if an image is suitable for text recognition
 */

/**
 * Enhanced image quality checker for invoice OCR processing
 * This function analyzes an image to determine if it's suitable for OCR
 * 
 * @param {HTMLImageElement} img - Image element to analyze
 * @return {Object} - Quality analysis with score and message
 */
const enhancedImageQualityCheck = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Initialize metrics
    let brightness = 0;
    let pixelCount = 0;
    let blackPixels = 0;
    let whitePixels = 0;
    
    // Analyze pixel data
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // RGB average for brightness
      const pixelBrightness = (r + g + b) / 3;
      brightness += pixelBrightness;
      
      // Count black and white pixels for text detection
      if (pixelBrightness < 30) {
        blackPixels++;
      } else if (pixelBrightness > 220) {
        whitePixels++;
      }
      
      pixelCount++;
    }
    
    // Calculate metrics
    const avgBrightness = brightness / pixelCount;
    const blackPixelPercentage = (blackPixels / pixelCount) * 100;
    const whitePixelPercentage = (whitePixels / pixelCount) * 100;
    
    // Calculate contrast by analyzing standard deviation
    let contrastSum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const pixel = (data[i] + data[i + 1] + data[i + 2]) / 3;
      contrastSum += Math.pow(pixel - avgBrightness, 2);
    }
    
    const contrast = Math.sqrt(contrastSum / pixelCount);
    
    // Check for blur using edge detection
    const blurScore = detectBlur(imageData, canvas.width, canvas.height);
    
    // Initialize quality assessment
    let qualityScore = 0;
    let qualityIssues = [];
    
    // Brightness assessment
    if (avgBrightness < 60) {
      qualityScore -= 25;
      qualityIssues.push('Imagen demasiado oscura');
    } else if (avgBrightness > 220) {
      qualityScore -= 20;
      qualityIssues.push('Imagen demasiado brillante');
    } else if (avgBrightness > 150 && avgBrightness < 220) {
      qualityScore += 25;
    } else {
      qualityScore += 15;
    }
    
    // Contrast assessment
    if (contrast < 40) {
      qualityScore -= 25;
      qualityIssues.push('Bajo contraste');
    } else if (contrast > 80) {
      qualityScore += 25;
    } else {
      qualityScore += 15;
    }
    
    // Blur assessment
    if (blurScore > 0.5) {
      qualityScore -= 25;
      qualityIssues.push('Imagen borrosa');
    } else {
      qualityScore += 20;
    }
    
    // Resolution assessment
    if (img.width < 800 || img.height < 600) {
      qualityScore -= 25;
      qualityIssues.push('Resolución baja');
    } else if (img.width >= 1500 && img.height >= 1000) {
      qualityScore += 25;
    } else {
      qualityScore += 15;
    }
    
    // Text detection assessment (important for invoices)
    const textContentScore = blackPixelPercentage;
    if (textContentScore < 2) {
      qualityScore -= 30;
      qualityIssues.push('Poco texto detectado');
    } else if (textContentScore > 5 && textContentScore < 20) {
      qualityScore += 25; // Good amount of text for an invoice
    }
    
    // Check for excessive white space
    if (whitePixelPercentage > 95) {
      qualityScore -= 20;
      qualityIssues.push('Exceso de espacio en blanco');
    }
    
    // Final score normalization (0-100 scale)
    qualityScore = Math.max(0, Math.min(100, qualityScore + 50));
    
    // Generate quality message
    let qualityMessage = '';
    if (qualityScore < 40) {
      qualityMessage = 'Calidad de imagen muy baja. ' + qualityIssues.join('. ') + 
        '. Por favor, suba una imagen de mejor calidad.';
    } else if (qualityScore < 60) {
      qualityMessage = 'Calidad de imagen baja. ' + qualityIssues.join('. ') + 
        '. Los resultados de extracción pueden no ser precisos.';
    } else if (qualityScore < 80) {
      qualityMessage = 'Calidad de imagen moderada.' + 
        (qualityIssues.length ? ' ' + qualityIssues.join('. ') + '.' : '');
    } else {
      qualityMessage = 'Calidad de imagen buena.';
    }
    
    return {
      score: qualityScore,
      message: qualityMessage,
      details: {
        brightness: avgBrightness,
        contrast: contrast,
        blur: blurScore,
        blackPixelPercentage,
        whitePixelPercentage,
        width: img.width,
        height: img.height
      }
    };
  };
  
  /**
   * Detects blur in an image using Laplacian variance method
   * 
   * @param {ImageData} imageData - Image data from canvas
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @return {number} - Blur score (higher means more blur)
   */
  const detectBlur = (imageData, width, height) => {
    const data = imageData.data;
    let laplacianSum = 0;
    
    // Convert to grayscale and apply Laplacian operator
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const pixelIndex = (y * width + x) * 4;
        
        // Get surrounding pixels (3x3 Laplacian kernel)
        const center = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
        const top = (data[pixelIndex - (width * 4)] + data[pixelIndex - (width * 4) + 1] + data[pixelIndex - (width * 4) + 2]) / 3;
        const bottom = (data[pixelIndex + (width * 4)] + data[pixelIndex + (width * 4) + 1] + data[pixelIndex + (width * 4) + 2]) / 3;
        const left = (data[pixelIndex - 4] + data[pixelIndex - 3] + data[pixelIndex - 2]) / 3;
        const right = (data[pixelIndex + 4] + data[pixelIndex + 5] + data[pixelIndex + 6]) / 3;
        
        // Apply Laplacian operator
        const laplacian = Math.abs(4 * center - top - bottom - left - right);
        laplacianSum += laplacian;
      }
    }
    
    // Calculate mean and normalize (0-1 scale, lower is blurrier)
    const pixelCount = (width - 2) * (height - 2);
    const laplacianMean = laplacianSum / pixelCount;
    
    // Convert to blur score (0-1, higher is blurrier)
    const blurScore = 1 - Math.min(1, laplacianMean / 20);
    
    return blurScore;
  };
  
  /**
   * Quick check to determine if an image is likely to be an invoice
   * 
   * @param {HTMLImageElement} img - Image element to analyze
   * @return {boolean} - True if the image is likely an invoice
   */
  const isLikelyInvoice = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Count black and white pixels
    let blackPixels = 0;
    let whitePixels = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const brightness = (r + g + b) / 3;
      
      if (brightness < 30) {
        blackPixels++;
      } else if (brightness > 220) {
        whitePixels++;
      }
      
      pixelCount++;
    }
    
    const blackPixelPercentage = (blackPixels / pixelCount) * 100;
    const whitePixelPercentage = (whitePixels / pixelCount) * 100;
    
    // Invoices typically have:
    // 1. Mostly white background
    // 2. Black text that makes up a small percentage of the image
    // 3. A structured layout
    return (
      whitePixelPercentage > 65 && // Mostly white background
      blackPixelPercentage > 1.5 && blackPixelPercentage < 20 // Some black text, but not too much
    );
  };
  
  /**
   * Performs Tesseract OCR pre-processing on an image to improve text recognition
   * 
   * @param {HTMLImageElement} img - Original image element
   * @return {HTMLCanvasElement} - Canvas with the processed image
   */
  const preprocessImageForOCR = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw original image
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply preprocessing
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Convert to grayscale
      const gray = 0.3 * r + 0.59 * g + 0.11 * b;
      
      // Apply thresholding to enhance text
      const threshold = 160;
      const newValue = gray < threshold ? 0 : 255;
      
      data[i] = data[i + 1] = data[i + 2] = newValue;
    }
    
    // Put the processed image data back on the canvas
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
  };
  
  // Export the functions
  export {
    enhancedImageQualityCheck,
    detectBlur,
    isLikelyInvoice,
    preprocessImageForOCR
  };