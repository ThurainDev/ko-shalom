export const API_BASE = import.meta.env.VITE_API_URL || '/api';
export const uploadsPath = (p) => `${import.meta.env.VITE_API_URL || ''}/uploads/${p}`;
export const resolveImage = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return uploadsPath(image);
};