"use client";

import { TextOverlay } from "./types";

interface TextOverlayCardProps {
  overlay: TextOverlay;
  onEdit: (overlay: TextOverlay) => void;
  onDelete: (id: string) => void;
}

export default function TextOverlayCard({ overlay, onEdit, onDelete }: TextOverlayCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span 
              className="text-sm font-medium truncate"
              style={{ 
                color: overlay.color,
                fontFamily: overlay.fontFamily,
                fontWeight: overlay.fontWeight,
                fontSize: `${Math.min(overlay.fontSize, 14)}px`
              }}
            >
              &ldquo;{overlay.text}&rdquo;
            </span>
            <span className="text-xs text-gray-500">
              ({overlay.x}%, {overlay.y}%)
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-medium">Size:</span> {overlay.fontSize}px
            </div>
            <div>
              <span className="font-medium">Weight:</span> {overlay.fontWeight}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(overlay)}
            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
            title="Edit text overlay"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(overlay.id)}
            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            title="Delete text overlay"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
