import { useState, FormEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks'; // Use your custom hooks
import { FormData } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Import your auth hook
import {
    createItem,
    selectAllCategories,
} from '../../slices/itemsSlice';
import { supabase } from '../../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { TablesInsert } from '../../types/supabase.type';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { ImCloudUpload } from 'react-icons/im';
import { styled } from '@mui/material/styles';
import { Box, TextField, Typography } from '@mui/material';

type CreateItemPayload = Omit<
    TablesInsert<'items'>,
    'item_id' | 'created_at' | 'user_id'
> & { image_path?: string[] | null };

const AdminAddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { role, user } = useAuth();
    const categories = useAppSelector(selectAllCategories);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
        if (role === undefined) return;
        else if (!role || !role.includes('Admin')) {
            console.log('Unauthorized access, redirecting...');
            navigate('/items');
        }
    }, [role, navigate]);

    const handleInputChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = event.target;
        const newValue = type === 'number' ? parseInt(value, 10) : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFiles(Array.from(event.target.files));
        } else {
            setSelectedFiles([]);
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

        let imageUrls: string[] = [];

        if (!user) {
            return;
        }

        // --- Upload Logic ---
        if (selectedFiles.length > 0) {
            const category = formData.category_id;
            const bucketName = 'items';
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop() ?? 'jpg';
                const filePath = `public/items/${category}/${file.name}_${uuidv4()}.${fileExt}`;
                try {
                    const { error: uploadError } = await supabase.storage
                        .from(bucketName)
                        .upload(filePath, file, {
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

                    imageUrls.push(urlData?.publicUrl ?? filePath);
                } catch (error) {
                    console.error('Error uploading file:', error);
                    showSnackbar('Failed to upload image. Please try again.', 'error');
                    setIsLoading(false);
                    return;
                }
            }
        }

        const newItemData: CreateItemPayload = {
            ...formData,
            image_path: imageUrls,
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
            setSelectedFiles([]);
        } catch (err) {
            console.error('Failed to save the item:', err);
            setIsLoading(false);
            showSnackbar('Failed to save item. Please try again.', 'error');
            return;
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
            {/* Category Selection */}
            <FormControl>
                <InputLabel>Category</InputLabel>
                <Select
                    value={formData.category_id}
                    label="Category"
                    name='category_id'
                    onChange={handleSelectChange}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.category_id} value={category.category_id}>
                            {category.category_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* Upload Button */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Button
                    component="label"
                    role={'button'}
                    variant="contained"
                    color="secondary"
                    tabIndex={-1}
                    startIcon={<ImCloudUpload />}
                    disabled={isLoading}
                    sx={{ flexGrow: 1, height: 75 }}
                >
                    Upload files
                    <VisuallyHiddenInput
                        type="file"
                        id="item_image"
                        name="item_image"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={false}
                        multiple
                    />
                </Button>
                {selectedFiles.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">Selected files:</Typography>
                        {selectedFiles.map((file, idx) => (
                            <Typography variant="caption" key={idx}>{file.name}</Typography>
                        ))}
                    </Box>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isLoading}
                    sx={{ flexGrow: 100, mt: 2 }}
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
                <MuiAlert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    elevation={6}
                    variant="filled"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default AdminAddProduct;
