import { Tile } from '../store/gameState';
import { hasValidMoves } from './pathCheck';

/**
 * Fisher-Yates shuffle algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Shuffle the types of active tiles on the board
 */
export const shuffleBoardTypes = (board: Tile[][]): Tile[][] => {
    // Get all active (non-empty) tiles
    const activeTiles: Tile[] = [];
    const activePositions: { row: number; col: number }[] = [];

    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (!tile.isEmpty) {
                activeTiles.push(tile);
                activePositions.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    // Extract and shuffle the types
    const types = activeTiles.map(tile => tile.type);
    const shuffledTypes = shuffleArray(types);

    // Create new board with shuffled types
    const newBoard = board.map(row =>
        row.map(tile => ({ ...tile }))
    );

    // Assign shuffled types back to active positions
    activePositions.forEach((pos, index) => {
        newBoard[pos.row][pos.col] = {
            ...newBoard[pos.row][pos.col],
            type: shuffledTypes[index],
            isSelected: false,
        };
    });

    return newBoard;
};

/**
 * Shuffle board until there's at least one valid move
 * This prevents impossible board states
 */
export const shuffleBoardWithValidMoves = (
    board: Tile[][],
    maxAttempts: number = 100
): Tile[][] => {
    let shuffledBoard = shuffleBoardTypes(board);
    let attempts = 0;

    // Keep shuffling until we find a board with valid moves
    while (!hasValidMoves(shuffledBoard) && attempts < maxAttempts) {
        shuffledBoard = shuffleBoardTypes(board);
        attempts++;
    }

    // If we couldn't find a valid board after max attempts,
    // return the last attempt (this shouldn't happen with proper tile pairs)
    return shuffledBoard;
};

/**
 * Check if the board needs shuffling (no valid moves available)
 */
export const needsShuffle = (board: Tile[][]): boolean => {
    return !hasValidMoves(board);
};

/**
 * Get hint - find one possible move on the board
 */
export const getHint = (board: Tile[][]): { tile1: Tile; tile2: Tile } | null => {
    const activeTiles = board.flat().filter(tile => !tile.isEmpty);

    for (let i = 0; i < activeTiles.length; i++) {
        for (let j = i + 1; j < activeTiles.length; j++) {
            const tile1 = activeTiles[i];
            const tile2 = activeTiles[j];

            if (tile1.type === tile2.type) {
                const { canConnectTiles } = require('./pathCheck');
                const result = canConnectTiles(board, tile1, tile2);
                if (result.canConnect) {
                    return { tile1, tile2 };
                }
            }
        }
    }

    return null;
};

/**
 * Calculate shuffle penalty score
 */
export const getShufflePenalty = (currentScore: number): number => {
    return Math.floor(currentScore * 0.1); // 10% penalty
};

/**
 * Generate board statistics
 */
export const getBoardStats = (board: Tile[][]): {
    totalTiles: number;
    activeTiles: number;
    matchedTiles: number;
    emptyTiles: number;
    typeDistribution: Record<number, number>;
} => {
    const stats = {
        totalTiles: 0,
        activeTiles: 0,
        matchedTiles: 0,
        emptyTiles: 0,
        typeDistribution: {} as Record<number, number>,
    };

    board.forEach(row => {
        row.forEach(tile => {
            stats.totalTiles++;

            if (tile.isEmpty) {
                stats.emptyTiles++;
            } else {
                stats.activeTiles++;

                // Count type distribution for active tiles
                if (!stats.typeDistribution[tile.type]) {
                    stats.typeDistribution[tile.type] = 0;
                }
                stats.typeDistribution[tile.type]++;
            }

            if (tile.isMatched) {
                stats.matchedTiles++;
            }
        });
    });

    return stats;
};