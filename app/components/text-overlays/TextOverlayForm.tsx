"use client";

import { useState } from "react";
import { TextOverlayFormData } from "./types";

interface TextOverlayFormProps {
  isEditing: boolean;
  initialData: TextOverlayFormData;
  onSave: (data: TextOverlayFormData) => void;
  onCancel: () => void;
}

export default function TextOverlayForm({ isEditing, initialData, onSave, onCancel }: TextOverlayFormProps) {
  const [formData, setFormData] = useState<TextOverlayFormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.text.trim()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    onCancel();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        {isEditing ? 'Edit Text Overlay' : 'Add New Text Overlay'}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Text Input */}
        <div>
          <label htmlFor="text-input" className="block text-xs font-medium text-gray-600 mb-1">
            Text Content
          </label>
          <input
            id="text-input"
            type="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Enter text to overlay..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
              value={formData.position.x}
              onChange={(e) => setFormData({ 
                ...formData, 
                position: { ...formData.position, x: parseInt(e.target.value) || 0 }
              })}
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
              value={formData.position.y}
              onChange={(e) => setFormData({ 
                ...formData, 
                position: { ...formData.position, y: parseInt(e.target.value) || 0 }
              })}
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
              value={formData.fontSize}
              onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) || 16 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="font-weight" className="block text-xs font-medium text-gray-600 mb-1">
              Font Weight
            </label>
            <select
              id="font-weight"
              value={formData.fontWeight}
              onChange={(e) => setFormData({ ...formData, fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Light</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.text.trim()}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
              !formData.text.trim()
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Add Text'}
          </button>
        </div>
      </form>
    </div>
  );
}
