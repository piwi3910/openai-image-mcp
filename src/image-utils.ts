import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fetch } from 'undici';
import { SaveImageParams, SaveImageResponse } from './types.js';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Save an image from a URL to a local file
 * @param params Parameters for saving the image
 * @returns Information about the saved file
 */
export async function saveImage(params: SaveImageParams): Promise<SaveImageResponse> {
  const { imageUrl, filePath } = params;
  
  try {
    console.log(`Downloading image from: ${imageUrl}`);
    
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    // Get the image data as a buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Ensure the directory exists
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Resolve the absolute path
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.resolve(__dirname, '..', filePath);
    
    // Write the image to the file
    fs.writeFileSync(absolutePath, Buffer.from(imageBuffer));
    
    console.log(`Image saved to: ${absolutePath}`);
    
    return {
      filePath: absolutePath,
      success: true,
    };
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}