#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env file from current directory
dotenv.config();

// If OPENAI_API_KEY is not set, check if it's in the environment
if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY environment variable is not set.');
  console.warn('You will need to set it before generating images.');
  console.warn('Example: OPENAI_API_KEY=your_key_here openai-dalle-mcp');
}

async function main() {
  try {
    console.log('Starting OpenAI DALL-E MCP Server...');
    
    // Create MCP server
    const mcpServer = createServer();
    
    // Create stdio transport
    const transport = new StdioServerTransport();
    
    // Connect to the MCP server
    console.log('Connecting to MCP server...');
    await mcpServer.connect(transport);
    
    console.log('OpenAI DALL-E MCP Server is running');
    console.log('Use Ctrl+C to stop the server');
    
    // Handle process termination
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await transport.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(console.error);