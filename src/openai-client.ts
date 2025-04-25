import OpenAI from 'openai';
import { GenerateImageParams, GenerateImageResponse } from './types.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an image using OpenAI's DALL-E API
 * @param params Parameters for image generation
 * @returns Generated image URL and revised prompt
 */
export async function generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
  try {
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' } = params;
    
    console.log(`Generating image with prompt: "${prompt}"`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      quality,
      style,
      response_format: 'url',
    });
    
    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;
    
    console.log(`Image generated successfully: ${imageUrl}`);
    
    return {
      url: imageUrl,
      revisedPrompt,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}