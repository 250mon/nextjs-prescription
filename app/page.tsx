"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ImageOverlaySelector from "./components/ImageOverlaySelector";
import FileUploader from "./components/FileUploader";
import FilePreview from "./components/FilePreview";
import TextOverlayManager, { TextOverlay } from "./components/TextOverlayManager";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedImageOverlay, setSelectedImageOverlay] = useState<string>('none');
  
  // Initial values for image overlay - single source of truth
  const initialImagePosition = { x: 38, y: 24 };
  const initialImageScale = 0.08;
  
  // Initial values for text overlay - single source of truth
  
  const [imageOverlayPosition, setImageOverlayPosition] = useState(initialImagePosition);
  const [imageOverlayScale, setImageOverlayScale] = useState<number>(initialImageScale);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);

  // Load default image overlay on component mount
  useEffect(() => {
    const savedDefaultOverlay = localStorage.getItem('defaultOverlay');
    if (savedDefaultOverlay) {
      setSelectedImageOverlay(savedDefaultOverlay);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Apply default image overlay when a new file is uploaded
    const savedDefaultOverlay = localStorage.getItem('defaultOverlay');
    if (savedDefaultOverlay && savedDefaultOverlay !== 'none') {
      setSelectedImageOverlay(savedDefaultOverlay);
    }
  };

  const handleFileReset = () => {
    setFile(null);
  };

  const handleTextOverlaysChange = (newTextOverlays: TextOverlay[]) => {
    setTextOverlays(newTextOverlays);
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
                Add image overlays and text annotations to your prescription images and download them locally
              </p>
              <p className="text-sm text-gray-500">
                Accepted formats: JPG, PNG, PDF • All processing happens in your browser
              </p>
            </div>
            <Link 
              href="/image-overlays"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors duration-200 text-sm"
            >
              Manage Image Overlays
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Upload and Overlay Section */}
          <div className="lg:col-span-1 space-y-6">
            <FileUploader 
              file={file}
              onFileSelect={handleFileSelect}
              onFileReset={handleFileReset}
            />

            {/* Image Overlay Selection */}
            <ImageOverlaySelector 
              selectedOverlay={selectedImageOverlay}
              onOverlayChange={setSelectedImageOverlay}
              overlayPosition={imageOverlayPosition}
              onPositionChange={setImageOverlayPosition}
              overlayScale={imageOverlayScale}
              onScaleChange={setImageOverlayScale}
              onDefaultOverlayChange={setSelectedImageOverlay}
              initialPosition={initialImagePosition}
              initialScale={initialImageScale}
            />

            {/* Text Overlay Manager */}
            <TextOverlayManager 
              textOverlays={textOverlays}
              onTextOverlaysChange={handleTextOverlaysChange}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            <FilePreview 
              file={file}
              selectedOverlay={selectedImageOverlay}
              overlayPosition={imageOverlayPosition}
              overlayScale={imageOverlayScale}
              textOverlays={textOverlays}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
