import { create } from 'zustand';
import soundManager from '../utils/soundManager';

export interface Tile {
    id: string;
    type: number; // Piece type (0-23 for 24 different pieces)
    row: number;
    col: number;
    isSelected: boolean;
    isMatched: boolean;
    isEmpty: boolean;
}

export interface GameState {
    // Game board
    board: Tile[][];
    boardWidth: number;
    boardHeight: number;

    // Game state
    selectedTiles: Tile[];
    score: number;
    timeLeft: number;
    gameStatus: 'playing' | 'paused' | 'won' | 'lost' | 'levelComplete';
    level: number;
    totalScore: number;
    isGameCompleted: boolean;

    // Actions
    initializeBoard: (width: number, height: number) => void;
    selectTile: (tile: Tile) => void;
    clearSelection: () => void;
    removeTiles: (tile1: Tile, tile2: Tile) => void;
    shuffleBoard: () => void;
    updateTimer: () => void;
    resetGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    nextLevel: () => void;
    completeGame: () => void;
}

// Level configuration
const LEVEL_CONFIG = {
    1: { timeLimit: 300, boardSize: 10, pieceTypes: 12 }, // 5 minutes, 10x10, 12 types
    2: { timeLimit: 240, boardSize: 10, pieceTypes: 16 }, // 4 minutes, 10x10, 16 types
    3: { timeLimit: 180, boardSize: 10, pieceTypes: 20 }, // 3 minutes, 10x10, 20 types
    4: { timeLimit: 120, boardSize: 10, pieceTypes: 22 }, // 2 minutes, 10x10, 22 types
    5: { timeLimit: 90, boardSize: 10, pieceTypes: 24 }, // 1.5 minutes, 10x10, 24 types
};

// Generate random piece types for tiles based on level
const generateRandomType = (level: number): number => {
    const maxTypes = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]?.pieceTypes || 24;
    return Math.floor(Math.random() * maxTypes);
};

// Create a board with guaranteed pairs for specific level and border
const createBoardWithPairs = (width: number, height: number, level: number): Tile[][] => {
    const totalCells = width * height;
    const types: number[] = [];

    // Ensure we have pairs by adding each type twice
    for (let i = 0; i < totalCells / 2; i++) {
        const type = generateRandomType(level);
        types.push(type, type);
    }

    // Shuffle the types array
    for (let i = types.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [types[i], types[j]] = [types[j], types[i]];
    }

    // Create extended board with border (width + 2, height + 2)
    const extendedWidth = width + 2;
    const extendedHeight = height + 2;
    const board: Tile[][] = [];

    for (let row = 0; row < extendedHeight; row++) {
        board[row] = [];
        for (let col = 0; col < extendedWidth; col++) {
            // Check if this is a border position
            const isBorder = row === 0 || row === extendedHeight - 1 ||
                col === 0 || col === extendedWidth - 1;

            if (isBorder) {
                // Border tile - always empty
                board[row][col] = {
                    id: `${row}-${col}`,
                    type: 0,
                    row,
                    col,
                    isSelected: false,
                    isMatched: false,
                    isEmpty: true, // Border tiles are always empty
                };
            } else {
                // Regular tile
                const typeIndex = (row - 1) * width + (col - 1);
                board[row][col] = {
                    id: `${row}-${col}`,
                    type: types[typeIndex],
                    row,
                    col,
                    isSelected: false,
                    isMatched: false,
                    isEmpty: false,
                };
            }
        }
    }

    return board;
};

export const useGameStore = create<GameState>((set, get) => ({
    // Initial state
    board: [],
    boardWidth: 10,
    boardHeight: 10,
    selectedTiles: [],
    score: 0,
    timeLeft: 300, // 5 minutes
    gameStatus: 'playing',
    level: 1,
    totalScore: 0,
    isGameCompleted: false,

    // Initialize board for specific level
    initializeBoard: (width: number, height: number) => {
        const { level } = get();
        const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
        const board = createBoardWithPairs(width, height, level);
        set({
            board,
            boardWidth: width + 2, // Add border width
            boardHeight: height + 2, // Add border height
            selectedTiles: [],
            score: 0,
            timeLeft: config.timeLimit,
            gameStatus: 'playing',
        });
    },

    // Select a tile
    selectTile: (tile: Tile) => {
        const { selectedTiles, board, gameStatus } = get();

        // Don't select if game is not playing or tile is already matched or empty
        if (gameStatus !== 'playing' || tile.isMatched || tile.isEmpty) return;

        // If tile is already selected, deselect it
        if (tile.isSelected) {
            set({
                selectedTiles: selectedTiles.filter(t => t.id !== tile.id),
                board: board.map(row =>
                    row.map(t =>
                        t.id === tile.id ? { ...t, isSelected: false } : t
                    )
                ),
            });
            return;
        }

        // If we already have 2 tiles selected, don't allow more selections
        if (selectedTiles.length >= 2) return;

        // Play selection sound
        soundManager.playCardSelect();

        // Select the tile
        const newSelectedTiles = [...selectedTiles, tile];
        set({
            selectedTiles: newSelectedTiles,
            board: board.map(row =>
                row.map(t =>
                    t.id === tile.id ? { ...t, isSelected: true } : t
                )
            ),
        });
    },

    // Clear selection
    clearSelection: () => {
        const { board, selectedTiles } = get();

        // Only clear if there are actually selected tiles
        if (selectedTiles.length === 0) return;

        set({
            selectedTiles: [],
            board: board.map(row =>
                row.map(tile => ({ ...tile, isSelected: false }))
            ),
        });
    },

    // Remove matched tiles
    removeTiles: (tile1: Tile, tile2: Tile) => {
        const { board, score } = get();

        // Play match sound
        soundManager.playCardMatch();

        set({
            selectedTiles: [],
            score: score + 100,
            board: board.map(row =>
                row.map(tile => {
                    if (tile.id === tile1.id || tile.id === tile2.id) {
                        return { ...tile, isMatched: true, isSelected: false, isEmpty: true };
                    }
                    return { ...tile, isSelected: false };
                })
            ),
        });

        // Check if level is completed
        const { board: newBoard, level } = get();
        const remainingTiles = newBoard.flat().filter(tile => !tile.isEmpty);
        if (remainingTiles.length === 0) {
            if (level < 5) {
                // Level completed, prepare for next level
                set({
                    gameStatus: 'levelComplete',
                    totalScore: get().totalScore + score + 100 // Add level bonus
                });
                soundManager.playLevelComplete();
            } else {
                // Game completed
                set({
                    gameStatus: 'won',
                    totalScore: get().totalScore + score + 100,
                    isGameCompleted: true
                });
                soundManager.playGameVictory();
            }
        }
    },

    // Shuffle board
    shuffleBoard: () => {
        const { board, boardWidth, boardHeight } = get();
        const activeTiles = board.flat().filter(tile => !tile.isEmpty);
        const types = activeTiles.map(tile => tile.type);

        // Shuffle types
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }

        // Reassign types to active tiles
        let typeIndex = 0;
        const newBoard = board.map(row =>
            row.map(tile => {
                if (!tile.isEmpty) {
                    return { ...tile, type: types[typeIndex++], isSelected: false };
                }
                return tile;
            })
        );

        // Play shuffle sound
        soundManager.playLevelComplete();

        set({
            board: newBoard,
            selectedTiles: [],
        });
    },

    // Update timer
    updateTimer: () => {
        const { timeLeft, gameStatus } = get();
        if (gameStatus === 'playing' && timeLeft > 0) {
            const newTimeLeft = timeLeft - 1;
            set({ timeLeft: newTimeLeft });
            if (newTimeLeft <= 0) {
                set({ gameStatus: 'lost' });
                soundManager.playTimeUp();
            }
        }
    },

    // Reset game
    resetGame: () => {
        const { boardWidth, boardHeight } = get();
        set({
            level: 1,
            totalScore: 0,
            isGameCompleted: false,
            gameStatus: 'playing'
        });
        get().initializeBoard(boardWidth, boardHeight);
    },

    // Next level
    nextLevel: () => {
        const { level } = get();
        const nextLevel = level + 1;
        const config = LEVEL_CONFIG[nextLevel as keyof typeof LEVEL_CONFIG];

        set({
            level: nextLevel,
            boardWidth: config.boardSize,
            boardHeight: config.boardSize,
            score: 0,
            timeLeft: config.timeLimit,
            gameStatus: 'playing'
        });

        get().initializeBoard(config.boardSize, config.boardSize);
    },

    // Complete game
    completeGame: () => {
        set({ isGameCompleted: true });
    },

    // Pause game
    pauseGame: () => {
        set({ gameStatus: 'paused' });
    },

    // Resume game
    resumeGame: () => {
        set({ gameStatus: 'playing' });
    },
}));