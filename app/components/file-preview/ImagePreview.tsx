"use client";

import { ImageOverlayOption } from "../ImageOverlaySelector";
import { TextOverlay } from "../TextOverlayManager";

interface ImagePreviewProps {
  file: File;
  imageDimensions: { width: number; height: number } | null;
  selectedOverlay: string;
  overlayPosition: { x: number; y: number };
  overlayScale: number;
  textOverlays: TextOverlay[];
  allOverlays: ImageOverlayOption[];
}

export default function ImagePreview({
  file,
  imageDimensions,
  selectedOverlay,
  overlayPosition,
  overlayScale,
  textOverlays,
  allOverlays
}: ImagePreviewProps) {
  return (
    <div 
      className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 relative" 
      data-preview-container
      style={{
        aspectRatio: imageDimensions ? `${imageDimensions.width} / ${imageDimensions.height}` : '4 / 3'
      }}
    >
      <img 
        src={URL.createObjectURL(file)} 
        alt="Prescription preview" 
        className="w-full h-full object-cover"
      />
      
      {/* Selected image overlay */}
      {selectedOverlay !== 'none' && (
        <div 
          className="absolute" 
          style={{ 
            left: `${overlayPosition.x}%`, 
            top: `${overlayPosition.y}%`,
            pointerEvents: 'none',
            transform: 'translate(0%, 0%)' // Center the overlay on the position
          }}
        >
          <img 
            src={allOverlays.find(opt => opt.id === selectedOverlay)?.path}
            alt="Image overlay"
            className="object-contain opacity-100"
            style={{ 
              width: `${Math.max(16, Math.min(64, overlayScale * 800))}px`, 
              height: `${Math.max(16, Math.min(64, overlayScale * 800))}px` 
            }}
          />
        </div>
      )}
      
      {/* Text overlays */}
      {textOverlays.map((textOverlay) => (
        <div
          key={textOverlay.id}
          className="absolute pointer-events-none"
          style={{
            left: `${textOverlay.x}%`,
            top: `${textOverlay.y}%`,
            transform: 'translate(0%, 0%)',
            color: textOverlay.color,
            fontSize: `${Math.max(8, Math.min(24, textOverlay.fontSize * 0.7))}px`,
            fontFamily: textOverlay.fontFamily,
            fontWeight: textOverlay.fontWeight,
            opacity: textOverlay.opacity,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {textOverlay.text}
        </div>
      ))}
    </div>
  );
}
