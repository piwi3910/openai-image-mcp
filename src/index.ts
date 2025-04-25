import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('Starting OpenAI Image MCP Server...');
    
    // Create MCP server
    const mcpServer = createServer();
    
    // Create stdio transport
    const transport = new StdioServerTransport();
    
    // Connect to the MCP server
    console.log('Connecting to MCP server...');
    await mcpServer.connect(transport);
    
    console.log('OpenAI Image MCP Server is running');
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