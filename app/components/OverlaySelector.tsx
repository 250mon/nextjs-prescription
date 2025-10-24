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
  overlayScale: number; // Scale factor for overlay size (0.01 to 0.5)
  onScaleChange: (scale: number) => void;
  onDefaultOverlayChange?: (overlayId: string) => void;
  initialPosition: { x: number; y: number }; // Initial position values
  initialScale: number; // Initial scale value
}

export default function OverlaySelector({ selectedOverlay, onOverlayChange, overlayPosition, onPositionChange, overlayScale, onScaleChange, onDefaultOverlayChange, initialPosition, initialScale }: OverlaySelectorProps) {
  const [allOverlays, setAllOverlays] = useState<OverlayOption[]>(overlayOptions);
  const [defaultOverlay, setDefaultOverlay] = useState<string>('none');

  // Load custom overlays and default overlay from localStorage
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

    // Load default overlay
    const savedDefaultOverlay = localStorage.getItem('defaultOverlay');
    if (savedDefaultOverlay) {
      setDefaultOverlay(savedDefaultOverlay);
    }
  }, []);

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0)); // Clamp between 0-100
    onPositionChange({
      ...overlayPosition,
      [axis]: numValue
    });
  };

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
        Choose Overlay
      </h3>
      
      {/* Overlay Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {allOverlays.map((option) => (
          <div
            key={option.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              selectedOverlay === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onOverlayChange(option.id)}
          >
            <div className="space-y-3">
              {/* Radio Button and Thumbnail Row */}
              <div className="flex items-start space-x-3">
                <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="radio"
                    id={`default-${option.id}`}
                    name="defaultOverlay"
                    checked={defaultOverlay === option.id}
                    onChange={() => handleSetDefaultOverlay(option.id)}
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
        ))}
      </div>

      {/* Default Overlay Info */}
      {defaultOverlay !== 'none' && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <span className="font-medium">Default overlay:</span> {allOverlays.find(opt => opt.id === defaultOverlay)?.name}
            <br />
          </p>
        </div>
      )}

      {/* Position and Scale Controls */}
      {selectedOverlay !== 'none' && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Overlay Settings
          </h4>
          
          {/* Position Controls */}
          <div className="grid grid-cols-2 gap-4 mb-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>
          </div>

          {/* Scale Control */}
          <div className="mb-4">
            <label htmlFor="overlay-scale" className="block text-xs font-medium text-gray-600 mb-1">
              Overlay Size ({Math.round(overlayScale * 100)}%)
            </label>
            <input
              id="overlay-scale"
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={overlayScale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Position: ({overlayPosition.x}%, {overlayPosition.y}%) • Size: {Math.round(overlayScale * 100)}%
            </p>
            <button
              onClick={() => {
                onPositionChange(initialPosition);
                onScaleChange(initialScale);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
