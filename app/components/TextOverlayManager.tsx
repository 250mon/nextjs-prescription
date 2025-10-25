"use client";

import { useState } from "react";
import TextOverlayHeader from "./text-overlays/TextOverlayHeader";
import TextOverlayForm from "./text-overlays/TextOverlayForm";
import TextOverlayList from "./text-overlays/TextOverlayList";
import { TextOverlay, TextOverlayFormData, TextOverlayManagerProps } from "./text-overlays/types";

// Re-export the TextOverlay interface for backward compatibility
export type { TextOverlay } from "./text-overlays/types";

export default function TextOverlayManager({ textOverlays, onTextOverlaysChange }: TextOverlayManagerProps) {
  // Initial values for text overlay - single source of truth
  const initialFormData: TextOverlayFormData = {
    text: "비대면진료",
    position: { x: 61, y: 68 },
    fontSize: 20,
    fontWeight: "normal"
  };

  const [isAddingText, setIsAddingText] = useState(false);
  const [editingOverlay, setEditingOverlay] = useState<string | null>(null);

  const handleSaveForm = (formData: TextOverlayFormData) => {
    const newOverlay: TextOverlay = {
      id: editingOverlay || `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: formData.text.trim(),
      x: formData.position.x,
      y: formData.position.y,
      fontSize: formData.fontSize,
      color: "#000000",
      fontFamily: "Arial",
      fontWeight: formData.fontWeight,
      opacity: 1,
    };

    if (editingOverlay) {
      // Update existing overlay
      const updatedOverlays = textOverlays.map(overlay =>
        overlay.id === editingOverlay ? newOverlay : overlay
      );
      onTextOverlaysChange(updatedOverlays);
    } else {
      // Add new overlay
      onTextOverlaysChange([...textOverlays, newOverlay]);
    }

    handleCancelForm();
  };

  const handleCancelForm = () => {
    setEditingOverlay(null);
    setIsAddingText(false);
  };

  const handleEditOverlay = (overlay: TextOverlay) => {
    setEditingOverlay(overlay.id);
    setIsAddingText(true);
  };

  const handleDeleteOverlay = (id: string) => {
    const updatedOverlays = textOverlays.filter(overlay => overlay.id !== id);
    onTextOverlaysChange(updatedOverlays);
  };

  const handleClearAll = () => {
    if (textOverlays.length > 0 && confirm('Are you sure you want to delete all text overlays?')) {
      onTextOverlaysChange([]);
    }
  };

  const handleToggleAddText = () => {
    if (isAddingText) {
      handleCancelForm();
    } else {
      setIsAddingText(true);
    }
  };

  const getFormData = (): TextOverlayFormData => {
    if (editingOverlay) {
      const overlay = textOverlays.find(o => o.id === editingOverlay);
      if (overlay) {
        return {
          text: overlay.text,
          position: { x: overlay.x, y: overlay.y },
          fontSize: overlay.fontSize,
          fontWeight: overlay.fontWeight
        };
      }
    }
    return initialFormData;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <TextOverlayHeader
        overlayCount={textOverlays.length}
        isAddingText={isAddingText}
        onToggleAddText={handleToggleAddText}
        onClearAll={handleClearAll}
      />

      {/* Add/Edit Text Form */}
      {isAddingText && (
        <TextOverlayForm
          isEditing={!!editingOverlay}
          initialData={getFormData()}
          onSave={handleSaveForm}
          onCancel={handleCancelForm}
        />
      )}

      {/* Text Overlays List */}
      <TextOverlayList
        overlays={textOverlays}
        onEditOverlay={handleEditOverlay}
        onDeleteOverlay={handleDeleteOverlay}
      />
    </div>
  );
}
