"use client";

interface FileDetailsProps {
  file: File;
}

export default function FileDetails({ file }: FileDetailsProps) {
  return (
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
  );
}
