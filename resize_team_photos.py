from PIL import Image
import os

def resize_and_crop(img_path, output_path, size):
    """
    Resize and crop an image to square from the center
    """
    with Image.open(img_path) as img:
        # Convert image to RGB if it's not
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Get current dimensions
        width, height = img.size
        
        # Determine the size to crop to
        crop_size = min(width, height)
        
        # Calculate crop box (to make it square)
        left = (width - crop_size) // 2
        top = (height - crop_size) // 2
        right = left + crop_size
        bottom = top + crop_size
        
        # Crop the image
        img = img.crop((left, top, right, bottom))
        
        # Resize the image
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save the image
        img.save(output_path, 'JPEG', quality=95)

def process_team_photos(input_dir, output_dir, size=400):
    """
    Process all team photos in the input directory
    """
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Process each team photo
    for filename in os.listdir(input_dir):
        if filename.startswith('team') and filename.endswith('.jpg'):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            try:
                resize_and_crop(input_path, output_path, size)
                print(f"Processed {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")

if __name__ == "__main__":
    input_dir = "pic"  # Directory containing team photos
    output_dir = "pic/processed"  # Directory for processed photos
    process_team_photos(input_dir, output_dir) 