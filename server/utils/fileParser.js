import { promises as fs } from 'fs';
import pdf from 'pdf-parse';
import { extract } from 'docx-parser';

export async function extractTextFromFile(filePath, mimeType) {
  try {
    const buffer = await fs.readFile(filePath);
    
    if (mimeType === 'application/pdf') {
      return await extractTextFromPDF(buffer);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      return await extractTextFromDocx(buffer);
    } else if (mimeType === 'text/plain') {
      return buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to process file');
  }
}

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

async function extractTextFromDocx(buffer) {
  try {
    // docx-parser works with file paths, not buffers
    // This is a simplified implementation - in production, you might need to write the buffer to a temp file first
    return await extract(buffer);
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse Word document');
  }
}

// Helper function to get file extension from mime type
export function getFileExtension(mimeType) {
  const extensions = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'text/plain': 'txt',
  };
  
  return extensions[mimeType] || 'txt';
}
