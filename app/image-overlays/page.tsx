"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ImageOverlayUploader from "../components/image-overlays/ImageOverlayUploader";
import ImageOverlayGallery from "../components/image-overlays/ImageOverlayGallery";
import ImageOverlayInstructions from "../components/image-overlays/ImageOverlayInstructions";
import { CustomImageOverlay, UploadStatus } from "../components/types";

export default function ImageOverlayManagement() {
  const [customOverlays, setCustomOverlays] = useState<CustomImageOverlay[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');

  // Load custom overlays from server on component mount
  useEffect(() => {
    const loadOverlays = async () => {
      try {
        const response = await fetch('/api/overlays/list');
        if (response.ok) {
          const overlays = await response.json();
          setCustomOverlays(overlays);
        } else {
          console.error('Failed to load overlays');
        }
      } catch (error) {
        console.error('Error loading custom overlays:', error);
      }
    };

    loadOverlays();
  }, []);


  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/overlays/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newOverlay = await response.json();
        setCustomOverlays(prev => [newOverlay, ...prev]);
        setUploadStatus('success');
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error uploading overlay:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteOverlay = async (overlayId: string) => {
    const overlay = customOverlays.find(o => o.id === overlayId);
    if (!overlay) return;

    try {
      const response = await fetch('/api/overlays/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: overlay.fileName }),
      });

      if (response.ok) {
        // Remove from local state
        setCustomOverlays(prev => prev.filter(o => o.id !== overlayId));
      } else {
        console.error('Failed to delete overlay');
      }
    } catch (error) {
      console.error('Error deleting overlay:', error);
    }
  };

  const handleSelectOverlay = (overlay: CustomImageOverlay) => {
    alert('Overlay selected! You can now use it on the main page.');
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all custom overlays?')) {
      // Delete all overlays
      const deletePromises = customOverlays.map(overlay => 
        fetch('/api/overlays/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName: overlay.fileName }),
        })
      );
      
      try {
        await Promise.all(deletePromises);
        setCustomOverlays([]);
      } catch (error) {
        console.error('Error deleting all overlays:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Image Overlay Management
              </h1>
              <p className="text-gray-600">
                Upload and manage custom image overlay images
              </p>
            </div>
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Back to Upload
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload New Overlay */}
          <div className="lg:col-span-1">
            <ImageOverlayUploader 
              onUpload={handleUpload}
              uploadStatus={uploadStatus}
              isUploading={isUploading}
            />
          </div>

          {/* Custom Overlays Gallery */}
          <div className="lg:col-span-2">
            <ImageOverlayGallery 
              overlays={customOverlays}
              onDeleteOverlay={deleteOverlay}
              onSelectOverlay={handleSelectOverlay}
              onClearAll={handleClearAll}
            />
          </div>
        </div>

        {/* Instructions */}
        <ImageOverlayInstructions />
      </div>
    </div>
  );
}
