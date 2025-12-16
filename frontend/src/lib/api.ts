import axios from 'axios';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 120000, // 2 minutes timeout for slow drives
});

export interface FileSystemItem {
    name: string;
    path: string;
    size: number;
    has_subtitle: boolean;
    type: 'file' | 'dir';
}

export const scanPath = async (path: string) => {
    const res = await api.get<{ videos: FileSystemItem[] }>('/scan', { params: { path } });
    return res.data;
};

export const downloadSubtitle = async (filePath: string, languages: string[] = ['en']) => {
    const res = await api.post('/download', { file_path: filePath, languages });
    return res.data;
};

export const getStats = async () => {
    const res = await api.get<{ downloads: number, bandwidth_bytes: number }>('/stats');
    return res.data;
};

export interface SearchMatch {
    path: string;
    dir: string;
}

export interface SearchResponse {
    found: boolean;
    count: number;
    matches: SearchMatch[];
}

export const smartSearch = async (filename: string) => {
    const res = await api.post<SearchResponse>('/smart-search', { filename });
    return res.data;
};
