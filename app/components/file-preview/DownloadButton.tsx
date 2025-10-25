"use client";

interface DownloadButtonProps {
  onDownload: () => Promise<void>;
  isDownloading: boolean;
  disabled?: boolean;
}

export default function DownloadButton({ onDownload, isDownloading, disabled = false }: DownloadButtonProps) {
  return (
    <button
      onClick={onDownload}
      disabled={disabled || isDownloading}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
        disabled || isDownloading
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
  );
}
