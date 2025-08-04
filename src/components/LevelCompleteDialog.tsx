'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameState';

interface LevelCompleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LevelCompleteDialog({ isOpen, onClose }: LevelCompleteDialogProps) {
    const { level, score, totalScore, nextLevel } = useGameStore();

    const handleNextLevel = () => {
        nextLevel();
        onClose();
    };

    const getLevelConfig = (level: number) => {
        const configs = {
            1: { timeLimit: 300, boardSize: 10, pieceTypes: 12 },
            2: { timeLimit: 240, boardSize: 10, pieceTypes: 16 },
            3: { timeLimit: 180, boardSize: 10, pieceTypes: 20 },
            4: { timeLimit: 120, boardSize: 10, pieceTypes: 22 },
            5: { timeLimit: 100, boardSize: 10, pieceTypes: 24 },
        };
        return configs[level as keyof typeof configs];
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const nextLevelConfig = getLevelConfig(level + 1);

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
                        <div className="bg-gradient-to-br from-green-400 to-blue-500 border-2 border-green-300 rounded-2xl p-6 max-w-md w-full shadow-2xl pointer-events-auto">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <motion.div
                                    className="text-6xl mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    🎉
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Level {level} Complete!
                                </h2>
                                <p className="text-green-100">
                                    Excellent work! Ready for the next challenge?
                                </p>
                            </div>

                            {/* Level Stats */}
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-white">{score}</div>
                                        <div className="text-sm text-green-100">Level Score</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{totalScore}</div>
                                        <div className="text-sm text-green-100">Total Score</div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Level Preview */}
                            {level < 5 && nextLevelConfig && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-3">
                                        Next Level Preview
                                    </h3>
                                    <div className="space-y-2 text-sm text-green-100">
                                        <div className="flex justify-between">
                                            <span>Level {level + 1}</span>
                                            <span className="font-semibold">Harder!</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Board Size</span>
                                            <span>{nextLevelConfig.boardSize}×{nextLevelConfig.boardSize}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Time Limit</span>
                                            <span>{formatTime(nextLevelConfig.timeLimit)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Piece Types</span>
                                            <span>{nextLevelConfig.pieceTypes}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-green-100 mb-2">
                                    <span>Progress</span>
                                    <span>{level}/5</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <motion.div
                                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(level / 5) * 100}%` }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {level < 5 ? (
                                    <>
                                        <motion.button
                                            onClick={onClose}
                                            className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/30 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Review
                                        </motion.button>
                                        <motion.button
                                            onClick={handleNextLevel}
                                            className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Next Level →
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        onClick={onClose}
                                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
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