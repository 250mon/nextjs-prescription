"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CustomOverlay {
  id: string;
  name: string;
  fileName: string;
  path: string;
  uploadedAt: string;
  size: number;
  type: string;
}

export default function OverlayManagement() {
  const [customOverlays, setCustomOverlays] = useState<CustomOverlay[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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


  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/overlays/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newOverlay = await response.json();
        setCustomOverlays(prev => [newOverlay, ...prev]);
        setUploadStatus('success');
        setSelectedFile(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Overlay Management
              </h1>
              <p className="text-gray-600">
                Upload and manage custom overlay images
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload New Overlay
              </h2>
              
              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <label htmlFor="overlay-file" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Image File
                  </label>
                  <input
                    id="overlay-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports: JPG, PNG, SVG, GIF
                  </p>
                </div>

                {/* File Preview */}
                {selectedFile && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    !selectedFile || isUploading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    'Upload Overlay'
                  )}
                </button>

                {/* Status Messages */}
                {uploadStatus === 'success' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-800 text-sm font-medium">Overlay uploaded successfully!</p>
                    </div>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-800 text-sm font-medium">Upload failed. Please try again.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Overlays Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Custom Overlays ({customOverlays.length})
                </h2>
                {customOverlays.length > 0 && (
                  <button
                    onClick={async () => {
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
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {customOverlays.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No custom overlays</h3>
                  <p className="text-gray-500">Upload your first custom overlay image to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {customOverlays.map((overlay) => (
                    <div key={overlay.id} className="group relative bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                      {/* Image Preview */}
                      <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                        <img 
                          src={overlay.path}
                          alt={overlay.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Overlay Info */}
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {overlay.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(overlay.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => deleteOverlay(overlay.id)}
                          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                          title="Delete overlay"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Select Button */}
                      <button
                        onClick={() => {
                          // Store selected overlay in localStorage for main page to use
                          localStorage.setItem('selectedCustomOverlay', JSON.stringify(overlay));
                          alert('Overlay selected! You can now use it on the main page.');
                        }}
                        className="w-full mt-3 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        Select This Overlay
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How to Use Custom Overlays
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
      </div>
    </div>
  );
}
