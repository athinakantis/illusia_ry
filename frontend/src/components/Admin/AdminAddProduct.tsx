import { useState, FormEvent, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks'; // Use your custom hooks
import { FormData } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Import your auth hook
import { createItem } from '../../slices/itemsSlice';
import { supabase } from '../../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { TablesInsert } from '../../types/supabase.types';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { ImCloudUpload } from 'react-icons/im';
import { styled } from '@mui/material/styles';
import { Box, TextField, Typography } from '@mui/material';


type CreateItemPayload = Omit<
    TablesInsert<'items'>,
    'item_id' | 'created_at' | 'user_id'
> & { image_path?: string | null };


const AdminAddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { role, user } = useAuth()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        item_name: '',
        description: '',
        location: '',
        quantity: 1,
        category_id: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');
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
    // If user is not admin, navigate elsewhere (/items for now)
    useEffect(() => {
        if(!role) return
        if (!role.includes('Admin')) {
            console.log('Unauthorized access, redirecting...');
            navigate('/items');
        }
    }, [role, navigate]);


    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = event.target;
        const newValue = type === 'number' ? parseInt(value, 10) : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const showSnackbar = (message: string, severity: AlertColor) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        showSnackbar('Uploading item...', 'info');

        let imageUrl: string | null = null;

        if (!user) {
            return;
        }

        // --- Upload Logic ---
        if (selectedFile) {
            const fileExt = selectedFile.name.split('.').pop() ?? 'jpg'; // fallback to jpg
            const category = formData.category_id; // Or fetch the category name
            const filePath = `public/items/${category}/${selectedFile.name}_${uuidv4()}.${fileExt}`;
            const bucketName = 'items';
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
                showSnackbar('Failed to upload image. Please try again.', 'error');
                return
            }
        }

        const newItemData: CreateItemPayload = {
            ...formData,
            image_path: imageUrl,
        };

        try {
            await dispatch(createItem(newItemData)).unwrap(); // unwrap to catch potential rejections
            setIsLoading(false);
            showSnackbar('Item added successfully!', 'success');
            setFormData({
                item_name: '',
                description: '',
                category_id: '',
                location: '',
                quantity: 1,
            });
            setSelectedFile(null);

        } catch (err) {
            console.error('Failed to save the item:', err);
            setIsLoading(false);
            showSnackbar('Failed to save item. Please try again.', 'error');
            return
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: '0 auto',
            }}
        >
            <Typography variant="h5" textAlign="center">
                Add New Product
            </Typography>
            <TextField
                label="Item Name"
                name="item_name"
                value={formData.item_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}

            />
            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                disabled={isLoading}
            />
            <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                disabled={isLoading}
            />
            <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }} // Prevent negative numbers   
                required
                disabled={isLoading}
            />
            <TextField
                label="Category ID"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                disabled={isLoading}
            />
            {/* Upload Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button
                    component="label"
                    role={'button'}
                    variant="contained"
                    color='secondary'
                    tabIndex={-1}
                    startIcon={<ImCloudUpload />}
                    disabled={isLoading}
                    sx={{ flexGrow: 1, mr: 0.5 }}
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
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isLoading}
                    sx={{ flexGrow: 100, marginLeft: 1 }}
                >
                    {isLoading ? 'Adding Item...' : 'Add Item'}
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default AdminAddProduct;