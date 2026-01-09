export const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || '';
export const API_BASE = BACKEND_URL;
export const uploadsPath = (p) => `${BACKEND_URL}/uploads/${p}`;
export const resolveImage = (image) => {
    if (!image || image === 'undefined' || image === 'null') return '';
    if (image.startsWith('http')) return image;
    return uploadsPath(image);
};