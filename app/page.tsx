"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OverlaySelector from "./components/OverlaySelector";
import FileUploader from "./components/FileUploader";
import FilePreview from "./components/FilePreview";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<string>('none');
  
  // Initial values - single source of truth
  const initialPosition = { x: 43, y: 28 };
  const initialScale = 0.08;
  
  const [overlayPosition, setOverlayPosition] = useState(initialPosition);
  const [overlayScale, setOverlayScale] = useState<number>(initialScale);

  // Load default overlay on component mount
  useEffect(() => {
    const savedDefaultOverlay = localStorage.getItem('defaultOverlay');
    if (savedDefaultOverlay) {
      setSelectedOverlay(savedDefaultOverlay);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Apply default overlay when a new file is uploaded
    const savedDefaultOverlay = localStorage.getItem('defaultOverlay');
    if (savedDefaultOverlay && savedDefaultOverlay !== 'none') {
      setSelectedOverlay(savedDefaultOverlay);
    }
  };

  const handleFileReset = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Prescription Overlay Tool
              </h1>
              <p className="text-gray-600 mb-2">
                Add overlays to your prescription images and download them locally
              </p>
              <p className="text-sm text-gray-500">
                Accepted formats: JPG, PNG, PDF • All processing happens in your browser
              </p>
            </div>
            <Link 
              href="/overlays"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200 text-sm"
            >
              Manage Overlays
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Upload Section */}
          <div className="space-y-6">
            <FileUploader 
              file={file}
              onFileSelect={handleFileSelect}
              onFileReset={handleFileReset}
            />

            {/* Overlay Selection */}
            <OverlaySelector 
              selectedOverlay={selectedOverlay}
              onOverlayChange={setSelectedOverlay}
              overlayPosition={overlayPosition}
              onPositionChange={setOverlayPosition}
              overlayScale={overlayScale}
              onScaleChange={setOverlayScale}
              onDefaultOverlayChange={setSelectedOverlay}
              initialPosition={initialPosition}
              initialScale={initialScale}
            />
          </div>

          {/* Preview Section */}
          <div>
            <FilePreview 
              file={file}
              selectedOverlay={selectedOverlay}
              overlayPosition={overlayPosition}
              overlayScale={overlayScale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
