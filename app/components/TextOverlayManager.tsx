"use client";

import { useState } from "react";

export interface TextOverlay {
  id: string;
  text: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  opacity: number;
}

interface TextOverlayManagerProps {
  textOverlays: TextOverlay[];
  onTextOverlaysChange: (overlays: TextOverlay[]) => void;
}

export default function TextOverlayManager({ textOverlays, onTextOverlaysChange }: TextOverlayManagerProps) {
  const [isAddingText, setIsAddingText] = useState(false);
  const [newText, setNewText] = useState("비대면진료");
  const [newPosition, setNewPosition] = useState({ x: 61, y: 68 });
  const [newFontSize, setNewFontSize] = useState(20);
  const [newFontWeight, setNewFontWeight] = useState("normal");
  const [editingOverlay, setEditingOverlay] = useState<string | null>(null);

  const addTextOverlay = () => {
    if (!newText.trim()) return;

    const newOverlay: TextOverlay = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: newText.trim(),
      x: newPosition.x,
      y: newPosition.y,
      fontSize: newFontSize,
      color: "#000000",
      fontFamily: "Arial",
      fontWeight: newFontWeight,
      opacity: 1,
    };

    onTextOverlaysChange([...textOverlays, newOverlay]);
    setNewText("비대면진료");
    setNewPosition({ x: 58, y: 70 });
    setNewFontSize(16);
    setNewFontWeight("normal");
    setIsAddingText(false);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    const updatedOverlays = textOverlays.map(overlay =>
      overlay.id === id ? { ...overlay, ...updates } : overlay
    );
    onTextOverlaysChange(updatedOverlays);
  };

  const startEditing = (overlay: TextOverlay) => {
    setEditingOverlay(overlay.id);
    setNewText(overlay.text);
    setNewPosition({ x: overlay.x, y: overlay.y });
    setNewFontSize(overlay.fontSize);
    setNewFontWeight(overlay.fontWeight);
    setIsAddingText(true);
  };

  const saveEdit = () => {
    if (!newText.trim() || !editingOverlay) return;

    const updatedOverlay: TextOverlay = {
      id: editingOverlay,
      text: newText.trim(),
      x: newPosition.x,
      y: newPosition.y,
      fontSize: newFontSize,
      color: "#000000",
      fontFamily: "Arial",
      fontWeight: newFontWeight,
      opacity: 1,
    };

    updateTextOverlay(editingOverlay, updatedOverlay);
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingOverlay(null);
    setNewText("비대면진료");
    setNewPosition({ x: 58, y: 70 });
    setNewFontSize(16);
    setNewFontWeight("normal");
    setIsAddingText(false);
  };

  const deleteTextOverlay = (id: string) => {
    const updatedOverlays = textOverlays.filter(overlay => overlay.id !== id);
    onTextOverlaysChange(updatedOverlays);
  };

  const clearAllTextOverlays = () => {
    if (textOverlays.length > 0 && confirm('Are you sure you want to delete all text overlays?')) {
      onTextOverlaysChange([]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Text Overlays ({textOverlays.length})
        </h3>
        <div className="flex space-x-2">
          {textOverlays.length > 0 && (
            <button
              onClick={clearAllTextOverlays}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => {
              if (isAddingText) {
                cancelEdit();
              } else {
                setIsAddingText(true);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {isAddingText ? 'Cancel' : 'Add Text'}
          </button>
        </div>
      </div>

      {/* Add Text Form */}
      {isAddingText && (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {editingOverlay ? 'Edit Text Overlay' : 'Add New Text Overlay'}
          </h4>
          
          <div className="space-y-3">
            {/* Text Input */}
            <div>
              <label htmlFor="text-input" className="block text-xs font-medium text-gray-600 mb-1">
                Text Content
              </label>
              <input
                id="text-input"
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter text to overlay..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Position Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="text-x" className="block text-xs font-medium text-gray-600 mb-1">
                  X Position (%)
                </label>
                <input
                  id="text-x"
                  type="number"
                  min="0"
                  max="100"
                  value={newPosition.x}
                  onChange={(e) => setNewPosition({ ...newPosition, x: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="text-y" className="block text-xs font-medium text-gray-600 mb-1">
                  Y Position (%)
                </label>
                <input
                  id="text-y"
                  type="number"
                  min="0"
                  max="100"
                  value={newPosition.y}
                  onChange={(e) => setNewPosition({ ...newPosition, y: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Font Settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="font-size" className="block text-xs font-medium text-gray-600 mb-1">
                  Font Size (px)
                </label>
                <input
                  id="font-size"
                  type="number"
                  min="8"
                  max="72"
                  value={newFontSize}
                  onChange={(e) => setNewFontSize(parseInt(e.target.value) || 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="font-weight" className="block text-xs font-medium text-gray-600 mb-1">
                  Font Weight
                </label>
                <select
                  id="font-weight"
                  value={newFontWeight}
                  onChange={(e) => setNewFontWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Light</option>
                </select>
              </div>
            </div>

            {/* Add/Edit Button */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={editingOverlay ? saveEdit : addTextOverlay}
                disabled={!newText.trim()}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  !newText.trim()
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {editingOverlay ? 'Save Changes' : 'Add Text'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Overlays List */}
      {textOverlays.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h4 className="text-sm font-semibold text-gray-400 mb-1">No text overlays</h4>
          <p className="text-xs text-gray-500">Click &ldquo;Add Text&rdquo; to create your first text overlay</p>
        </div>
      ) : (
        <div className="space-y-3">
          {textOverlays.map((overlay) => (
            <div key={overlay.id} className="border border-gray-200 rounded-lg p-3 bg-white">
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
                    onClick={() => startEditing(overlay)}
                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                    title="Edit text overlay"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteTextOverlay(overlay.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
