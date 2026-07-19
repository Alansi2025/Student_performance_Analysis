import os
import pytesseract
from PIL import Image

def extract_text_from_images(resources_folder, output_txt_path):
    if not os.path.exists(resources_folder):
        print(f"Folder '{resources_folder}' does not exist.")
        return

    import re
    # Find all JPG files
    jpg_files = [f for f in os.listdir(resources_folder) if f.lower().endswith('.jpg')]
    
    # Sort files naturally (so page_2 comes before page_10)
    def natural_sort_key(s):
        return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]
        
    jpg_files.sort(key=natural_sort_key)

    if not jpg_files:
        print(f"No JPG files found in '{resources_folder}'.")
        return

    print(f"Found {len(jpg_files)} images. Starting text extraction...")

    with open(output_txt_path, 'w', encoding='utf-8') as outfile:
        for filename in jpg_files:
            img_path = os.path.join(resources_folder, filename)
            print(f"Extracting text from '{filename}'...")
            
            try:
                # Open the image
                img = Image.open(img_path)
                
                # Use Tesseract to do OCR on the image
                text = pytesseract.image_to_string(img)
                
                # Write to the text file
                outfile.write(f"--- Text from {filename} ---\n\n")
                outfile.write(text)
                outfile.write("\n\n")
                
                print(f"  Successfully extracted text from '{filename}'")
            except Exception as e:
                print(f"Error extracting text from '{filename}': {e}")
                
    print(f"Finished extracting text. All text saved to '{output_txt_path}'.")

if __name__ == "__main__":
    target_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'resources')
    output_file = os.path.join(target_dir, 'extracted_text.txt')
    
    extract_text_from_images(target_dir, output_file)
