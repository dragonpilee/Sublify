import React, { useState } from 'react';
import { api } from '../lib/api';
import { Save, Lock } from 'lucide-react';

export function Settings() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    const handleSave = async () => {
        try {
            await api.post('/config', {
                opensubtitles_username: username,
                opensubtitles_password: password
            });
            setStatus('Config saved successfully!');
            setTimeout(() => setStatus(null), 3000);
        } catch (e) {
            setStatus('Failed to save config.');
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="bg-cine-800 p-8 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Provider Authentication</h2>
                        <p className="text-sm text-gray-400">Configure credentials for higher limits</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">OpenSubtitles Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-cine-900 border border-white/10 rounded-lg px-4 py-2 focus:border-cine-blue focus:outline-none transition-colors"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">OpenSubtitles Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-cine-900 border border-white/10 rounded-lg px-4 py-2 focus:border-cine-blue focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-cine-600 hover:bg-cine-500 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors"
                    >
                        <Save size={18} />
                        Save Credentials
                    </button>

                    {status && (
                        <p className={`text-center text-sm ${status.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
