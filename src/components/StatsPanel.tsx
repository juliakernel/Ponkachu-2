'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameState';
import GameStatusDialog from './GameStatusDialog';

export default function StatsPanel() {
    const { score, timeLeft, level, gameStatus, totalScore } = useGameStore();
    const [showStatusDialog, setShowStatusDialog] = useState(false);

    // Auto-show dialog when game ends
    useEffect(() => {
        if (gameStatus === 'won' || gameStatus === 'lost') {
            setShowStatusDialog(true);
        }
    }, [gameStatus]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getStatusIcon = () => {
        switch (gameStatus) {
            case 'playing': return '⚡';
            case 'paused': return '⏸️';
            case 'won': return '🏆';
            case 'lost': return '💀';
            default: return '❓';
        }
    };

    const getStatusColor = () => {
        switch (gameStatus) {
            case 'playing': return 'bg-green-100 text-green-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'won': return 'bg-blue-100 text-blue-800';
            case 'lost': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <motion.div
                className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-4 h-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="space-y-4">
                    {/* Game Status Button */}
                    <div className="text-center">
                        <motion.button
                            className={`text-sm font-semibold px-4 py-2 rounded-full ${getStatusColor()} hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 w-full`}
                            onClick={() => setShowStatusDialog(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-lg">{getStatusIcon()}</span>
                            <span>
                                {gameStatus === 'playing' ? 'Playing' :
                                    gameStatus === 'paused' ? 'Paused' :
                                        gameStatus === 'won' ? 'Victory!' :
                                            'Game Over'}
                            </span>
                        </motion.button>
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Time Left</div>
                        <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-600' :
                            timeLeft <= 60 ? 'text-yellow-600' :
                                'text-gray-800'
                            }`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Score */}
                    <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Score</div>
                        <div className="text-2xl font-bold text-green-600">
                            {score.toLocaleString()}
                        </div>
                    </div>

                    {/* Level */}
                    <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Level</div>
                        <div className="text-xl font-bold text-purple-600">
                            {level}/5
                        </div>
                    </div>

                    {/* Total Score */}
                    <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Total Score</div>
                        <div className="text-lg font-bold text-orange-600">
                            {totalScore.toLocaleString()}
                        </div>
                    </div>

                    {/* Level Progress Bar */}
                    <div className="space-y-2">
                        <div className="text-xs text-gray-600">Level Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(level / 5) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Game Status Dialog */}
            <GameStatusDialog
                isOpen={showStatusDialog}
                onClose={() => setShowStatusDialog(false)}
            />
        </>
    );
} 