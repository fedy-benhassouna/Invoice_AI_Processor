import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import easyocr
import numpy as np
import io
import re
import base64
import cv2
import pandas as pd

app = FastAPI()



# CORS configuration - this must be added BEFORE any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:3000",  # Common React dev server port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",  # FastAPI dev server
        "http://localhost:8000",
        "http://127.0.0.1:50191"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


reader = None

@app.on_event("startup")
def load_ocr_model():
    global reader
    reader = easyocr.Reader(['en'], gpu=False)

@app.post("/upload/")
async def upload_invoice(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        results = reader.readtext(image)

        # Extracted text for pattern matching
        joined_text = " ".join([text for _, text, _ in results])

        # Annotate image
        for (bbox, text, _) in results:
            pts = np.array(bbox, np.int32)
            pts = pts.reshape((-1, 1, 2))
            cv2.polylines(image, [pts], isClosed=True, color=(0, 255, 0), thickness=2)
            cv2.putText(image, text, tuple(map(int, bbox[0])), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

        # Encode image for viewing
        _, buffer = cv2.imencode('.jpg', image)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        # Field extraction
        date = re.search(r'(\d{2}[\/.\-]\d{2}[\/.\-]\d{4}|\d{4}[\/.\-]\d{2}[\/.\-]\d{2})', joined_text)
        amount = re.search(r'(Total|Amount\s*due|Paid)[^\d\$€₺]*([$€₺]?\s?[\d\s]{1,10}[.,]\d{2})', joined_text)
        invoice = re.search(r'(Invoice\s*(number|no))\s*[:\-]?\s*(\d+)', joined_text)
        seller = re.search(r'Seller[:\-]?\s*([A-Z][^\d]+?)\s\d{3,5}', joined_text)
        client = re.search(r'Client[:\-]?\s*([A-Z][^\d]+?)\s\d{3,5}', joined_text)
        tax_id = re.search(r'Tax\s*ID[:\-]?\s*([\d\-]+)', joined_text)

        extracted = [{
            'Date': date.group(0) if date else 'Not found',
            'Amount': amount.group(2).replace(" ", "").replace(",", ".") if amount else 'Not found',
            'Invoice Number': invoice.group(3) if invoice else 'Not found',
            'Seller': seller.group(1).strip() if seller else 'Not found',
            'Client': client.group(1).strip() if client else 'Not found',
            'Tax ID': tax_id.group(1) if tax_id else 'Not found'
        }]

        df = pd.DataFrame(extracted)
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)

        return JSONResponse(content={
            "csv_data": csv_buffer.getvalue(),
            "annotated_image_base64": img_base64
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
