"use client";

import { ImageOverlayCardProps } from "./types";

export default function ImageOverlayCard({ 
  option, 
  isSelected, 
  isDefault, 
  onSelect, 
  onSetDefault 
}: ImageOverlayCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Radio Button and Thumbnail Row */}
        <div className="flex items-start space-x-3">
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="radio"
              id={`default-${option.id}`}
              name="defaultOverlay"
              checked={isDefault}
              onChange={onSetDefault}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm">
            {option.path ? (
              <img 
                src={option.path} 
                alt={option.name}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Description Row */}
        <div className="text-center">
          <span className="text-sm font-medium text-gray-700">
            {option.name}
          </span>
        </div>
      </div>
    </div>
  );
}
