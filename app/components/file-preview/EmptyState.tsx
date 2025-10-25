"use client";

export default function EmptyState() {
  return (
    <div className="text-center py-8">
      <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-400 mb-2">No file selected</h3>
      <p className="text-sm text-gray-500">Upload a prescription to see the preview here</p>
    </div>
  );
}
