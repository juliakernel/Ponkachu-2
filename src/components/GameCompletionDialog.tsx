'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useGameStore } from '../store/gameState';

interface GameCompletionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GameCompletionDialog({ isOpen, onClose }: GameCompletionDialogProps) {
    const { totalScore, resetGame } = useGameStore();
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!walletAddress.trim()) {
            alert('Please enter your wallet address');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);

            // Reset game after showing success
            setTimeout(() => {
                resetGame();
                onClose();
                setIsSubmitted(false);
                setWalletAddress('');
            }, 2000);
        }, 1500);
    };

    const handleNewGame = () => {
        resetGame();
        onClose();
        setIsSubmitted(false);
        setWalletAddress('');
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
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-yellow-300 rounded-2xl p-6 max-w-md w-full shadow-2xl pointer-events-auto">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <motion.div
                                    className="text-6xl mb-4"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    🏆
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Game Complete!
                                </h2>
                                <p className="text-yellow-100">
                                    Congratulations! You've completed all 5 levels!
                                </p>
                            </div>

                            {/* Final Score */}
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6 text-center">
                                <div className="text-4xl font-bold text-white mb-2">
                                    {totalScore.toLocaleString()}
                                </div>
                                <div className="text-yellow-100 font-medium">
                                    Total Score
                                </div>
                            </div>

                            {/* Achievement Stats */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                                <h3 className="text-lg font-semibold text-white mb-3 text-center">
                                    🎯 Achievement Summary
                                </h3>
                                <div className="space-y-2 text-sm text-yellow-100">
                                    <div className="flex justify-between">
                                        <span>Levels Completed</span>
                                        <span className="font-semibold">5/5</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Matches</span>
                                        <span className="font-semibold">~{Math.floor(totalScore / 100)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Score</span>
                                        <span className="font-semibold">{Math.floor(totalScore / 5)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Wallet Address Input */}
                            {!isSubmitted && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Enter Your Wallet Address
                                    </label>
                                    <input
                                        type="text"
                                        value={walletAddress}
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                        placeholder="0x1234...5678"
                                        className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-yellow-100 mt-1">
                                        Submit your score to the leaderboard
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {!isSubmitted ? (
                                    <>
                                        <motion.button
                                            onClick={handleNewGame}
                                            className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/30 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isSubmitting}
                                        >
                                            New Game
                                        </motion.button>
                                        <motion.button
                                            onClick={handleSubmit}
                                            className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isSubmitting || !walletAddress.trim()}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <span className="ml-2">Submitting...</span>
                                                </span>
                                            ) : (
                                                'Submit Score'
                                            )}
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.div
                                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium text-center"
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                    >
                                        ✅ Score Submitted Successfully!
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 