import React, { useState } from 'react';
import { FileText, Zap, Check } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ProcessingLoader from './components/ProcessingLoader';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorDisplay from './components/ErrorDisplay';

interface ProcessingResult {
  csv_data: string;
  annotated_image_base64: string;
}

type AppState = 'idle' | 'processing' | 'success' | 'error';

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    console.log('processFile called with:', file.name, file.type, file.size);
    setState('processing');
    setSelectedFile(file);
    
    console.log('Attempting to upload file:', file.name, 'to http://127.0.0.1:8000/upload/');
    
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('FormData created, making fetch request...');
    
    try {
      console.log('Making fetch request...');
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type for FormData, let browser set it with boundary
      });
      
      console.log('Response received:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        if (response.status === 400) {
          throw new Error('Bad request: Please check if the uploaded file is a valid image format.');
        } else if (response.status === 405) {
          throw new Error('Method not allowed: Server CORS configuration issue.');
        } else if (response.status === 500) {
          throw new Error('Server error: There was an issue processing your invoice.');
        }
        throw new Error(`Server error (${response.status}): ${errorText || 'Unknown error'}`);
      }
      
      const data: ProcessingResult = await response.json();
      console.log('Success! Received data');
      setResult(data);
      setState('success');
    } catch (err) {
      console.error('Error during upload:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to server. Make sure your backend is running on http://127.0.0.1:8000 with CORS enabled.');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      setState('error');
    }
  };

  const handleRetry = () => {
    setState('idle');
    setResult(null);
    setError('');
    setSelectedFile(null);
  };

  const handleNewUpload = () => {
    setState('idle');
    setResult(null);
    setError('');
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Invoice Processor
                </h1>
                <p className="text-sm text-gray-600">
                  Extract data from invoices with AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>AI-powered OCR</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Instant CSV export</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state === 'idle' && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upload Your Invoice
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simply upload an image of your invoice and our AI will extract all the important information, 
              including dates, amounts, invoice numbers, and company details.
            </p>
          </div>
        )}

        {state === 'success' && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Processing Complete
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Your invoice has been successfully processed. Review the extracted data and download the CSV file.
            </p>
            <button
              onClick={handleNewUpload}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Process Another Invoice
            </button>
          </div>
        )}

        <div className="flex justify-center">
          {state === 'idle' && (
            <FileUpload onFileSelect={processFile} isProcessing={false} />
          )}
          
          {state === 'processing' && <ProcessingLoader />}
          
          {state === 'success' && result && selectedFile && (
            <ResultsDisplay
              annotatedImage={result.annotated_image_base64}
              csvData={result.csv_data}
              originalFileName={selectedFile.name}
            />
          )}
          
          {state === 'error' && (
            <ErrorDisplay error={error} onRetry={handleRetry} />
          )}
        </div>
      </div>

      {/* Features Section */}
      {state === 'idle' && (
        <div className="bg-white py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Powerful Invoice Processing
              </h3>
              <p className="text-lg text-gray-600">
                Advanced OCR technology with intelligent field extraction
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Text Recognition
                </h4>
                <p className="text-gray-600">
                  Accurate OCR processing with bounding box visualization
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart Extraction
                </h4>
                <p className="text-gray-600">
                  Intelligent field detection for dates, amounts, and IDs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Instant Export
                </h4>
                <p className="text-gray-600">
                  Download structured data as CSV for easy integration
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;