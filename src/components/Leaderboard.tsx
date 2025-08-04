'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LeaderboardEntry {
    id: string;
    name: string;
    score: number;
    level: number;
    date: string;
}

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
        { id: '1', name: 'Pikachu Master', score: 2500, level: 3, date: '2024-01-15' },
        { id: '2', name: 'Pokemon Trainer', score: 2100, level: 2, date: '2024-01-14' },
        { id: '3', name: 'Gotta Catch Em All', score: 1800, level: 2, date: '2024-01-13' },
        { id: '4', name: 'Ash Ketchum', score: 1500, level: 1, date: '2024-01-12' },
        { id: '5', name: 'Misty', score: 1200, level: 1, date: '2024-01-11' },
    ]);

    return (
        <motion.div
            className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-4 h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="space-y-4 h-full flex flex-col">
                {/* Header */}
                <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">🏆 Leaderboard</h3>
                    <div className="text-xs text-gray-500">Top Players</div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-2 flex-1 overflow-y-auto">
                    {leaderboard.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            className={`flex items-center justify-between p-2 rounded-lg ${index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                                index === 1 ? 'bg-gray-50 border border-gray-200' :
                                    index === 2 ? 'bg-orange-50 border border-orange-200' :
                                        'bg-white border border-gray-100'
                                }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Rank */}
                            <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-400 text-white' :
                                    index === 1 ? 'bg-gray-400 text-white' :
                                        index === 2 ? 'bg-orange-400 text-white' :
                                            'bg-gray-200 text-gray-600'
                                    }`}>
                                    {index + 1}
                                </div>

                                {/* Player Info */}
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-800 truncate">
                                        {entry.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Level {entry.level} • {entry.date}
                                    </div>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <div className="text-sm font-bold text-green-600">
                                    {entry.score.toLocaleString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add Score Button */}
                <motion.button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Submit Your Score
                </motion.button>

                {/* Stats */}
                <div className="text-center pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        Total Players: {leaderboard.length}
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 