import { ImageOverlayOption } from "../ImageOverlaySelector";
import { TextOverlay } from "../TextOverlayManager";

export interface DownloadParams {
  file: File;
  selectedOverlay: string;
  overlayPosition: { x: number; y: number };
  overlayScale: number;
  textOverlays: TextOverlay[];
  allOverlays: ImageOverlayOption[];
}

export const downloadOverlayedImage = async ({
  file,
  selectedOverlay,
  overlayPosition,
  overlayScale,
  textOverlays,
  allOverlays
}: DownloadParams): Promise<void> => {
  if (!file || !file.type.startsWith('image/')) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Load the main image
  const mainImage = new Image();
  mainImage.crossOrigin = 'anonymous';
  
  await new Promise((resolve, reject) => {
    mainImage.onload = resolve;
    mainImage.onerror = reject;
    mainImage.src = URL.createObjectURL(file);
  });

  // Set canvas size to match image
  canvas.width = mainImage.width;
  canvas.height = mainImage.height;

  // Draw the main image
  ctx.drawImage(mainImage, 0, 0);

  // Load and draw image overlay if selected
  if (selectedOverlay !== 'none') {
    const overlayPath = allOverlays.find(opt => opt.id === selectedOverlay)?.path;
    if (overlayPath) {
      const overlayImage = new Image();
      overlayImage.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        overlayImage.onload = resolve;
        overlayImage.onerror = reject;
        overlayImage.src = overlayPath;
      });

      // Convert percentage-based coordinates to actual image coordinates
      const actualX = (overlayPosition.x / 100) * mainImage.width;
      const actualY = (overlayPosition.y / 100) * mainImage.height;
      
      // Calculate image overlay size relative to image size using the scale factor
      const overlaySize = Math.min(mainImage.width, mainImage.height) * overlayScale;
      
      // Draw image overlay at calculated position
      ctx.drawImage(
        overlayImage, 
        actualX,
        actualY,
        overlaySize, 
        overlaySize
      );
    }
  }

  // Draw text overlays
  if (textOverlays.length > 0) {
    textOverlays.forEach(textOverlay => {
      ctx.save();
      ctx.globalAlpha = textOverlay.opacity;
      ctx.fillStyle = textOverlay.color;
      ctx.font = `${textOverlay.fontWeight} ${textOverlay.fontSize}px ${textOverlay.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Convert percentage coordinates to actual image coordinates
      const actualX = (textOverlay.x / 100) * mainImage.width;
      const actualY = (textOverlay.y / 100) * mainImage.height;

      // Draw text
      ctx.fillText(textOverlay.text, actualX, actualY);
      ctx.restore();
    });
  }

  // Generate filename based on overlays
  const hasImageOverlay = selectedOverlay !== 'none';
  const hasTextOverlays = textOverlays.length > 0;
  
  let filename = 'prescription';
  if (hasImageOverlay && hasTextOverlays) {
    filename = `prescription-with-image-overlay-and-text-${Date.now()}.png`;
  } else if (hasImageOverlay) {
    filename = `prescription-with-image-overlay-${Date.now()}.png`;
  } else if (hasTextOverlays) {
    filename = `prescription-with-text-overlays-${Date.now()}.png`;
  } else {
    filename = `prescription-${Date.now()}.png`;
  }

  // Download the composed image
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(mainImage.src);
};
