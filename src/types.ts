// Types for OpenAI DALL-E image generation

export type ImageSize = "1024x1024" | "1792x1024" | "1024x1792";
export type ImageQuality = "standard" | "hd";
export type ImageStyle = "vivid" | "natural";

export interface GenerateImageParams {
  prompt: string;
  size?: ImageSize;
  quality?: ImageQuality;
  style?: ImageStyle;
}

export interface GenerateImageResponse {
  url: string;
  revisedPrompt?: string;
}

export interface SaveImageParams {
  imageUrl: string;
  filePath: string;
}

export interface SaveImageResponse {
  filePath: string;
  success: boolean;
}