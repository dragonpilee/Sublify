import React, { useState, useEffect } from 'react';
import { scanPath, downloadSubtitle, type FileSystemItem } from '../lib/api';
import { Folder, Film, Download, Check, AlertCircle, Loader2, ArrowUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FileBrowser({ initialPath }: { initialPath: string }) {
    const [path, setPath] = useState(initialPath);
    const [history, setHistory] = useState<string[]>([initialPath]);
    const [files, setFiles] = useState<FileSystemItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        loadFiles(path);
    }, [path]);

    const loadFiles = async (p: string) => {
        setLoading(true);
        try {
            const data = await scanPath(p);
            setFiles(data.videos || []);
        } catch (e) {
            console.error(e);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (newPath: string) => {
        setHistory([...history, newPath]);
        setPath(newPath);
    };

    const handleUp = () => {
        // Stop if we are at root or /data
        if (path === '/' || path === '/data' || path.length < 2) return;

        const parent = path.substring(0, path.lastIndexOf('/'));
        // If parent becomes empty string, it means we were at /foo, so parent is root /
        setPath(parent || '/');
    };

    const handleDownload = async (file: FileSystemItem) => {
        setProcessing(file.path);
        try {
            await downloadSubtitle(file.path, ['en']);
            await loadFiles(path); // Refresh
            alert(`Subtitle downloaded for ${file.name}`);
        } catch (e) {
            alert('Failed to download');
        } finally {
            setProcessing(null);
        }
    };

    // Breadcrumb text generator
    const breadcrumbs = path.split(/[/\\]/).filter(Boolean);

    return (
        <div className="space-y-6">
            {/* Navigation Bar */}
            <div className="flex gap-2 items-center bg-cine-800/50 p-2 rounded-lg backdrop-blur-sm border border-white/5">
                <button
                    onClick={handleUp}
                    className="p-2 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors"
                    title="Go Up"
                >
                    <ArrowUp size={18} />
                </button>

                <div className="flex-1 flex items-center overflow-x-auto text-sm font-mono px-2 gap-1 text-gray-400">
                    <Folder className="text-cine-blue mr-2 shrink-0" size={16} />
                    {/* Editable path input or breadcrumbs */}
                    <input
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadFiles(path)}
                        className="bg-transparent w-full focus:outline-none text-white"
                    />
                </div>

                <button
                    onClick={() => loadFiles(path)}
                    className="text-xs bg-cine-600 px-3 py-1.5 rounded hover:bg-cine-500 text-white font-medium"
                >
                    Go
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode='wait'>
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center animate-pulse">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            Scanning sector...
                        </div>
                    ) : files.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                            <p>No compatible media found in this zone.</p>
                        </div>
                    ) : (
                        files.map((item) => (
                            <motion.div
                                key={item.path}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`
                                    relative p-4 rounded-xl border border-white/5 bg-cine-800/80 hover:bg-cine-700/50 
                                    transition-all cursor-pointer group overflow-hidden
                                    ${item.type === 'dir' ? 'hover:border-cine-blue/30' : 'hover:border-white/10'}
                                `}
                                onClick={async () => {
                                    if (item.type === 'dir') {
                                        handleNavigate(item.path);
                                    } else {
                                        // Handle Download
                                        setProcessing(item.path);
                                        try {
                                            const res = await downloadSubtitle(item.path, ['en']);
                                            if (res.success) {
                                                await loadFiles(path); // Refresh to show green check
                                                // Optional: Toast notification instead of alert?
                                                console.log("Downloaded", res);
                                            } else {
                                                alert(`Error: ${res.message || "No subtitle found"}`);
                                            }
                                        } catch (err) {
                                            alert("Failed to reach server");
                                        } finally {
                                            setProcessing(null);
                                        }
                                    }
                                }}
                            >
                                {/* Icons */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`
                                        p-2.5 rounded-lg 
                                        ${item.type === 'dir' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-cine-accent'}
                                    `}>
                                        {item.type === 'dir' ? <Folder size={20} /> : <Film size={20} />}
                                    </div>

                                    {item.type === 'file' && (
                                        item.has_subtitle ?
                                            <Check size={16} className="text-green-500" /> :
                                            (processing === item.path ?
                                                <Loader2 size={16} className="animate-spin text-cine-blue" /> :
                                                <Download size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                                            )
                                    )}
                                </div>

                                {/* Details */}
                                <h3 className="font-medium text-sm text-gray-200 truncate pr-2" title={item.name}>
                                    {item.name}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                                    {item.type === 'dir' ? 'Folder' : `${(item.size / (1024 * 1024 * 1024)).toFixed(2)} GB`}
                                </p>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
