import React, { useState } from 'react';
import { Stats } from './Stats';
import { SmartDropZone } from './SmartDropZone';
import { Monitor, Film } from 'lucide-react';

export default function Dashboard() {
    // Simplified state - mostly for Stats/Settings tabs
    const [activeTab, setActiveTab] = useState<'home' | 'stats'>('home');

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 animate-fade-in gap-4 md:gap-0">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        SUBLIFY
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm md:text-base">Cinema-grade Subtitle Manager</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`p-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-cine-600 text-white shadow-lg shadow-cine-accent/20' : 'bg-cine-800 text-gray-400 hover:bg-cine-700'}`}
                        title="Upload"
                    >
                        <Film size={20} className="md:w-6 md:h-6" />
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`p-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-cine-600 text-white' : 'bg-cine-800 text-gray-400 hover:bg-cine-700'}`}
                        title="Statistics"
                    >
                        <Monitor size={20} className="md:w-6 md:h-6" />
                    </button>
                </div>
            </header>

            <main>
                <div className="transition-all duration-300">
                    {activeTab === 'home' && (
                        <div className="py-6 md:py-10 animate-fade-in">
                            <SmartDropZone />
                            <p className="text-center text-gray-500 mt-8 max-w-lg mx-auto text-sm md:text-base">
                                Drag your movie files from <strong>Explorer</strong> or <strong>Finder</strong> directly here.
                                We'll find them in your library and fetch the best subtitles automatically.
                            </p>
                        </div>
                    )}

                    {activeTab === 'stats' && <Stats />}
                </div>
            </main>

            <footer className="mt-20 py-6 text-center border-t border-white/5 animate-fade-in">
                <p className="text-gray-500 text-sm font-medium">
                    Developed with <span className="text-red-500 animate-pulse">❤</span> by <span className="text-cine-blue">CineGeek</span>
                </p>
                <p className="text-xs text-gray-700 mt-2">
                    Supports Windows • Mac • Linux • Android • iOS
                </p>
            </footer>
        </div>
    );
}
