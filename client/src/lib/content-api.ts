import { apiRequest } from "./queryClient";

export interface InstagramContentRequest {
  topic: string;
  contentType: "post" | "reel" | "story";
  options: {
    captionPreference: "yes" | "no";
    styles: string[];
  };
}

export interface LinkedInContentRequest {
  topic: string;
  style?: string;
}

export interface InstagramContentResponse {
  caption: string;
  hashtags: string[];
  contentType: string;
}

export interface LinkedInContentResponse {
  post: string;
  hashtags: string[];
}

export async function generateInstagramContent(request: InstagramContentRequest): Promise<InstagramContentResponse> {
  const response = await apiRequest("POST", "/api/content/instagram", request);
  return await response.json();
}

export async function generateLinkedInContent(request: LinkedInContentRequest): Promise<LinkedInContentResponse> {
  const response = await apiRequest("POST", "/api/content/linkedin", request);
  return await response.json();
}
