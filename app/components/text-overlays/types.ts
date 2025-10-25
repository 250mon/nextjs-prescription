export interface TextOverlay {
  id: string;
  text: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  opacity: number;
}

export interface TextOverlayFormData {
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  fontWeight: string;
}

export interface TextOverlayManagerProps {
  textOverlays: TextOverlay[];
  onTextOverlaysChange: (overlays: TextOverlay[]) => void;
}
