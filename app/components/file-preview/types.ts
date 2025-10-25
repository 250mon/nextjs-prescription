import { ImageOverlayOption } from "../ImageOverlaySelector";
import { TextOverlay } from "../TextOverlayManager";

export interface FilePreviewProps {
  file: File | null;
  selectedOverlay: string;
  overlayPosition: { x: number; y: number };
  overlayScale: number;
  textOverlays: TextOverlay[];
}

export interface PreviewContainerProps {
  file: File;
  imageDimensions: { width: number; height: number } | null;
  selectedOverlay: string;
  overlayPosition: { x: number; y: number };
  overlayScale: number;
  textOverlays: TextOverlay[];
  allOverlays: ImageOverlayOption[];
}
