import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField, Typography,
} from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImCloudUpload } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ManageCategory from '../../components/Admin/AddItem/ManageCategory/ManageCategory';
import ManageTags from '../../components/Admin/AddItem/ManageTags/ManageTags';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import {
    createItem,
    selectAllCategories,
} from '../../slices/itemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { TablesInsert } from '../../types/supabase';
import { FormData } from '../../types/types';

type CreateItemPayload = Omit<
    TablesInsert<'items'>,
    'item_id' | 'created_at' | 'user_id'
> & { image_path?: string[] | null };

interface SelectedFile {
    file: File;
    preview: string;
    isMain: boolean;
}

const AdminAddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { role, user } = useAuth();
    const categories = useAppSelector(selectAllCategories);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
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
    const [createdItemId, setCreatedItemId] = useState<string | null>(null);
    const [openTagsAfterCreate, setOpenTagsAfterCreate] = useState(false);
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
    const { t } = useTranslation();

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
            const newFiles = Array.from(event.target.files).map((file, i) => ({
                file,
                preview: URL.createObjectURL(file),
                isMain: (i === 0 && selectedFiles.length < 1) ? true : false // First image is main by default
            }));
            console.log(newFiles)
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleSetMainImage = (index: number) => {
        setSelectedFiles(prev => prev.map((file, i) => ({
            ...file,
            isMain: i === index
        })));
    };

    const handleRemoveImage = (index: number) => {
        setSelectedFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== index);
            // If we removed the main image and there are other images, set the first one as main
            if (prev[index].isMain && newFiles.length > 0) {
                newFiles[0].isMain = true;
            }
            return newFiles;
        });
    };

    const showSnackbar = (message: string, severity: AlertColor) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        showSnackbar(t('admin.add_product.uploading'), 'info');

        const imageUrls: string[] = [];

        if (!user) {
            return;
        }

        // --- Upload Logic ---
        if (selectedFiles.length > 0) {
            try {
                // Sort files to ensure main image is first
                const sortedFiles = [...selectedFiles].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));

                for (const selectedFile of sortedFiles) {
                    const fileExt = selectedFile.file.name.split('.').pop() ?? 'jpg';
                    const category = formData.category_id;
                    const filePath = `public/items/${category}/${selectedFile.file.name}_${uuidv4()}.${fileExt}`;
                    const bucketName = 'items';

                    const { error: uploadError } = await supabase.storage
                        .from(bucketName)
                        .upload(filePath, selectedFile.file, {
                            cacheControl: '3600',
                            upsert: false,
                        });

                    if (uploadError) {
                        throw uploadError;
                    }

                    const { data: urlData } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(filePath);

                    if (urlData?.publicUrl) {
                        imageUrls.push(urlData.publicUrl);
                    }
                }
            } catch (error) {
                console.error('Error uploading files:', error);
                showSnackbar(t('admin.add_product.upload_failed'), 'error');
                return;
            }
        }

        const newItemData: CreateItemPayload = {
            ...formData,
            image_path: imageUrls.length > 0 ? imageUrls : null,
        };

        try {
            const savedItem = await dispatch(createItem(newItemData)).unwrap();
            setCreatedItemId(savedItem.data.item_id);           // keep the id so we can attach tags
            const wantTags = window.confirm(
                t('admin.add_product.add_tags_prompt', {
                    defaultValue: 'Item created! Do you want to add tags now?'
                })
            );
            if (wantTags) setOpenTagsAfterCreate(true);
            setIsLoading(false);
            showSnackbar(t('admin.add_product.success', { defaultValue: 'Item created successfully!' }), 'success');
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
            showSnackbar(t('admin.add_product.save_failed'), 'error');
            return;
        }
    };

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [selectedFiles]);

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 500,
                    backgroundColor: 'background.default',
                    py: 4, px: 6,
                    borderRadius: '7px',
                    boxShadow: '0 4px 20px #00000020',
                    flex: 1,
                    height: 'fit-content'
                }}
            >
                <Typography variant='subheading'>
                    {t('admin.add_product.title')}
                </Typography>
                <TextField
                    label={t('admin.add_product.item_name')}
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <TextField
                    label={t('admin.add_product.description')}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    disabled={isLoading}
                />
                <TextField
                    label={t('admin.add_product.location')}
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <TextField
                    label={t('admin.add_product.quantity')}
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
                    <InputLabel>{t('admin.add_product.category')}</InputLabel>
                    <Select
                        value={formData.category_id}
                        label={t('admin.add_product.category')}
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

                {/* Preview Section */}
                {selectedFiles.length > 0 && (
                    <Stack spacing={2}>
                        <Typography variant="subtitle1">{t('admin.add_product.selected_images')}</Typography>
                        {selectedFiles.map((file, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={file.preview}
                                    alt={`Preview ${index + 1}`}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                    }}
                                />
                                <Box sx={{ flexGrow: 1, maxWidth: '60%' }}>
                                    <Typography variant="body2" noWrap>
                                        {file.file.name}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => handleSetMainImage(index)}
                                    color={file.isMain ? 'primary' : 'default'}
                                    size="small"
                                >
                                    {file.isMain ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
                                </IconButton>
                                <IconButton
                                    onClick={() => handleRemoveImage(index)}
                                    color="error"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Stack>
                )}
                {/*————————————————————— Buttons ————————————————————————*/}

                <Stack spacing={2} direction={"row"} alignItems="center">
                    {/*————————————————————— Manage Categories ——————————————*/}
                    <ManageCategory />

                    <ManageTags
                        itemId={createdItemId ?? undefined}
                        autoOpen={openTagsAfterCreate}
                        onClose={() => setOpenTagsAfterCreate(false)}
                    />

                </Stack>
                {/*————————————————————— Upload Files ———————————————————*/}
                <Button
                    component="label"
                    role={'button'}
                    variant="contained"
                    color="secondary"
                    tabIndex={-1}
                    startIcon={<ImCloudUpload />}
                    disabled={isLoading}
                    sx={{ pl: 2, height: 80 }}
                >
                    {t('admin.add_product.upload_files')}
                    <VisuallyHiddenInput
                        type="file"
                        id="item_image"
                        name="item_image"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        multiple
                    />
                </Button>
                {/*————————————————————— Submit Button ———————————————————*/}
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isLoading}
                >
                    {isLoading ? t('admin.add_product.adding') : t('admin.add_product.add')}
                </Button>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
        </>

    );
};

export default AdminAddProduct;
