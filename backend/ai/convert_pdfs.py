import os
import fitz  # PyMuPDF

def convert_pdfs_to_jpgs(resources_folder):
    if not os.path.exists(resources_folder):
        print(f"Folder '{resources_folder}' does not exist.")
        return

    count = 0
    # Iterate through all files in the resources folder
    for filename in os.listdir(resources_folder):
        if filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(resources_folder, filename)
            print(f"Processing '{filename}'...")
            
            try:
                # Open the PDF
                doc = fitz.open(pdf_path)
                
                # Iterate through all pages
                for page_num in range(len(doc)):
                    page = doc.load_page(page_num)
                    # Render page to an image (pixmap)
                    # You can increase resolution by using a Matrix, e.g., fitz.Matrix(2, 2)
                    pix = page.get_pixmap()
                    
                    # Construct output filename
                    base_name = os.path.splitext(filename)[0]
                    # If single page, just use the base name, else append page number
                    if len(doc) == 1:
                        jpg_filename = f"{base_name}.jpg"
                    else:
                        jpg_filename = f"{base_name}_page_{page_num + 1}.jpg"
                        
                    jpg_path = os.path.join(resources_folder, jpg_filename)
                    
                    # Save the image
                    pix.save(jpg_path)
                    print(f"  Saved '{jpg_filename}'")
                
                # Close the document to release the file handle
                doc.close()
                
                # Delete the original PDF
                os.remove(pdf_path)
                print(f"Deleted original PDF: '{filename}'\n")
                count += 1
                
            except Exception as e:
                print(f"Error processing '{filename}': {e}")
                
    print(f"Finished processing. Converted and deleted {count} PDF(s).")

if __name__ == "__main__":
    target_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'resources')
    
    print(f"Looking for PDFs in: {target_dir}")
    convert_pdfs_to_jpgs(target_dir)
