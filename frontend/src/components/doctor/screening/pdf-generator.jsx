import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fetch from "node-fetch";

// Custom error classes for better error identification
class PDFGenerationError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = "PDFGenerationError";
    this.cause = cause;
  }
}

class ImageFetchError extends Error {
  constructor(message, url, cause = null) {
    super(message);
    this.name = "ImageFetchError";
    this.url = url;
    this.cause = cause;
  }
}

// Helper to fetch image as Uint8Array with proper error handling
async function fetchImageBytes(url) {
  if (!url || typeof url !== 'string') {
    throw new ImageFetchError("Invalid URL provided", url);
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new ImageFetchError(
        `Failed to fetch image: ${res.status} ${res.statusText}`,
        url
      );
    }
    
    const arrayBuffer = await res.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    if (error instanceof ImageFetchError) {
      throw error;
    }
    throw new ImageFetchError(
      `Network error while fetching image: ${error.message}`,
      url,
      error
    );
  }
}

// Helper to safely format date
function formatDate(dateInput) {
  try {
    if (!dateInput) return new Date().toLocaleString();
    
    // Handle Firebase Timestamp format
    if (dateInput.seconds) {
      return new Date(dateInput.seconds * 1000).toLocaleString();
    }
    
    // Handle regular Date objects or strings
    return new Date(dateInput).toLocaleString();
  } catch (error) {
    console.warn("Date formatting error:", error);
    return new Date().toLocaleString();
  }
}

// Helper to safely get text content with length limits and sanitize for PDF
function safeText(text, maxLength = 500) {
  if (!text || typeof text !== 'string') return '';
  
  // Comprehensive emoji and Unicode sanitization for PDF WinAnsi encoding
  let sanitized = text
    // Remove ALL emoji ranges (comprehensive coverage)
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Regional country flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
    .replace(/[\u{1F018}-\u{1F270}]/gu, '') // Various symbols
    .replace(/[\u{238C}-\u{2454}]/gu, '')   // Misc symbols
    .replace(/[\u{20D0}-\u{20FF}]/gu, '')   // Combining Diacritical Marks for Symbols
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
    .replace(/[\u{1F004}]/gu, '')           // Mahjong Tile Red Dragon
    .replace(/[\u{1F0CF}]/gu, '')           // Playing Card Black Joker
    .replace(/[\u{1F170}-\u{1F251}]/gu, '') // Enclosed characters
    // Remove skin tone modifiers
    .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
    // Remove zero-width characters that can cause issues
    .replace(/[\u{200B}-\u{200D}]/gu, '')   // Zero-width spaces
    .replace(/[\u{FEFF}]/gu, '')            // Byte Order Mark
    // Remove other problematic Unicode ranges
    .replace(/[\u{2000}-\u{206F}]/gu, ' ')  // General Punctuation (replace with space)
    .replace(/[\u{2070}-\u{209F}]/gu, '')   // Superscripts and Subscripts
    .replace(/[\u{20A0}-\u{20CF}]/gu, '')   // Currency Symbols
    .replace(/[\u{2100}-\u{214F}]/gu, '')   // Letterlike Symbols
    .replace(/[\u{2150}-\u{218F}]/gu, '')   // Number Forms
    .replace(/[\u{2190}-\u{21FF}]/gu, '')   // Arrows
    .replace(/[\u{2200}-\u{22FF}]/gu, '')   // Mathematical Operators
    .replace(/[\u{2300}-\u{23FF}]/gu, '')   // Miscellaneous Technical
    .replace(/[\u{2400}-\u{243F}]/gu, '')   // Control Pictures
    .replace(/[\u{2440}-\u{245F}]/gu, '')   // Optical Character Recognition
    .replace(/[\u{2460}-\u{24FF}]/gu, '')   // Enclosed Alphanumerics
    .replace(/[\u{2500}-\u{257F}]/gu, '')   // Box Drawing
    .replace(/[\u{2580}-\u{259F}]/gu, '')   // Block Elements
    .replace(/[\u{25A0}-\u{25FF}]/gu, '')   // Geometric Shapes
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Miscellaneous Symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{27C0}-\u{27EF}]/gu, '')   // Miscellaneous Mathematical Symbols-A
    .replace(/[\u{27F0}-\u{27FF}]/gu, '')   // Supplemental Arrows-A
    .replace(/[\u{2800}-\u{28FF}]/gu, '')   // Braille Patterns
    .replace(/[\u{2900}-\u{297F}]/gu, '')   // Supplemental Arrows-B
    .replace(/[\u{2980}-\u{29FF}]/gu, '')   // Miscellaneous Mathematical Symbols-B
    .replace(/[\u{2A00}-\u{2AFF}]/gu, '')   // Supplemental Mathematical Operators
    .replace(/[\u{2B00}-\u{2BFF}]/gu, '')   // Miscellaneous Symbols and Arrows
    // Handle remaining high Unicode characters (beyond Latin Extended)
    .replace(/[\u{0300}-\u{036F}]/gu, '')   // Combining Diacritical Marks
    .replace(/[\u{1AB0}-\u{1AFF}]/gu, '')   // Combining Diacritical Marks Extended
    .replace(/[\u{1DC0}-\u{1DFF}]/gu, '')   // Combining Diacritical Marks Supplement
    // Final catch-all for any remaining problematic characters
    .replace(/[\u{0100}-\u{024F}]/gu, (match) => {
      // Keep common Latin Extended characters, remove others
      const commonLatinExtended = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž]/;
      return commonLatinExtended.test(match) ? match : '';
    })
    // Catch any remaining high Unicode characters
    .replace(/[\u{0250}-\u{FFFF}]/gu, (match) => {
      const code = match.charCodeAt(0);
      // Keep basic Latin, Latin-1 Supplement, and common punctuation
      if (code <= 255) return match;
      // Keep some common currency and mathematical symbols
      if ([8364, 8482, 8240, 176, 177, 215, 247].includes(code)) return match;
      // Remove everything else
      return '';
    })
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
  
  // If sanitization results in empty string, provide fallback
  if (!sanitized) {
    sanitized = '[Content contains unsupported characters]';
  }
  
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) + '...' : sanitized;
}

// Helper to embed image with fallback handling
async function embedImageSafely(pdfDoc, imageBytes, imageName) {
  try {
    // Try JPG first, then PNG
    try {
      return await pdfDoc.embedJpg(imageBytes);
    } catch (jpgError) {
      try {
        return await pdfDoc.embedPng(imageBytes);
      } catch (pngError) {
        throw new Error(`Failed to embed ${imageName} as JPG or PNG`);
      }
    }
  } catch (error) {
    throw new Error(`Image embedding failed for ${imageName}: ${error.message}`);
  }
}

export async function generatePDFReport({
  inputImageUrl,
  resultImageUrl,
  aiResults,
  cancerType,
  patient,
  appointment,
  doctor,
}) {
  try {
    // Validate required parameters
    if (!aiResults || typeof aiResults !== 'object') {
      throw new PDFGenerationError("AI results are required and must be an object");
    }

    if (!cancerType || typeof cancerType !== 'string') {
      throw new PDFGenerationError("Cancer type is required and must be a string");
    }

    // Create PDF document
    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.create();
    } catch (error) {
      throw new PDFGenerationError("Failed to create PDF document", error);
    }

    const page = pdfDoc.addPage([595, 842]); // A4 size

    // Embed fonts with error handling
    let font, bold;
    try {
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    } catch (error) {
      throw new PDFGenerationError("Failed to embed fonts", error);
    }

    let y = 800;

    try {
      // Header
      page.drawText("Medical Imaging AI Analysis Report", {
        x: 50,
        y,
        size: 22,
        font: bold,
        color: rgb(0, 0.3, 0.7),
      });
      y -= 40;

      // Patient & Appointment Info
      page.drawText("Patient Information:", { x: 50, y, size: 14, font: bold });
      y -= 20;
      
      const patientName = `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim() || "N/A";
      page.drawText(`Name: ${patientName}`, { x: 60, y, size: 12, font });
      y -= 16;
      
      page.drawText(`Patient ID: ${patient?.id || "N/A"}`, {
        x: 60,
        y,
        size: 12,
        font,
      });
      y -= 16;
      
      page.drawText(`Appointment ID: ${appointment?.id || "N/A"}`, {
        x: 60,
        y,
        size: 12,
        font,
      });
      y -= 16;
      
      page.drawText(`Date: ${formatDate(appointment?.appointmentDate)}`, {
        x: 60,
        y,
        size: 12,
        font,
      });
      y -= 24;

      // Doctor Info
      if (doctor && typeof doctor === 'object') {
        page.drawText("Doctor:", { x: 50, y, size: 14, font: bold });
        y -= 20;
        
        const doctorName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();
        page.drawText(`Name: Dr. ${doctorName || "N/A"}`, {
          x: 60,
          y,
          size: 12,
          font,
        });
        y -= 16;
        
        page.drawText(`Doctor ID: ${doctor.id || doctor.uid || "N/A"}`, {
          x: 60,
          y,
          size: 12,
          font,
        });
        y -= 24;
      }

      // Cancer Type & AI Model
      page.drawText("Screening Details:", { x: 50, y, size: 14, font: bold });
      y -= 20;
      
      try {
        const sanitizedCancerType = safeText(cancerType);
        page.drawText(`Cancer Type: ${sanitizedCancerType}`, { x: 60, y, size: 12, font });
        y -= 16;
      } catch (textError) {
        console.warn("Cancer type text encoding error:", textError);
        page.drawText("Cancer Type: [Contains unsupported characters]", { x: 60, y, size: 12, font });
        y -= 16;
      }
      
      try {
        const modelVersion = aiResults?.aiModelVersion || aiResults?.modelVersion || "N/A";
        const sanitizedModelVersion = safeText(modelVersion);
        page.drawText(`AI Model Version: ${sanitizedModelVersion}`, {
          x: 60,
          y,
          size: 12,
          font,
        });
        y -= 24;
      } catch (textError) {
        console.warn("Model version text encoding error:", textError);
        page.drawText("AI Model Version: [Contains unsupported characters]", {
          x: 60,
          y,
          size: 12,
          font,
        });
        y -= 24;
      }

      // AI Results
      page.drawText("AI Analysis Results:", { x: 50, y, size: 14, font: bold });
      y -= 20;
      
      try {
        const sanitizedClassification = safeText(aiResults?.classification) || "N/A";
        page.drawText(`Classification: ${sanitizedClassification}`, {
          x: 60,
          y,
          size: 12,
          font,
        });
        y -= 16;
      } catch (textError) {
        console.warn("Classification text encoding error:", textError);
        page.drawText("Classification: [Contains unsupported characters]", {
          x: 60,
          y,
          size: 12,
          font,
        });
        y -= 16;
      }
      
      const confidence = aiResults?.confidence ? `${aiResults.confidence}%` : "N/A";
      page.drawText(`Confidence: ${confidence}`, {
        x: 60,
        y,
        size: 12,
        font,
      });
      y -= 16;

      // Additional Findings
      if (aiResults?.additionalFindings?.length) {
        page.drawText("Findings:", { x: 60, y, size: 12, font: bold });
        y -= 16;
        
        aiResults.additionalFindings.forEach((finding) => {
          if (finding && typeof finding === 'string') {
            try {
              const sanitizedFinding = safeText(finding, 100);
              page.drawText(`- ${sanitizedFinding}`, { x: 70, y, size: 11, font });
              y -= 14;
            } catch (textError) {
              console.warn("Skipping problematic finding text:", textError);
              page.drawText("- [Finding contains unsupported characters]", { x: 70, y, size: 11, font });
              y -= 14;
            }
          }
        });
      }
      y -= 10;

      // Doctor Review
      if (aiResults?.doctorReview) {
        page.drawText("Doctor's Review:", { x: 50, y, size: 14, font: bold });
        y -= 18;
        try {
          const sanitizedReview = safeText(aiResults.doctorReview, 300);
          page.drawText(sanitizedReview, { x: 60, y, size: 12, font });
          y -= 24;
        } catch (textError) {
          console.warn("Doctor review text encoding error:", textError);
          page.drawText("[Doctor review contains unsupported characters]", { x: 60, y, size: 12, font });
          y -= 24;
        }
      }

      // Images handling with comprehensive error handling
      let inputImageLoaded = false;
      let resultImageLoaded = false;

      // Input Image
      if (inputImageUrl) {
        try {
          const inputImgBytes = await fetchImageBytes(inputImageUrl);
          const inputImg = await embedImageSafely(pdfDoc, inputImgBytes, "input image");
          
          page.drawText("Input Image:", { x: 50, y, size: 12, font: bold });
          y -= 120;
          page.drawImage(inputImg, { x: 50, y, width: 200, height: 100 });
          inputImageLoaded = true;
        } catch (error) {
          console.error("Input image error:", error);
          page.drawText("Input image could not be loaded.", {
            x: 50,
            y,
            size: 10,
            font,
            color: rgb(0.7, 0.3, 0.3),
          });
          y -= 20;
        }
      }

      // Result Image
      if (resultImageUrl) {
        try {
          const resultImgBytes = await fetchImageBytes(resultImageUrl);
          const resultImg = await embedImageSafely(pdfDoc, resultImgBytes, "result image");
          
          const imageY = inputImageLoaded ? y + 120 : y;
          page.drawText("Result Image:", {
            x: 300,
            y: imageY,
            size: 12,
            font: bold,
          });
          
          const drawY = inputImageLoaded ? y : y - 120;
          page.drawImage(resultImg, { x: 300, y: drawY, width: 200, height: 100 });
          resultImageLoaded = true;
          
          if (!inputImageLoaded) {
            y -= 120;
          }
        } catch (error) {
          console.error("Result image error:", error);
          const errorY = inputImageLoaded ? y + 100 : y;
          page.drawText("Result image could not be loaded.", {
            x: 300,
            y: errorY,
            size: 10,
            font,
            color: rgb(0.7, 0.3, 0.3),
          });
          
          if (!inputImageLoaded) {
            y -= 20;
          }
        }
      }

      if (inputImageLoaded || resultImageLoaded) {
        y -= 20;
      }

      // Footer & Disclaimer
      page.drawText(
        "Disclaimer: This report is generated by an AI system and is for informational purposes only. Please consult a qualified medical professional for diagnosis and treatment.",
        { x: 50, y: 40, size: 9, font, color: rgb(0.5, 0.1, 0.1) }
      );
      
      page.drawText(`Generated: ${formatDate()}`, {
        x: 50,
        y: 25,
        size: 8,
        font,
      });

    } catch (error) {
      throw new PDFGenerationError("Error while drawing PDF content", error);
    }

    // Serialize PDF
    try {
      const pdfBytes = await pdfDoc.save();
      return pdfBytes; // Uint8Array, can be uploaded or sent as a file
    } catch (error) {
      throw new PDFGenerationError("Failed to serialize PDF", error);
    }

  } catch (error) {
    // Re-throw PDFGenerationError as-is, wrap others
    if (error instanceof PDFGenerationError) {
      throw error;
    }
    throw new PDFGenerationError("Unexpected error during PDF generation", error);
  }
}

// Usage example with error handling:
/*
try {
  const pdfBytes = await generatePDFReport({
    inputImageUrl: "https://example.com/input.jpg",
    resultImageUrl: "https://example.com/result.jpg",
    aiResults: {
      classification: "Benign",
      confidence: 95,
      additionalFindings: ["No suspicious masses detected"],
      doctorReview: "Results reviewed and confirmed.",
      aiModelVersion: "v2.1.0"
    },
    cancerType: "Breast Cancer",
    patient: {
      firstName: "John",
      lastName: "Doe",
      id: "P12345"
    },
    appointment: {
      id: "A67890",
      appointmentDate: { seconds: 1640995200 }
    },
    doctor: {
      firstName: "Jane",
      lastName: "Smith",
      id: "D001"
    }
  });
  
  console.log("PDF generated successfully");
} catch (error) {
  if (error instanceof PDFGenerationError) {
    console.error("PDF Generation Error:", error.message);
    if (error.cause) {
      console.error("Caused by:", error.cause);
    }
  } else if (error instanceof ImageFetchError) {
    console.error("Image Fetch Error:", error.message, "URL:", error.url);
  } else {
    console.error("Unexpected error:", error);
  }
}
*/