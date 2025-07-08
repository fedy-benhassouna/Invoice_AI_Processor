import React from 'react';
import { Loader2, Scan, FileText, Download } from 'lucide-react';

const ProcessingLoader: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Scan className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Processing Your Invoice
        </h3>
        <p className="text-gray-600 mb-8">
          Extracting text and analyzing invoice data...
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Reading text from image</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Extracting invoice details</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>Generating results</span>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <FileText className="w-4 h-4" />
            <span>OCR Analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Download className="w-4 h-4" />
            <span>CSV Export</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingLoader;