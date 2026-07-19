import os
import glob
# pyrefly: ignore [missing-import]
import fitz  # PyMuPDF for PDF handling
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
    return text

def convert_pdf_to_jpg(pdf_path, output_dir):
    """Converts a PDF file into a series of JPG images (one per page)."""
    try:
        doc = fitz.open(pdf_path)
        base_name = os.path.basename(pdf_path).split('.')[0]
        os.makedirs(output_dir, exist_ok=True)
        
        saved_images = []
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=150)
            img_path = os.path.join(output_dir, f"{base_name}_page_{i+1}.jpg")
            pix.save(img_path)
            saved_images.append(img_path)
            print(f"Saved {img_path}")
        return saved_images
    except Exception as e:
        print(f"Error converting PDF to JPG {pdf_path}: {e}")
        return []

def analyze_image_with_nvidia_api(image_path):
    """
    Placeholder for NVIDIA API image analysis.
    You can use the NVIDIA API (e.g., NeMo Multimodal or OCR models)
    to extract text or analyze the contents of the generated JPGs.
    """
    print(f"Preparing to send {image_path} to NVIDIA API for analysis...")
    api_key = os.environ.get("VITE_NVIDIA_API_KEY", "MISSING_KEY")
    if api_key == "MISSING_KEY":
        print("Warning: VITE_NVIDIA_API_KEY is not set in your environment.")
    
    # Example pseudo-code for API call:
    # headers = {"Authorization": f"Bearer {api_key}"}
    # files = {"image": open(image_path, "rb")}
    # response = requests.post("https://api.nvidia.com/v1/vision/analyze", headers=headers, files=files)
    
    print(f"Simulated NVIDIA API result: Found technical diagrams and equations in {os.path.basename(image_path)}.")
    return "Extracted simulated text from image."

def load_data(resources_dir):
    texts = []
    labels = []
    
    # Process TXT files
    txt_files = glob.glob(os.path.join(resources_dir, "*.txt"))
    for file_path in txt_files:
        basename = os.path.basename(file_path)
        subject = basename.split('_')[0] if '_' in basename else 'unknown'
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            questions = [line.strip() for line in content.split('\n') if line.strip()]
            for q in questions:
                texts.append(q)
                labels.append(subject)

    # Process PDF files
    pdf_files = glob.glob(os.path.join(resources_dir, "*.pdf"))
    for file_path in pdf_files:
        basename = os.path.basename(file_path)
        subject = basename.split('_')[0] if '_' in basename else 'unknown'
        
        print(f"\nProcessing PDF: {file_path}")
        # 1. Extract text
        content = extract_text_from_pdf(file_path)
        questions = [line.strip() for line in content.split('\n') if len(line.strip()) > 10]
        for q in questions:
            texts.append(q)
            labels.append(subject)
            
        # 2. Convert to JPGs
        print(f"Converting {file_path} to images for deep analysis...")
        images_dir = os.path.join(resources_dir, "images")
        jpg_paths = convert_pdf_to_jpg(file_path, images_dir)
        
        # 3. Analyze images via Nvidia API
        for img_path in jpg_paths:
            analyze_image_with_nvidia_api(img_path)

    return texts, labels

def train_model(texts, labels):
    if not texts:
        print("No training data found.")
        return None
        
    model = make_pipeline(TfidfVectorizer(stop_words='english'), MultinomialNB())
    model.fit(texts, labels)
    return model

def analyze_and_predict(model, new_questions):
    if not model:
        return
        
    print("\n--- Prediction Analysis ---")
    predictions = model.predict(new_questions)
    for q, p in zip(new_questions, predictions):
        print(f"Question: {q[:50]}...")
        print(f"Predicted Subject: {p}")
        print("-" * 25)

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    resources_dir = os.path.join(current_dir, "..", "resources")
    
    print(f"Loading previous year questions from {resources_dir}...")
    texts, labels = load_data(resources_dir)
    
    if texts:
        print(f"\nLoaded {len(texts)} text segments across {len(set(labels))} subjects.")
        print("Training text categorization model...")
        model = train_model(texts, labels)
        
        print("Model trained successfully.")
        
        # Test the prediction model
        sample_pyq = [
            "Calculate the kinetic energy of the projectile.",
            "Explain the process of photosynthesis.",
            "Solve the quadratic equation x^2 + 5x + 6 = 0."
        ]
        
        analyze_and_predict(model, sample_pyq)
    else:
        print("Please add some .txt or .pdf files to the resources folder.")
