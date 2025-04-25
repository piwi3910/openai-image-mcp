# OpenAI Image MCP Server

An MCP (Model Context Protocol) server that allows generating images via the OpenAI DALL-E API.

## Features

- Generate images using DALL-E 3 with customizable parameters
- Save generated images to local files
- Implements the Model Context Protocol for seamless integration with MCP clients

## Prerequisites

- Node.js 18.x or higher
- OpenAI API key

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/openai-image-mcp.git
   cd openai-image-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

## Usage

### Starting the Server

Build and start the server:

```bash
npm run build
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will be available at `http://localhost:3000/mcp`.

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

### Example Client Usage

Here's an example of how to use this server with an MCP client:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function main() {
  // Create client
  const client = new Client({
    name: "image-client",
    version: "1.0.0"
  });

  // Connect to the server
  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3000/mcp")
  );
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

## License

MIT