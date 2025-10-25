"use client";

import { ImageOverlaySettingsProps } from "./types";

export default function ImageOverlaySettings({
  overlayPosition,
  overlayScale,
  onPositionChange,
  onScaleChange,
  initialPosition,
  initialScale
}: ImageOverlaySettingsProps) {
  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0)); // Clamp between 0-100
    onPositionChange({
      ...overlayPosition,
      [axis]: numValue
    });
  };

  const handleReset = () => {
    onPositionChange(initialPosition);
    onScaleChange(initialScale);
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Image Overlay Settings
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
          onClick={handleReset}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
