"use client";

import { ImageOverlayGridProps } from "./types";
import ImageOverlayCard from "./ImageOverlayCard";

export default function ImageOverlayGrid({ 
  overlays, 
  selectedOverlay, 
  defaultOverlay, 
  onOverlayChange, 
  onSetDefaultOverlay 
}: ImageOverlayGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {overlays.map((option) => (
        <ImageOverlayCard
          key={option.id}
          option={option}
          isSelected={selectedOverlay === option.id}
          isDefault={defaultOverlay === option.id}
          onSelect={() => onOverlayChange(option.id)}
          onSetDefault={() => onSetDefaultOverlay(option.id)}
        />
      ))}
    </div>
  );
}
