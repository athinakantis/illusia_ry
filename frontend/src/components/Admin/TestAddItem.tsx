import React, { useState, FormEvent, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks'; // Use your custom hooks
import { createItem } from '../../slices/itemsSlice';
import { useAuth } from '../../hooks/useAuth'; // Import your auth hook
import { TablesInsert } from '../../types/supabase.types';
import { supabase } from '../../config/supabase';
import { Button } from '@mui/material';
import { ImCloudUpload } from 'react-icons/im';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  item_name: string;
  description: string;
  category_id: string; // Assuming this holds the ID, maybe from a select input
  location: string;
  quantity: number;
  // Add other relevant fields from your 'items' table if needed
}

// Define the type for the data needed to create an item
type CreateItemPayload = Omit<
  TablesInsert<'items'>,
  'item_id' | 'created_at' | 'user_id'
> & { image_path?: string | null };

const AddItemForm: React.FC = () => {
  // Initialize Supabase client

  const dispatch = useAppDispatch();
  const { user } = useAuth(); // Get authenticated user info

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  // Initialize state with ADDED fields
  const [formData, setFormData] = useState<FormData>({
    item_name: '',
    description: '',
    category_id: '', // Initialize category_id
    location: '', // Initialize location
    quantity: 1, // Initialize quantity (e.g., default to 1)
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.target;
    // Handle number input specifically for quantity
    const newValue = type === 'number' ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setFormError(null); // Clear form error on input change
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null); // Clear upload error on new file selection
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError(null);
    setFormError(null);

    if (!user) {
      setFormError('User not authenticated.');
      return;
    }

    // Basic validation - ADDED checks for new fields
    if (
      !formData.item_name ||
      !formData.description ||
      !formData.category_id ||
      !formData.location ||
      formData.quantity <= 0
    ) {
      setFormError(
        'Please fill in all required fields (Name, Description, Category, Location, Quantity).',
      );
      return;
    }

    let imageUrl: string | null = null;

    // --- Upload Logic ---
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop() ?? 'jpg'; // fallback to jpg
      //   const filePath = `${user.id}/${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`; // Sanitize filename
      const category = formData.category_id; // Or fetch the category name
      const filePath = `public/items/${category}/${selectedFile.name}_${uuidv4()}`;
      const bucketName = 'items'; 
      console.log('FilePath:', filePath);
      console.log('Uploading:', selectedFile, typeof selectedFile);
      console.log('BucketName:', bucketName);
      console.log('UserID:', user.id);
      console.log('FileExt:', fileExt);
      try {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL after successful upload
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        imageUrl = urlData?.publicUrl ?? filePath; // Use public URL, fallback to path if needed
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError(`Upload failed: ${error}`);
      }
    }
   
    const newItemData: CreateItemPayload = {
      ...formData,
      image_path: imageUrl, 
    };

    try {
    
      await dispatch(createItem(newItemData)).unwrap(); // unwrap to catch potential rejections
      setFormData({
        item_name: '',
        description: '',
        category_id: '',
        location: '',
        quantity: 1,
      });
      setSelectedFile(null);
      //  Show success message or redirect
    } catch (err) {
      console.error('Failed to save the item:', err);
      setFormError(
        (err as Error).message || 'Failed to save item. Please try again.',
      );
    }
  };

  //   const isLoading = itemStatus === 'loading';

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Item</h2>

      {/* Basic Form Fields - Adapt to your needs */}
      <div>
        <label htmlFor="item_name">Item Name:</label>
        <input
          type="text"
          id="item_name"
          name="item_name"
          value={formData.item_name}
          onChange={handleInputChange}
          required
          //   disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          //   disabled={isLoading}
        />
      </div>
      <div>
        {/* This should ideally be a select dropdown fetching categories */}
        <label htmlFor="category_id">Category ID:</label>
        <input
          type="text"
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          required
          placeholder="Enter Category ID" // Replace with a proper select input
          //   disabled={isLoading}
        />
      </div>
      {/* ADDED Fields */}
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
          //   disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          required
          min="1" // Ensure quantity is positive
          //   disabled={isLoading}
        />
      </div>
      {/* End ADDED Fields */}

      {/* File Input */}
      <div>
        <label htmlFor="item_image">Item Image:</label>
        <input
          type="file"
          id="item_image"
          name="item_image"
          accept="image/*"
          onChange={handleFileChange}
          //   disabled={isLoading}
        />
        <Button
          component="label"
          role={'button'}
          variant="contained"
          tabIndex={-1}
          startIcon={<ImCloudUpload />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            id="item_image"
            name="item_image"
            accept="image/*"
            onChange={(event) => {
              handleFileChange(event);
              setSelectedFile(
                event.target.files ? event.target.files[0] : null,
              );
            }}
            disabled={false}
            multiple
          />
        </Button>
        {selectedFile && <p>Selected: {selectedFile.name}</p>}
        {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
      </div>

      {formError && <p style={{ color: 'red' }}>{formError}</p>}

      <button type="submit" /*  disabled={isLoading} */>
        {/* {isLoading ? 'Adding Item...' : 'Add Item'} */}Add Item
      </button>
    </form>
  );
};

export default AddItemForm;
