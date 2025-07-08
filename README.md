# Invoice AI Processor

An AI-powered invoice processing application that uses OCR (Optical Character Recognition) to extract key information from invoice images.

## Features

- 📄 **OCR Text Extraction**: Uses EasyOCR to extract text from invoice images
- 🔍 **Smart Field Detection**: Automatically identifies and extracts:
  - Invoice date
  - Total amount
  - Invoice number
  - Seller information
  - Client information
  - Tax ID
- 📊 **CSV Export**: Exports extracted data in CSV format
- 🖼️ **Visual Annotations**: Shows detected text areas on the processed image
- 🌐 **Web Interface**: Modern React frontend with TypeScript and Tailwind CSS
- ⚡ **FastAPI Backend**: High-performance Python backend with automatic API documentation

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python
- **EasyOCR**: Optical Character Recognition library
- **OpenCV**: Computer vision library for image processing
- **NumPy**: Numerical computing library
- **Pandas**: Data manipulation and analysis library

### Frontend
- **React**: User interface library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/fedy-benhassouna/Invoice_AI_Processor.git
cd Invoice_AI_Processor
```

2. Create a virtual environment:
```bash
python -m venv myenv
```

3. Activate the virtual environment:
```bash
# Windows
myenv\Scripts\activate

# macOS/Linux
source myenv/bin/activate
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Starting the Backend

1. Make sure your virtual environment is activated
2. Run the FastAPI server:
```bash
python app.py
```

The backend will be available at `http://localhost:8000`

### Starting the Frontend

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Using the Application

1. Open your browser and go to `http://localhost:5173`
2. Upload an invoice image using the file upload interface
3. The application will:
   - Process the image using OCR
   - Extract key information
   - Display the annotated image with detected text areas
   - Show the extracted data in a table format
   - Provide a CSV download option

## API Documentation

Once the backend is running, you can access the automatic API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
Invoice_AI_Processor/
├── app.py                 # Main FastAPI application
├── app_fixed.py          # Alternative implementation
├── requirements.txt      # Python dependencies
├── .gitignore           # Git ignore file
├── README.md            # This file
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx      # Main React app
│   │   └── main.tsx     # Entry point
│   ├── package.json     # Node.js dependencies
│   └── vite.config.ts   # Vite configuration
└── myenv/               # Virtual environment (excluded from git)
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
