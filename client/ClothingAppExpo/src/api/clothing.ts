import apiClient from './api';

interface ClothingItem {
    id?: number;
    name: string;
    category: string;
    color: string;
    season: string;
    occasion: string;
    image_url?: string;
}

interface ClothingFilters {
    category?: string;
    color?: string;
    season?: string;
    occasion?: string;
    search?: string;
}

interface OutfitData {
    name: string;
    clothing_items: number[];  // Array of clothing item IDs
    description?: string;
    occasion?: string;
    season?: string;
}

// Function to upload a new clothing item
export const uploadClothing = async (formData: FormData) => {
    try {
        const response = await apiClient.post('/clothing/create_clothing', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Clothing uploaded successfully:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error uploading clothing:', error.response?.data || error.message);
        throw error;
    }
};

// Function to get clothing items with optional filters
export const getClothing = async (filters: ClothingFilters = {}) => {
    try {
        const response = await apiClient.get('/clothing/get_clothing', { params: filters });
        console.log('Retrieved clothing items:', response.data);
        return response.data as ClothingItem[];
    } catch (error: any) {
        console.error('Error getting clothing:', error.response?.data || error.message);
        throw error;
    }
};

// Function to delete a clothing item
export const deleteClothing = async (clothingId: number) => {
    try {
        const response = await apiClient.delete(`/clothing/delete_clothing/${clothingId}`);
        console.log('Clothing deleted successfully:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting clothing:', error.response?.data || error.message);
        throw error;
    }
};

// Function to create an outfit
export const createOutfit = async (outfitData: OutfitData) => {
    try {
        const response = await apiClient.post('/clothing/create_outfit', outfitData);
        console.log('Outfit created successfully:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error creating outfit:', error.response?.data || error.message);
        throw error;
    }
};