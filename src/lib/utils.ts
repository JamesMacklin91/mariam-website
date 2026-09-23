
/**
 * Converts a standard Google Drive shareable link into a direct image stream URL.
 * Handles both full view URLs and raw File IDs.
 */
export function formatImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  // Trim whitespace
  const trimmed = url.trim();

  // Check if it's a Google Drive link
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    // Extract the File ID using regex
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
    
    if (match && match[1]) {
      const fileId = match[1];
      // Returns high-res direct image thumbnail/stream link
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }

  // Return original URL for non-Google Drive links (Imgur, Unsplash, etc.)
  return trimmed;
}