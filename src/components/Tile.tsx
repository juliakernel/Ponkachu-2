'use client';

import { motion } from 'framer-motion';
import { Tile as TileType } from '../store/gameState';
import Image from 'next/image';

interface TileProps {
    tile: TileType;
    onClick: (tile: TileType) => void;
    size?: number;
}

// Image paths for 24 different pieces
const PIECE_IMAGES = [
    '/images/pieces/1.jpg',
    '/images/pieces/2.jpg',
    '/images/pieces/3.jpg',
    '/images/pieces/4.jpg',
    '/images/pieces/5.jpg',
    '/images/pieces/6.jpg',
    '/images/pieces/7.jpg',
    '/images/pieces/8.jpg',
    '/images/pieces/9.jpg',
    '/images/pieces/10.jpg',
    '/images/pieces/11.jpg',
    '/images/pieces/12.jpg',
    '/images/pieces/13.jpg',
    '/images/pieces/14.jpg',
    '/images/pieces/15.jpg',
    '/images/pieces/16.jpg',
    '/images/pieces/17.jpg',
    '/images/pieces/18.jpg',
    '/images/pieces/19.jpg',
    '/images/pieces/20.jpg',
    '/images/pieces/21.jpg',
    '/images/pieces/22.jpg',
    '/images/pieces/23.jpg',
    '/images/pieces/24.jpg',
];

const PIECE_NAMES = [
    'Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5', 'Piece 6',
    'Piece 7', 'Piece 8', 'Piece 9', 'Piece 10', 'Piece 11', 'Piece 12',
    'Piece 13', 'Piece 14', 'Piece 15', 'Piece 16', 'Piece 17', 'Piece 18',
    'Piece 19', 'Piece 20', 'Piece 21', 'Piece 22', 'Piece 23', 'Piece 24'
];

const PIECE_COLORS = [
    'bg-yellow-400', 'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-purple-500', 'bg-gray-600', 'bg-cyan-400', 'bg-indigo-600',
    'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-lime-500',
    'bg-amber-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500',
    'bg-rose-500', 'bg-fuchsia-500', 'bg-slate-500', 'bg-zinc-500',
    'bg-neutral-500', 'bg-stone-500', 'bg-red-400', 'bg-blue-400'
];

export default function Tile({ tile, onClick, size = 64 }: TileProps) {
    if (tile.isEmpty) {
        return (
            <div className="border border-transparent bg-transparent rounded-lg w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
        );
    }

    const handleClick = () => {
        if (!tile.isMatched && !tile.isEmpty) {
            onClick(tile);
        }
    };

    const baseClasses = `
    border-2 cursor-pointer transition-all duration-200 rounded-lg
    flex items-center justify-center overflow-hidden
    hover:scale-105 active:scale-95
    w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
    ${PIECE_COLORS[tile.type] || 'bg-gray-300'}
  `;

    const selectedClasses = tile.isSelected
        ? 'border-yellow-400 shadow-lg'
        : 'border-gray-300 hover:border-gray-400';

    const matchedClasses = tile.isMatched
        ? 'opacity-0 cursor-not-allowed'
        : 'opacity-100';

    return (
        <motion.div
            className={`${baseClasses} ${selectedClasses} ${matchedClasses}`}
            onClick={handleClick}
            whileHover={!tile.isMatched ? { scale: 1.05 } : {}}
            whileTap={!tile.isMatched ? { scale: 0.95 } : {}}
            animate={{
                opacity: tile.isMatched ? 0 : 1,
                scale: tile.isMatched ? 0.8 : 1,
            }}
            transition={{
                duration: 0.2,
                ease: 'easeInOut',
            }}
            title={`${PIECE_NAMES[tile.type]} Piece`}
        >
            {!tile.isMatched && (
                <motion.div
                    className="relative w-full h-full flex items-center justify-center"
                    animate={{
                        y: tile.isSelected ? -2 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <Image
                        src={PIECE_IMAGES[tile.type] || PIECE_IMAGES[0]}
                        alt={PIECE_NAMES[tile.type]}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-md"
                        priority={false}
                    />
                </motion.div>
            )}

            {/* Matching animation overlay */}
            {tile.isMatched && (
                <motion.div
                    className="absolute inset-0 bg-green-400 rounded-lg flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-white text-4xl">✓</span>
                </motion.div>
            )}
        </motion.div>
    );
}