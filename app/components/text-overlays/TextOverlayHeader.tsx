"use client";

interface TextOverlayHeaderProps {
  overlayCount: number;
  isAddingText: boolean;
  onToggleAddText: () => void;
  onClearAll: () => void;
}

export default function TextOverlayHeader({ 
  overlayCount, 
  isAddingText, 
  onToggleAddText, 
  onClearAll 
}: TextOverlayHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Text Overlays ({overlayCount})
      </h3>
      <div className="flex space-x-2">
        {overlayCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
        <button
          onClick={onToggleAddText}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          {isAddingText ? 'Cancel' : 'Add Text'}
        </button>
      </div>
    </div>
  );
}
