"use client";

import { useState, useEffect } from "react";

export type OverlayOption = {
  id: string;
  name: string;
  path: string;
  type: 'svg' | 'image' | 'none';
};

export const overlayOptions: OverlayOption[] = [
  { id: 'none', name: 'No overlay', path: '', type: 'none' },
];

interface OverlaySelectorProps {
  selectedOverlay: string;
  onOverlayChange: (overlayId: string) => void;
  overlayPosition: { x: number; y: number }; // Now represents percentages (0-100)
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function OverlaySelector({ selectedOverlay, onOverlayChange, overlayPosition, onPositionChange }: OverlaySelectorProps) {
  const [allOverlays, setAllOverlays] = useState<OverlayOption[]>(overlayOptions);

  // Load custom overlays from localStorage
  useEffect(() => {
    const customOverlays = localStorage.getItem('customOverlays');
    if (customOverlays) {
      try {
        const parsed = JSON.parse(customOverlays);
        const customOptions: OverlayOption[] = parsed.map((overlay: { id: string; name: string; path: string }) => ({
          id: overlay.id,
          name: overlay.name,
          path: overlay.path,
          type: 'image' as const
        }));
        setAllOverlays([...overlayOptions, ...customOptions]);
      } catch (error) {
        console.error('Error loading custom overlays:', error);
      }
    }
  }, []);

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0)); // Clamp between 0-100
    onPositionChange({
      ...overlayPosition,
      [axis]: numValue
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Choose Overlay
      </h3>
      
      {/* Overlay Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {allOverlays.map((option) => (
          <button
            key={option.id}
            onClick={() => onOverlayChange(option.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedOverlay === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                {option.path ? (
                  <img 
                    src={option.path} 
                    alt={option.name}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded"></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {option.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Position Controls */}
      {selectedOverlay !== 'none' && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Overlay Position
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="x-position" className="block text-xs font-medium text-gray-600 mb-1">
                X Position (%)
              </label>
              <input
                id="x-position"
                type="number"
                min="0"
                max="100"
                step="1"
                value={overlayPosition.x}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>
            <div>
              <label htmlFor="y-position" className="block text-xs font-medium text-gray-600 mb-1">
                Y Position (%)
              </label>
              <input
                id="y-position"
                type="number"
                min="0"
                max="100"
                step="1"
                value={overlayPosition.y}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Position: ({overlayPosition.x}%, {overlayPosition.y}%)
            </p>
            <button
              onClick={() => onPositionChange({ x: 50, y: 50 })}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset to center
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
