/**
 * Utility functions for API calls
 */

/**
 * Builds an API URL
 * @param path - The API path (e.g., '/api/overlays/list')
 * @returns The normalized URL path
 */
export function getApiUrl(path: string): string {
  // Ensure path starts with /
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Builds a static file URL
 * @param path - The static file path (e.g., '/uploads/overlays/image.png')
 * @returns The normalized URL path
 */
export function getStaticUrl(path: string): string {
  // Ensure path starts with /
  return path.startsWith('/') ? path : `/${path}`;
}

