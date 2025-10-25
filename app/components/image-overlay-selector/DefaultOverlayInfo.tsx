"use client";

import { DefaultOverlayInfoProps } from "./types";

export default function DefaultOverlayInfo({ defaultOverlay, overlays }: DefaultOverlayInfoProps) {
  if (defaultOverlay === 'none') {
    return null;
  }

  const defaultOverlayName = overlays.find(opt => opt.id === defaultOverlay)?.name;

  return (
    <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-xs text-blue-700">
        <span className="font-medium">Default overlay:</span> {defaultOverlayName}
        <br />
      </p>
    </div>
  );
}
