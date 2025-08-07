'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameState';
import { canConnectTiles } from '../utils/pathCheck';
import { needsShuffle, shuffleBoardWithValidMoves } from '../utils/shuffle';
import Tile from './Tile';
import PathVisualizer from './PathVisualizer';
import soundManager from '../utils/soundManager';

interface GameBoardProps {
    onMatch?: () => void;
    onNoValidMoves?: () => void;
}

export default function GameBoard({ onMatch, onNoValidMoves }: GameBoardProps) {
    const [showPath, setShowPath] = useState(false);
    const {
        board,
        selectedTiles,
        gameStatus,
        boardWidth,
        boardHeight,
        selectTile,
        clearSelection,
        removeTiles,
        shuffleBoard,
    } = useGameStore();

    // Handle tile selection and matching logic
    useEffect(() => {
        if (selectedTiles.length === 2) {
            const [tile1, tile2] = selectedTiles;

            // Check if tiles can be connected
            const result = canConnectTiles(board, tile1, tile2);

            // Show path visualization
            setShowPath(true);

            if (result.canConnect) {
                // Match found! Show path briefly
                const matchTimer = setTimeout(() => {
                    setShowPath(false);
                    removeTiles(tile1, tile2);
                    onMatch?.();
                }, 400); // Giảm từ 800ms xuống 400ms

                // Cleanup timer if component unmounts or selection changes
                return () => clearTimeout(matchTimer);
            } else {
                // No match, play not match sound and clear selection quickly
                soundManager.playCardNotMatch();
                const clearTimer = setTimeout(() => {
                    setShowPath(false);
                    clearSelection();
                }, 500); // Giảm từ 1000ms xuống 500ms

                // Cleanup timer if component unmounts or selection changes
                return () => clearTimeout(clearTimer);
            }
        } else {
            setShowPath(false);
        }
    }, [selectedTiles.length, board, removeTiles, clearSelection, onMatch]);

    // Check for no valid moves and trigger shuffle
    useEffect(() => {
        if (gameStatus === 'playing' && board.length > 0) {
            const activeTiles = board.flat().filter(tile => !tile.isEmpty);

            if (activeTiles.length > 0 && needsShuffle(board)) {
                onNoValidMoves?.();
                // Auto-shuffle after a delay
                setTimeout(() => {
                    const newBoard = shuffleBoardWithValidMoves(board);
                    shuffleBoard();
                    soundManager.playLevelComplete(); // Play shuffle sound
                }, 2000);
            }
        }
    }, [board, gameStatus, shuffleBoard, onNoValidMoves]);

    const handleTileClick = (tile: any) => {
        if (gameStatus !== 'playing') return;

        // Prevent rapid clicking that might cause conflicts
        if (selectedTiles.length === 2) return;

        selectTile(tile);
    };

    const renderBoard = () => {
        return board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((tile, colIndex) => (
                    <motion.div
                        key={`${tile.id}-${tile.type}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, delay: (rowIndex + colIndex) * 0.01 }}
                    >
                        <Tile
                            tile={tile}
                            onClick={handleTileClick}
                            size={64}
                        />
                    </motion.div>
                ))}
            </div>
        ));
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Game Board */}
            <motion.div
                className="p-4 rounded-xl shadow-lg relative overflow-hidden"
                style={{
                    backgroundImage: 'url(/images/board-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Board overlay for better readability */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px] rounded-xl"></div>
                <motion.div
                    key={`board-${board[0]?.[0]?.type}`}
                    className="flex flex-col gap-1 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderBoard()}
                </motion.div>

                {/* Path Visualization */}
                {showPath && selectedTiles.length === 2 && (
                    <PathVisualizer
                        selectedTiles={selectedTiles}
                        board={board}
                        boardWidth={boardWidth}
                        boardHeight={boardHeight}
                    />
                )}
            </motion.div>
        </div>
    );
}