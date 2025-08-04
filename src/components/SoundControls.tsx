'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

export default function SoundControls() {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Initialize with current sound manager state
        setIsMuted(soundManager.isMutedState());
        setVolume(soundManager.getVolume());
    }, []);

    const handleMuteToggle = () => {
        const newMutedState = soundManager.toggleMute();
        setIsMuted(newMutedState);
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        soundManager.setVolume(newVolume);
    };

    const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        handleVolumeChange(newVolume);
    };

    return (
        <div className="relative">
            {/* Sound Toggle Button */}
            <motion.button
                onClick={() => setIsVisible(!isVisible)}
                className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 hover:bg-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sound Settings"
            >
                <span className="text-xl">
                    {isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}
                </span>
            </motion.button>

            {/* Sound Controls Panel */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="absolute bottom-full right-0 mb-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 min-w-[200px]"
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="space-y-3">
                            {/* Title */}
                            <div className="text-center font-semibold text-gray-700">
                                Sound Settings
                            </div>

                            {/* Mute Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Mute</span>
                                <motion.button
                                    onClick={handleMuteToggle}
                                    className={`w-12 h-6 rounded-full transition-colors ${isMuted ? 'bg-red-500' : 'bg-gray-300'
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                                        animate={{ x: isMuted ? 24 : 2 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                    />
                                </motion.button>
                            </div>

                            {/* Volume Slider */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Volume</span>
                                    <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolumeSliderChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        disabled={isMuted}
                                    />
                                    <style jsx>{`
                                        .slider::-webkit-slider-thumb {
                                            appearance: none;
                                            height: 16px;
                                            width: 16px;
                                            border-radius: 50%;
                                            background: #10B981;
                                            cursor: pointer;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                        }
                                        .slider::-moz-range-thumb {
                                            height: 16px;
                                            width: 16px;
                                            border-radius: 50%;
                                            background: #10B981;
                                            cursor: pointer;
                                            border: none;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                        }
                                    `}</style>
                                </div>
                            </div>

                            {/* Test Sound Button */}
                            <motion.button
                                onClick={() => soundManager.playCardSelect()}
                                className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                                disabled={isMuted}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                🔊 Test Sound
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 