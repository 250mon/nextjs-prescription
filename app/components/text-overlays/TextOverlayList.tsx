"use client";

import { TextOverlay } from "./types";
import TextOverlayCard from "./TextOverlayCard";
import EmptyTextOverlays from "./EmptyTextOverlays";

interface TextOverlayListProps {
  overlays: TextOverlay[];
  onEditOverlay: (overlay: TextOverlay) => void;
  onDeleteOverlay: (id: string) => void;
}

export default function TextOverlayList({ overlays, onEditOverlay, onDeleteOverlay }: TextOverlayListProps) {
  if (overlays.length === 0) {
    return <EmptyTextOverlays />;
  }

  return (
    <div className="space-y-3">
      {overlays.map((overlay) => (
        <TextOverlayCard
          key={overlay.id}
          overlay={overlay}
          onEdit={onEditOverlay}
          onDelete={onDeleteOverlay}
        />
      ))}
    </div>
  );
}
