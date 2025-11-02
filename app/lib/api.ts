/**
 * Utility functions for API calls that respect the basePath configuration
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Builds an API URL with the basePath prefix
 * @param path - The API path (e.g., '/api/overlays/list')
 * @returns The full URL with basePath (e.g., '/prescription/api/overlays/list')
 */
export function getApiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}

/**
 * Builds a static file URL with the basePath prefix
 * @param path - The static file path (e.g., '/uploads/overlays/image.png')
 * @returns The full URL with basePath (e.g., '/prescription/uploads/overlays/image.png')
 */
export function getStaticUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}

