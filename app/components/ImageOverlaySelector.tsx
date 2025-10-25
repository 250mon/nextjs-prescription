"use client";

import { useState, useEffect } from "react";
import ImageOverlayGrid from "./image-overlay-selector/ImageOverlayGrid";
import DefaultOverlayInfo from "./image-overlay-selector/DefaultOverlayInfo";
import ImageOverlaySettings from "./image-overlay-selector/ImageOverlaySettings";
import { ImageOverlayOption, ImageOverlaySelectorProps } from "./image-overlay-selector/types";

// Re-export for backward compatibility
export type { ImageOverlayOption } from "./image-overlay-selector/types";

export const imageOverlayOptions: ImageOverlayOption[] = [
  { id: 'none', name: 'No overlay', path: '', type: 'none' },
];

export default function ImageOverlaySelector({ selectedOverlay, onOverlayChange, overlayPosition, onPositionChange, overlayScale, onScaleChange, onDefaultOverlayChange, initialPosition, initialScale }: ImageOverlaySelectorProps) {
  const [allOverlays, setAllOverlays] = useState<ImageOverlayOption[]>(imageOverlayOptions);
  const [defaultOverlay, setDefaultOverlay] = useState<string>('none');

  // Load custom overlays from server and default overlay from localStorage
  useEffect(() => {
    const loadOverlays = async () => {
      try {
        const response = await fetch('/api/overlays/list');
        if (response.ok) {
          const overlays = await response.json();
          const customOptions: ImageOverlayOption[] = overlays.map((overlay: { id: string; name: string; path: string }) => ({
            id: overlay.id,
            name: overlay.name,
            path: overlay.path,
            type: 'image' as const
          }));
          setAllOverlays([...imageOverlayOptions, ...customOptions]);
        }
      } catch (error) {
        console.error('Error loading custom overlays:', error);
      }
    };

    loadOverlays();

    // Load default overlay
    const savedDefaultOverlay = localStorage.getItem('defaultOverlay');
    if (savedDefaultOverlay) {
      setDefaultOverlay(savedDefaultOverlay);
    }
  }, []);

  const handleSetDefaultOverlay = (overlayId: string) => {
    setDefaultOverlay(overlayId);
    localStorage.setItem('defaultOverlay', overlayId);
    if (onDefaultOverlayChange) {
      onDefaultOverlayChange(overlayId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Choose Image Overlay
      </h3>
      
      {/* Overlay Selection Grid */}
      <ImageOverlayGrid
        overlays={allOverlays}
        selectedOverlay={selectedOverlay}
        defaultOverlay={defaultOverlay}
        onOverlayChange={onOverlayChange}
        onSetDefaultOverlay={handleSetDefaultOverlay}
      />

      {/* Default Overlay Info */}
      <DefaultOverlayInfo
        defaultOverlay={defaultOverlay}
        overlays={allOverlays}
      />

      {/* Position and Scale Controls */}
      {selectedOverlay !== 'none' && (
        <ImageOverlaySettings
          overlayPosition={overlayPosition}
          overlayScale={overlayScale}
          onPositionChange={onPositionChange}
          onScaleChange={onScaleChange}
          initialPosition={initialPosition}
          initialScale={initialScale}
        />
      )}
    </div>
  );
}
