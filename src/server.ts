import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { generateImage } from './openai-client.js';
import { saveImage } from './image-utils.js';

/**
 * Create and configure the MCP server
 * @returns Configured MCP server instance
 */
export function createServer(): McpServer {
  // Create a new MCP server
  const server = new McpServer({
    name: 'OpenAI Image Generator',
    version: '1.0.0',
  });

  // Define the generate-image tool
  server.tool(
    'generate-image',
    {
      prompt: z.string().min(1).describe('Text description of the image to generate'),
      size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional().describe('Size of the generated image'),
      quality: z.enum(['standard', 'hd']).optional().describe('Quality of the generated image'),
      style: z.enum(['vivid', 'natural']).optional().describe('Style of the generated image'),
    },
    async ({ prompt, size, quality, style }) => {
      try {
        const result = await generateImage({
          prompt,
          size,
          quality,
          style,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                url: result.url,
                revisedPrompt: result.revisedPrompt,
              }),
            },
          ],
        };
      } catch (error: any) {
        console.error('Error in generate-image tool:', error);
        
        return {
          content: [
            {
              type: 'text',
              text: `Error generating image: ${error.message || 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Define the save-image tool
  server.tool(
    'save-image',
    {
      imageUrl: z.string().url().describe('URL of the image to save'),
      filePath: z.string().min(1).describe('Path where the image should be saved'),
    },
    async ({ imageUrl, filePath }) => {
      try {
        const result = await saveImage({
          imageUrl,
          filePath,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                filePath: result.filePath,
                success: result.success,
              }),
            },
          ],
        };
      } catch (error: any) {
        console.error('Error in save-image tool:', error);
        
        return {
          content: [
            {
              type: 'text',
              text: `Error saving image: ${error.message || 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}