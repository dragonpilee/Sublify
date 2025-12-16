import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../lib/api';

export function SmartDropZone() {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [conflicts, setConflicts] = useState<any[]>([]); // Store matches for resolution
    const [showConflictModal, setShowConflictModal] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const downloadSpecific = async (path: string, displayName: string) => {
        setShowConflictModal(false);
        setStatus('processing');
        setMessage(`Downloading for: ${displayName}...`);
        try {
            // downloadSubtitle expects "file_path" in py, but we use the helper
            const res = await api.post('/download', { file_path: path });
            if (res.data.success) {
                setStatus('success');
                setMessage('Subtitle downloaded successfully!');
            } else {
                setStatus('error');
                setMessage(res.data.message || 'Download failed.');
            }
        } catch (e) {
            setStatus('error');
            setMessage('Failed to download.');
        } finally {
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const processFile = async (filename: string) => {
        setStatus('processing');
        setMessage(`Searching for "${filename}"...`);
        setConflicts([]);

        try {
            const res = await api.post('/smart-search', { filename });

            if (res.data.found && res.data.count === 1) {
                // Exact unique match - Auto Download
                downloadSpecific(res.data.matches[0].path, filename);
            } else if (res.data.found && res.data.count > 1) {
                // Multiple matches - Show Resolution UI
                setConflicts(res.data.matches);
                setShowConflictModal(true);
                setStatus('idle');
                setMessage('');
            } else {
                setStatus('error');
                setMessage(`Could not find "${filename}" in library.`);
                setTimeout(() => setStatus('idle'), 4000);
            }
        } catch (e) {
            setStatus('error');
            setMessage('Server connection error.');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            processFile(file.name);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0].name);
        }
    };

    return (
        <>
            <div
                className={`
            relative rounded-xl border-2 border-dashed transition-all duration-300 p-8 text-center cursor-pointer group
            ${isDragging ? 'border-cine-blue bg-cine-blue/10 scale-[1.02]' : 'border-white/10 bg-cine-800/30 hover:border-white/30'}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                />

                <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                    <div className={`
                p-4 rounded-full transition-colors
                ${status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            status === 'success' ? 'bg-green-500/20 text-green-400' :
                                status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-cine-900 text-gray-400 group-hover:text-cine-blue'}
            `}>
                        {status === 'processing' ? <Loader2 className="animate-spin" size={32} /> :
                            status === 'success' ? <CheckCircle size={32} /> :
                                status === 'error' ? <XCircle size={32} /> :
                                    <Upload size={32} />}
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-200">
                            {status === 'idle' ? 'Drag & Drop Movie File Here' : message}
                        </h3>
                        {status === 'idle' && (
                            <p className="text-sm text-gray-500 mt-1">
                                Or click to select from your PC. We'll find it and sub it.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Conflict Resolution Modal */}
            {showConflictModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-cine-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
                        <h3 className="text-lg md:text-xl font-bold mb-2">Multiple Files Found</h3>
                        <p className="text-gray-400 mb-6 text-sm">We found multiple copies of this file. Which one do you want to download subtitles for?</p>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {conflicts.map((match, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => downloadSpecific(match.path, match.dir.split('/').pop() || 'Unknown')}
                                    className="w-full text-left p-3 md:p-4 rounded-xl bg-cine-800 hover:bg-cine-700 transition-colors border border-white/5 group"
                                >
                                    <div className="font-mono text-xs text-cine-blue mb-1">Found in:</div>
                                    <div className="text-sm text-gray-200 group-hover:text-white break-all line-clamp-2">
                                        {match.path.replace('/data', 'D:')}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowConflictModal(false)}
                            className="w-full mt-6 py-3 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 font-medium active:scale-95 transition-transform"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
