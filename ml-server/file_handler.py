import numpy as np
from PIL import Image
import pydicom
import nibabel as nib
import io
import cv2

def detect_file_type(file_content):
    """
    Detect file type from file content bytes
    """
    # Check DICOM (starts with specific header)
    if file_content[:4] == b'DICM' or b'DICM' in file_content[:200]:
        return 'dicom'
    
    # Check NIFTI/NIfTI (has specific magic numbers)
    if file_content[:4] in [b'\x5c\x01\x00\x00', b'\x00\x00\x01\x5c']:
        return 'nifti'
    
    # Check for common image headers
    if file_content[:2] == b'\xff\xd8':  # JPEG
        return 'jpeg'
    elif file_content[:8] == b'\x89PNG\r\n\x1a\n':  # PNG
        return 'png'
    elif file_content[:2] in [b'BM']:  # BMP
        return 'bmp'
    elif file_content[:4] in [b'RIFF'] and file_content[8:12] == b'WEBP':  # WebP
        return 'webp'
    
    # Default to standard image
    return 'image'

def preprocess_by_file_type(file_content, file_type):
    """
    Preprocess file based on its type and return a PIL Image
    """
    if file_type == 'dicom':
        return preprocess_dicom(file_content)
    elif file_type == 'nifti':
        return preprocess_nifti(file_content)
    elif file_type in ['jpeg', 'png', 'bmp', 'webp', 'image']:
        return preprocess_standard_image(file_content)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

def preprocess_dicom(file_content):
    """
    Process DICOM files and convert to PIL Image
    """
    try:
        # Read DICOM from bytes
        dicom_file = pydicom.dcmread(io.BytesIO(file_content))
        
        # Get pixel array
        pixel_array = dicom_file.pixel_array
        
        # Normalize to 0-255 range
        if pixel_array.dtype != np.uint8:
            pixel_array = pixel_array.astype(np.float32)
            pixel_array = (pixel_array - pixel_array.min()) / (pixel_array.max() - pixel_array.min())
            pixel_array = (pixel_array * 255).astype(np.uint8)
        
        # Convert to PIL Image
        if len(pixel_array.shape) == 2:  # Grayscale
            pil_image = Image.fromarray(pixel_array, mode='L')
        else:  # RGB
            pil_image = Image.fromarray(pixel_array, mode='RGB')
            
        return pil_image
        
    except Exception as e:
        raise ValueError(f"Error processing DICOM file: {str(e)}")

def preprocess_nifti(file_content):
    """
    Process NIfTI files and convert to PIL Image
    """
    try:
        # Read NIfTI from bytes
        nifti_file = nib.load(io.BytesIO(file_content))
        
        # Get data array
        data = nifti_file.get_fdata()
        
        # Take middle slice if 3D
        if len(data.shape) == 3:
            middle_slice = data.shape[2] // 2
            data = data[:, :, middle_slice]
        elif len(data.shape) == 4:
            # Take middle slice of first volume
            middle_slice = data.shape[2] // 2
            data = data[:, :, middle_slice, 0]
        
        # Normalize to 0-255 range
        data = data.astype(np.float32)
        data = (data - data.min()) / (data.max() - data.min())
        data = (data * 255).astype(np.uint8)
        
        # Convert to PIL Image
        pil_image = Image.fromarray(data, mode='L')
        return pil_image
        
    except Exception as e:
        raise ValueError(f"Error processing NIfTI file: {str(e)}")

def preprocess_standard_image(file_content):
    """
    Process standard image formats (JPEG, PNG, etc.)
    """
    try:
        # Open with PIL directly
        pil_image = Image.open(io.BytesIO(file_content))
        
        # Convert to RGB if needed
        if pil_image.mode not in ['RGB', 'L']:
            pil_image = pil_image.convert('RGB')
            
        return pil_image
        
    except Exception as e:
        raise ValueError(f"Error processing image file: {str(e)}")