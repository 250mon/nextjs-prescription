"use client";

import { useState, useEffect } from "react";
import { imageOverlayOptions, ImageOverlayOption } from "./ImageOverlaySelector";
import { TextOverlay } from "./TextOverlayManager";
import DownloadButton from "./file-preview/DownloadButton";
import EmptyState from "./file-preview/EmptyState";
import ImagePreview from "./file-preview/ImagePreview";
import PDFPreview from "./file-preview/PDFPreview";
import FileDetails from "./file-preview/FileDetails";
import { downloadOverlayedImage } from "./file-preview/imageDownloadUtils";
import { getApiUrl } from "../lib/api";

interface FilePreviewProps {
  file: File | null;
  selectedOverlay: string;
  overlayPosition: { x: number; y: number }; // Now represents percentages (0-100)
  overlayScale: number; // Scale factor for overlay size
  textOverlays: TextOverlay[];
}

export default function FilePreview({ file, selectedOverlay, overlayPosition, overlayScale, textOverlays }: FilePreviewProps) {
  const [allOverlays, setAllOverlays] = useState<ImageOverlayOption[]>(imageOverlayOptions);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Load custom overlays from server
  useEffect(() => {
    const loadOverlays = async () => {
      try {
        const response = await fetch(getApiUrl('/api/overlays/list'));
        if (response.ok) {
          const overlays = await response.json();
          const customOptions: ImageOverlayOption[] = overlays.map((overlay: { id: string; name: string; path: string }) => ({
            id: overlay.id,
            name: overlay.name,
            path: overlay.path,
            type: 'image' as const
          }));
          setAllOverlays([...imageOverlayOptions, ...customOptions]);
        }
      } catch (error) {
        console.error('Error loading custom overlays:', error);
      }
    };

    loadOverlays();
  }, []);

  // Get image dimensions when file changes
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    } else {
      setImageDimensions(null);
    }
  }, [file]);

  const handleDownload = async () => {
    if (!file || !file.type.startsWith('image/')) return;

    setIsDownloading(true);
    
    try {
      await downloadOverlayedImage({
        file,
        selectedOverlay,
        overlayPosition,
        overlayScale,
        textOverlays,
        allOverlays
      });
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
          <DownloadButton 
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        )}
      </div>
      
      {!file ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {/* Preview Container */}
          {file.type.startsWith('image/') ? (
            <ImagePreview
              file={file}
              imageDimensions={imageDimensions}
              selectedOverlay={selectedOverlay}
              overlayPosition={overlayPosition}
              overlayScale={overlayScale}
              textOverlays={textOverlays}
              allOverlays={allOverlays}
            />
          ) : (
            <div 
              className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 relative" 
              data-preview-container
              style={{
                aspectRatio: '4 / 3'
              }}
            >
              <PDFPreview
                file={file}
                selectedOverlay={selectedOverlay}
                overlayPosition={overlayPosition}
                overlayScale={overlayScale}
                textOverlays={textOverlays}
                allOverlays={allOverlays}
              />
            </div>
          )}
          
          {/* File Details */}
          <FileDetails file={file} />
        </div>
      )}
    </div>
  );

}
