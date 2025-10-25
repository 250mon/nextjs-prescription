"use client";

export default function EmptyTextOverlays() {
  return (
    <div className="text-center py-8">
      <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
      <h4 className="text-sm font-semibold text-gray-400 mb-1">No text overlays</h4>
      <p className="text-xs text-gray-500">Click &ldquo;Add Text&rdquo; to create your first text overlay</p>
    </div>
  );
}
