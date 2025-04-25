import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Create client
  const client = new Client({
    name: "image-client",
    version: "1.0.0"
  });

  // Connect to the server
  const transport = new StdioClientTransport({
    command: "node",
    args: ["../dist/index.js"]
  });
  
  console.log("Connecting to MCP server...");
  await client.connect(transport);
  console.log("Connected to MCP server");

  try {
    // Create images directory if it doesn't exist
    const imagesDir = path.join(__dirname, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Generate an image
    console.log("Generating image...");
    const generateResult = await client.callTool({
      name: "generate-image",
      arguments: {
        prompt: "A futuristic city with flying cars and neon lights",
        size: "1024x1024",
        quality: "hd",
        style: "vivid"
      }
    });

    const imageData = JSON.parse(generateResult.content[0].text);
    console.log("Generated image:", imageData);
    console.log("Image URL:", imageData.url);
    console.log("Revised prompt:", imageData.revisedPrompt);

    // Save the image
    console.log("Saving image...");
    const saveResult = await client.callTool({
      name: "save-image",
      arguments: {
        imageUrl: imageData.url,
        filePath: path.join(imagesDir, "futuristic-city.png")
      }
    });

    const saveData = JSON.parse(saveResult.content[0].text);
    console.log("Saved image:", saveData);
    console.log("Image saved to:", saveData.filePath);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    console.log("Closing connection...");
    await transport.close();
    console.log("Connection closed");
  }
}

main().catch(console.error);