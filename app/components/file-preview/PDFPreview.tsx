"use client";

import { ImageOverlayOption } from "../ImageOverlaySelector";
import { TextOverlay } from "../TextOverlayManager";

interface PDFPreviewProps {
  file: File;
  selectedOverlay: string;
  overlayPosition: { x: number; y: number };
  overlayScale: number;
  textOverlays: TextOverlay[];
  allOverlays: ImageOverlayOption[];
}

export default function PDFPreview({
  file,
  selectedOverlay,
  overlayPosition,
  overlayScale,
  textOverlays,
  allOverlays
}: PDFPreviewProps) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 font-medium">PDF Document</p>
        <p className="text-sm text-gray-400">{file.name}</p>
      </div>
      
      {/* Selected image overlay for PDF */}
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
      
      {/* Text overlays for PDF */}
      {textOverlays.map((textOverlay) => (
        <div
          key={textOverlay.id}
          className="absolute pointer-events-none"
          style={{
            left: `${textOverlay.x}%`,
            top: `${textOverlay.y}%`,
            transform: 'translate(0%, 0%)',
            color: textOverlay.color,
            fontSize: `${Math.max(8, Math.min(24, textOverlay.fontSize)) * 0.5}px`,
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
