#!/Users/ciel/.gemini/antigravity/scratch/paddleocr_demo/venv/bin/python3
import os
import sys
import json

def ocr_page(page, page_idx):
    bitmap = page.render(scale=2)
    pil_img = bitmap.to_pil()
    temp_img_path = f"temp_page_{page_idx}.png"
    pil_img.save(temp_img_path)
    
    try:
        from paddleocr import PaddleOCR
        # Suppress logging
        os.environ['GLOG_minloglevel'] = '3'
        os.environ['PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK'] = 'True'
        ocr = PaddleOCR(use_textline_orientation=True, lang='en')
        result = ocr.predict(temp_img_path)
        
        page_texts = []
        if result and result[0]:
            for item in result[0]:
                if len(item) > 1 and len(item[1]) > 0:
                    page_texts.append(item[1][0])
        return "\n".join(page_texts)
    except Exception as e:
        print(f"Error in OCR: {e}", file=sys.stderr)
        return ""
    finally:
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)

def extract_text(pdf_path):
    try:
        import pypdfium2 as pdfium
    except ImportError:
        print("Error: pypdfium2 is not installed in this environment.", file=sys.stderr)
        return ""
        
    try:
        doc = pdfium.PdfDocument(pdf_path)
        full_text = []
        for idx in range(len(doc)):
            text = ocr_page(doc[idx], idx)
            full_text.append(text)
            
        return "\n".join(full_text)
    except Exception as e:
        print(f"Error processing PDF: {str(e)}", file=sys.stderr)
        return ""

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python pdf_reader.py <pdf_path>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)
        
    text = extract_text(pdf_path)
    print(text)

