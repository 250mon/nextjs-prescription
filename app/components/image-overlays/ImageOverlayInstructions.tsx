"use client";

export default function ImageOverlayInstructions() {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        How to Use Custom Image Overlays
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-purple-600 font-bold text-xs">1</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Upload Image</p>
            <p>Select and upload your custom overlay image (PNG, JPG, SVG, GIF)</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-purple-600 font-bold text-xs">2</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Select Overlay</p>
            <p>Click &quot;Select This Overlay&quot; on the overlay you want to use</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-purple-600 font-bold text-xs">3</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Use on Main Page</p>
            <p>Return to the main page to see your custom overlay in the options</p>
          </div>
        </div>
      </div>
    </div>
  );
}
