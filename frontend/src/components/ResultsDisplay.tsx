import React from 'react';
import { Download, Image, FileText, Calendar, DollarSign, Hash, Building, Users, FileDigit } from 'lucide-react';

interface ResultsDisplayProps {
  annotatedImage: string;
  csvData: string;
  originalFileName: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  annotatedImage, 
  csvData, 
  originalFileName 
}) => {
  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFileName.replace(/\.[^/.]+$/, '')}_extracted_data.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const parseCSVData = (csvString: string) => {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',');
    const values = lines[1].split(',');
    
    const fieldIcons = {
      'Date': Calendar,
      'Amount': DollarSign,
      'Invoice Number': Hash,
      'Seller': Building,
      'Client': Users,
      'Tax ID': FileDigit
    };
    
    return headers.map((header, index) => {
      const cleanHeader = header.replace(/"/g, '');
      const cleanValue = values[index] ? values[index].replace(/"/g, '') : 'Not found';
      const Icon = fieldIcons[cleanHeader as keyof typeof fieldIcons] || FileText;
      
      return {
        field: cleanHeader,
        value: cleanValue,
        icon: Icon
      };
    });
  };

  const extractedData = parseCSVData(csvData);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Annotated Image */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Annotated Image
                </h3>
                <p className="text-sm text-gray-600">
                  Text detection and analysis results
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative">
              <img
                src={`data:image/jpeg;base64,${annotatedImage}`}
                alt="Annotated Invoice"
                className="w-full h-auto rounded-lg shadow-md"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                OCR Analysis
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Data */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Extracted Data
                  </h3>
                  <p className="text-sm text-gray-600">
                    Invoice information and details
                  </p>
                </div>
              </div>
              
              <button
                onClick={downloadCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {extractedData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <item.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-800">
                          {item.field}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.value === 'Not found' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {item.value === 'Not found' ? 'Missing' : 'Found'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 font-mono">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Raw CSV Data Preview</span>
              </div>
              <pre className="mt-2 text-xs text-gray-500 overflow-x-auto">
                {csvData}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;