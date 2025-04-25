# OpenAI DALL-E MCP Server

[![npm version](https://img.shields.io/npm/v/openai-dalle-mcp.svg)](https://www.npmjs.com/package/openai-dalle-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A stateless MCP (Model Context Protocol) server that allows generating images via the OpenAI DALL-E API.

> **Now available on npm!** Install with `npm install openai-dalle-mcp`

## Features

- Generate images using DALL-E 3 with customizable parameters
- Save generated images to local files
- Implements the Model Context Protocol for seamless integration with MCP clients
- Stateless design using stdio transport

## Prerequisites

- Node.js 18.x or higher
- OpenAI API key

## Installation

### Option 1: Install from npm (Recommended)

```bash
# Install globally
npm install -g openai-dalle-mcp

# Or install locally in your project
npm install openai-dalle-mcp
```

### Option 2: Clone the Repository

1. Clone this repository:
   ```bash
   git clone https://github.com/piwi3910/openai-dalle-mcp.git
   cd openai-dalle-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the package:
   ```bash
   npm run build
   ```

## Usage

### Using as a Command Line Tool (when installed globally)

```bash
# Set your OpenAI API key as an environment variable
export OPENAI_API_KEY=your_openai_api_key_here

# Run the server
openai-dalle-mcp
```

### Using in Your Project

The server is designed to be used with stdio transport, which means it doesn't run as a standalone service. Instead, it's started by MCP clients when needed.

```javascript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Create client
const client = new Client({
  name: "image-client",
  version: "1.0.0"
});

// Connect to the server
const transport = new StdioClientTransport({
  command: "openai-dalle-mcp", // If installed globally
  // Or use the path to the node_modules binary
  // command: "./node_modules/.bin/openai-dalle-mcp",
  env: {
    OPENAI_API_KEY: "your_openai_api_key_here"
  }
});

await client.connect(transport);
```

### MCP Server Configuration

To add this server to your MCP configuration file (typically `mcp_settings.json`), add the following entry:

```json
{
  "servers": [
    {
      "name": "openai-dalle",
      "command": "openai-dalle-mcp",
      "env": {
        "OPENAI_API_KEY": "your_openai_api_key_here"
      }
    }
  ]
}
```

If you've installed the package locally in your project:

```json
{
  "servers": [
    {
      "name": "openai-dalle",
      "command": "node",
      "args": ["./node_modules/.bin/openai-dalle-mcp"],
      "env": {
        "OPENAI_API_KEY": "your_openai_api_key_here"
      }
    }
  ]
}
```

### Available Tools

#### 1. generate-image

Generates an image using OpenAI's DALL-E 3 model.

Parameters:
- `prompt` (string, required): Text description of the image to generate
- `size` (string, optional): Size of the generated image. Options: "1024x1024" (default), "1792x1024", "1024x1792"
- `quality` (string, optional): Quality of the generated image. Options: "standard" (default), "hd"
- `style` (string, optional): Style of the generated image. Options: "vivid" (default), "natural"

Returns:
- `url`: URL of the generated image
- `revisedPrompt`: The prompt after OpenAI's revision process

#### 2. save-image

Saves an image from a URL to a local file.

Parameters:
- `imageUrl` (string, required): URL of the image to save
- `filePath` (string, required): Path where the image should be saved

Returns:
- `filePath`: Absolute path where the image was saved
- `success`: Boolean indicating whether the operation was successful

### Using with MCP-enabled AI Assistants

Once configured in your MCP settings, you can use this server with AI assistants that support the Model Context Protocol. For example, with Claude:

```
You can now generate images using DALL-E 3. Try using the openai-dalle server's generate-image tool with a prompt like "a futuristic city with flying cars".
```

### Example Client Usage

Here's an example of how to use this server with an MCP client:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  // Create client
  const client = new Client({
    name: "image-client",
    version: "1.0.0"
  });

  // Connect to the server
  const transport = new StdioClientTransport({
    command: "openai-dalle-mcp", // If installed globally
    // Or if installed locally in your project:
    // command: "./node_modules/.bin/openai-dalle-mcp",
    env: {
      OPENAI_API_KEY: "your_openai_api_key_here"
    }
  });
  await client.connect(transport);

  try {
    // Generate an image
    const generateResult = await client.callTool({
      name: "generate-image",
      arguments: {
        prompt: "A futuristic city with flying cars and neon lights",
        size: "1024x1024",
        quality: "hd",
        style: "vivid"
      }
    });

    console.log("Generated image:", JSON.parse(generateResult.content[0].text));

    // Save the image
    const imageData = JSON.parse(generateResult.content[0].text);
    const saveResult = await client.callTool({
      name: "save-image",
      arguments: {
        imageUrl: imageData.url,
        filePath: "./images/futuristic-city.png"
      }
    });

    console.log("Saved image:", JSON.parse(saveResult.content[0].text));
  } finally {
    // Close the connection
    await transport.close();
  }
}

main().catch(console.error);
```

### Running the Example Client

We've included an example client in the `examples` directory:

1. Navigate to the examples directory:
   ```bash
   cd examples
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the client:
   ```bash
   npm run build
   ```

4. Run the client:
   ```bash
   npm start
   ```

The example client will generate an image of a futuristic city and save it to the `examples/images` directory.

## Versioning and Updates

Current version: **1.0.1**

To update to the latest version:

```bash
# For global installation
npm update -g openai-dalle-mcp

# For local installation
npm update openai-dalle-mcp
```

Check for the latest version on [npm](https://www.npmjs.com/package/openai-dalle-mcp).

## License

MIT