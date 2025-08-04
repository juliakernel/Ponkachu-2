'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameState';

interface GameStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GameStatusDialog({ isOpen, onClose }: GameStatusDialogProps) {
    const { gameStatus, score, timeLeft, level, resetGame } = useGameStore();

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getStatusConfig = () => {
        switch (gameStatus) {
            case 'playing':
                return {
                    icon: '⚡',
                    title: 'Game in Progress',
                    message: 'Keep matching tiles to clear the board!',
                    color: 'green',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800'
                };
            case 'paused':
                return {
                    icon: '⏸️',
                    title: 'Game Paused',
                    message: 'Click Resume to continue playing.',
                    color: 'yellow',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-800'
                };
            case 'won':
                return {
                    icon: '🏆',
                    title: 'Victory!',
                    message: 'Congratulations! You cleared all tiles!',
                    color: 'blue',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-800'
                };
            case 'lost':
                return {
                    icon: '💀',
                    title: 'Game Over',
                    message: 'Time ran out! Try again to beat your score.',
                    color: 'red',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800'
                };
            case 'levelComplete':
                return {
                    icon: '🎉',
                    title: 'Level Complete!',
                    message: 'Great job! Ready for the next challenge?',
                    color: 'purple',
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                    textColor: 'text-purple-800'
                };
            default:
                return {
                    icon: '❓',
                    title: 'Unknown Status',
                    message: 'Something went wrong.',
                    color: 'gray',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-800'
                };
        }
    };

    const statusConfig = getStatusConfig();

    const handleNewGame = () => {
        resetGame();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 rounded-2xl p-6 max-w-md w-full shadow-2xl pointer-events-auto`}>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="text-4xl mb-2">{statusConfig.icon}</div>
                                <h2 className={`text-2xl font-bold ${statusConfig.textColor} mb-2`}>
                                    {statusConfig.title}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {statusConfig.message}
                                </p>
                            </div>

                            {/* Game Stats */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">Score</div>
                                        <div className="text-xl font-bold text-green-600">
                                            {score.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">Level</div>
                                        <div className="text-xl font-bold text-purple-600">
                                            {level}
                                        </div>
                                    </div>
                                </div>

                                {gameStatus === 'playing' && (
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">Time Left</div>
                                        <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-600' :
                                            timeLeft <= 60 ? 'text-yellow-600' :
                                                'text-gray-800'
                                            }`}>
                                            {formatTime(timeLeft)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {gameStatus === 'won' || gameStatus === 'lost' ? (
                                    <>
                                        <motion.button
                                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleNewGame}
                                        >
                                            🎮 New Game
                                        </motion.button>
                                        <motion.button
                                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onClose}
                                        >
                                            Close
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                    >
                                        Continue
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 