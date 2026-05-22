import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onChange: (files: File[]) => void;
  error?: string;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, error, multiple = true }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles = multiple ? [...selectedFiles, ...filesArray] : filesArray;
      setSelectedFiles(newFiles);
      onChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onChange(newFiles);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-[10px] p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/50 ${
          error ? 'border-red-500 bg-red-50/10' : 'border-gray-300 bg-white'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-[#2869CA]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700">Klik untuk upload foto</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">File Terpilih ({selectedFiles.length})</p>
          <div className="grid gap-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group animate-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-500">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple={multiple}
      />
    </div>
  );
};

export default FileUpload;
