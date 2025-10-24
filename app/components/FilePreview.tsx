"use client";

import { useState, useEffect } from "react";
import { overlayOptions, OverlayOption } from "./OverlaySelector";

interface FilePreviewProps {
  file: File | null;
  selectedOverlay: string;
  overlayPosition: { x: number; y: number }; // Now represents percentages (0-100)
  overlayScale: number; // Scale factor for overlay size
}

export default function FilePreview({ file, selectedOverlay, overlayPosition, overlayScale }: FilePreviewProps) {
  const [allOverlays, setAllOverlays] = useState<OverlayOption[]>(overlayOptions);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load custom overlays from server
  useEffect(() => {
    const loadOverlays = async () => {
      try {
        const response = await fetch('/api/overlays/list');
        if (response.ok) {
          const overlays = await response.json();
          const customOptions: OverlayOption[] = overlays.map((overlay: { id: string; name: string; path: string }) => ({
            id: overlay.id,
            name: overlay.name,
            path: overlay.path,
            type: 'image' as const
          }));
          setAllOverlays([...overlayOptions, ...customOptions]);
        }
      } catch (error) {
        console.error('Error loading custom overlays:', error);
      }
    };

    loadOverlays();
  }, []);

  const downloadOverlayedImage = async () => {
    if (!file || !file.type.startsWith('image/')) return;

    setIsDownloading(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Load the main image
      const mainImage = new Image();
      mainImage.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        mainImage.onload = resolve;
        mainImage.onerror = reject;
        mainImage.src = URL.createObjectURL(file);
      });

      // Set canvas size to match image
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;

      // Draw the main image
      ctx.drawImage(mainImage, 0, 0);

      // Load and draw overlay if selected
      if (selectedOverlay !== 'none') {
        const overlayPath = allOverlays.find(opt => opt.id === selectedOverlay)?.path;
        if (overlayPath) {
          const overlayImage = new Image();
          overlayImage.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            overlayImage.onload = resolve;
            overlayImage.onerror = reject;
            overlayImage.src = overlayPath;
          });

          // Convert percentage-based coordinates to actual image coordinates
          // overlayPosition.x and overlayPosition.y are now percentages (0-100)
          const actualX = (overlayPosition.x / 100) * mainImage.width;
          const actualY = (overlayPosition.y / 100) * mainImage.height;
          
          // Calculate overlay size relative to image size using the scale factor
          const overlaySize = Math.min(mainImage.width, mainImage.height) * overlayScale;
          
          // Draw overlay at calculated position (centered on the coordinate)
          ctx.globalAlpha = 0.7;
          ctx.drawImage(
            overlayImage, 
            actualX - overlaySize / 2, // Center horizontally
            actualY - overlaySize / 2, // Center vertically
            overlaySize, 
            overlaySize
          );
          ctx.globalAlpha = 1.0;
        }
      }

      // Download the composed image
      const link = document.createElement('a');
      const filename = selectedOverlay !== 'none' 
        ? `prescription-with-overlay-${Date.now()}.png`
        : `prescription-${Date.now()}.png`;
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(mainImage.src);
      
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Preview
        </h3>
        {file && file.type.startsWith('image/') && (
          <button
            onClick={downloadOverlayedImage}
            disabled={isDownloading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              isDownloading
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isDownloading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V11" />
                </svg>
                <span>Download</span>
              </div>
            )}
          </button>
        )}
      </div>
      
      {!file ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No file selected</h3>
          <p className="text-sm text-gray-500">Upload a prescription to see the preview here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview Container */}
          <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 relative" data-preview-container>
            {file.type.startsWith('image/') ? (
              <>
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Prescription preview" 
                  className="w-full h-full object-contain"
                />
                {/* Selected overlay */}
                {selectedOverlay !== 'none' && (
                  <div 
                    className="absolute" 
                    style={{ 
                      left: `${overlayPosition.x}%`, 
                      top: `${overlayPosition.y}%`,
                      pointerEvents: 'none',
                      transform: 'translate(0%, -50%)' // Center the overlay on the position
                    }}
                  >
                    <img 
                      src={allOverlays.find(opt => opt.id === selectedOverlay)?.path}
                      alt="Overlay"
                      className="object-contain opacity-70"
                      style={{ 
                        width: `${Math.max(16, Math.min(64, overlayScale * 800))}px`, 
                        height: `${Math.max(16, Math.min(64, overlayScale * 800))}px` 
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 font-medium">PDF Document</p>
                  <p className="text-sm text-gray-400">{file.name}</p>
                </div>
                {/* Selected overlay for PDF */}
                {selectedOverlay !== 'none' && (
                  <div 
                    className="absolute" 
                    style={{ 
                      left: `${overlayPosition.x}%`, 
                      top: `${overlayPosition.y}%`,
                      pointerEvents: 'none',
                      transform: 'translate(0%, -50%)' // Center the overlay on the position
                    }}
                  >
                    <img 
                      src={allOverlays.find(opt => opt.id === selectedOverlay)?.path}
                      alt="Overlay"
                      className="object-contain opacity-70"
                      style={{ 
                        width: `${Math.max(16, Math.min(64, overlayScale * 800))}px`, 
                        height: `${Math.max(16, Math.min(64, overlayScale * 800))}px` 
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* File Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">File name</p>
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
              </div>
              <div>
                <p className="text-gray-500">File size</p>
                <p className="font-medium text-gray-900">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div>
                <p className="text-gray-500">File type</p>
                <p className="font-medium text-gray-900">{file.type}</p>
              </div>
              <div>
                <p className="text-gray-500">Last modified</p>
                <p className="font-medium text-gray-900">{new Date(file.lastModified).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
