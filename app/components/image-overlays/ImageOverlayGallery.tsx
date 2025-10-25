"use client";

import { CustomImageOverlay } from "../types";
import ImageOverlayCard from "./ImageOverlayCard";

interface ImageOverlayGalleryProps {
  overlays: CustomImageOverlay[];
  onDeleteOverlay: (overlayId: string) => void;
  onSelectOverlay: (overlay: CustomImageOverlay) => void;
  onClearAll: () => void;
}

export default function ImageOverlayGallery({ 
  overlays, 
  onDeleteOverlay, 
  onSelectOverlay, 
  onClearAll 
}: ImageOverlayGalleryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Custom Image Overlays ({overlays.length})
        </h2>
        {overlays.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {overlays.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No custom image overlays</h3>
          <p className="text-gray-500">Upload your first custom image overlay to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {overlays.map((overlay) => (
            <ImageOverlayCard
              key={overlay.id}
              overlay={overlay}
              onDelete={onDeleteOverlay}
              onSelect={onSelectOverlay}
            />
          ))}
        </div>
      )}
    </div>
  );
}
