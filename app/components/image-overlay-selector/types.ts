export type ImageOverlayOption = {
  id: string;
  name: string;
  path: string;
  type: 'svg' | 'image' | 'none';
};

export interface ImageOverlaySelectorProps {
  selectedOverlay: string;
  onOverlayChange: (overlayId: string) => void;
  overlayPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  overlayScale: number;
  onScaleChange: (scale: number) => void;
  onDefaultOverlayChange?: (overlayId: string) => void;
  initialPosition: { x: number; y: number };
  initialScale: number;
}

export interface ImageOverlayCardProps {
  option: ImageOverlayOption;
  isSelected: boolean;
  isDefault: boolean;
  onSelect: () => void;
  onSetDefault: () => void;
}

export interface ImageOverlayGridProps {
  overlays: ImageOverlayOption[];
  selectedOverlay: string;
  defaultOverlay: string;
  onOverlayChange: (overlayId: string) => void;
  onSetDefaultOverlay: (overlayId: string) => void;
}

export interface DefaultOverlayInfoProps {
  defaultOverlay: string;
  overlays: ImageOverlayOption[];
}

export interface ImageOverlaySettingsProps {
  overlayPosition: { x: number; y: number };
  overlayScale: number;
  onPositionChange: (position: { x: number; y: number }) => void;
  onScaleChange: (scale: number) => void;
  initialPosition: { x: number; y: number };
  initialScale: number;
}
