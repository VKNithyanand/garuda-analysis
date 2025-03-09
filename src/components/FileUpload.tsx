import React, { useRef } from 'react';
import { Upload, RefreshCw, FileUp } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  showReupload?: boolean;
}

export const FileUpload: React.FC<Props> = ({ onFileSelect, showReupload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleReupload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-center w-full">
        {showReupload ? (
          <div className="flex gap-4">
            <button
              onClick={handleReupload}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reupload Data
            </button>
            <label className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <FileUp className="w-5 h-5 mr-2" />
              Upload New File
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.json"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">CSV, Excel, or JSON files</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.json"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};