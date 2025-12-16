import React, { useEffect, useState } from 'react';
import { getStats } from '../lib/api';
import { Loader2 } from 'lucide-react';

export function Stats() {
    const [stats, setStats] = useState<{ downloads: number, bandwidth_bytes: number } | null>(null);

    useEffect(() => {
        getStats().then(setStats).catch(console.error);

        // Poll every 5 seconds for "live" updates
        const interval = setInterval(() => {
            getStats().then(setStats).catch(console.error);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!stats) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;

    const gbSaved = (stats.bandwidth_bytes / (1024 * 1024 * 1024)).toFixed(2);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-cine-800 p-6 rounded-2xl border border-white/5 shadow-lg shadow-cine-900/50">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Downloads</h3>
                <p className="text-4xl font-bold mt-2 text-white">{stats.downloads.toLocaleString()}</p>
            </div>
            <div className="bg-cine-800 p-6 rounded-2xl border border-white/5 shadow-lg shadow-cine-900/50">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Bandwidth Processed</h3>
                <div className="flex items-baseline gap-1 mt-2">
                    <p className="text-4xl font-bold text-white">{gbSaved}</p>
                    <span className="text-gray-500 font-medium">GB</span>
                </div>
            </div>
            <div className="bg-cine-800 p-6 rounded-2xl border border-white/5 shadow-lg shadow-cine-900/50">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Providers</h3>
                <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-full font-mono">OpenSubtitles</span>
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs rounded-full font-mono">Podnapisi</span>
                    <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full font-mono">TVSubtitles</span>
                </div>
            </div>
        </div>
    );
}
