"use client";

import { CustomImageOverlay } from "../types";

interface ImageOverlayCardProps {
  overlay: CustomImageOverlay;
  onDelete: (overlayId: string) => void;
  onSelect: (overlay: CustomImageOverlay) => void;
}

export default function ImageOverlayCard({ overlay, onDelete, onSelect }: ImageOverlayCardProps) {
  const handleSelect = () => {
    // Store selected overlay in localStorage for main page to use
    localStorage.setItem('selectedCustomOverlay', JSON.stringify(overlay));
    onSelect(overlay);
  };

  return (
    <div className="group relative bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
      {/* Image Preview */}
      <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
        <img 
          src={overlay.path}
          alt={overlay.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Overlay Info */}
      <div className="space-y-1">
        <p className="font-medium text-gray-900 text-sm truncate">
          {overlay.name}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(overlay.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onDelete(overlay.id)}
          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
          title="Delete overlay"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Select Button */}
      <button
        onClick={handleSelect}
        className="w-full mt-3 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
      >
        Select This Overlay
      </button>
    </div>
  );
}
