'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameState';
import GameBoard from '../components/GameBoard';
import StatsPanel from '../components/StatsPanel';
import Leaderboard from '../components/Leaderboard';
import { getHint } from '../utils/shuffle';
import SoundControls from '../components/SoundControls';
import soundManager from '../utils/soundManager';
import LevelCompleteDialog from '../components/LevelCompleteDialog';
import GameCompletionDialog from '../components/GameCompletionDialog';

export default function Home() {
  const {
    board,
    gameStatus,
    timeLeft,
    score,
    level,
    initializeBoard,
    resetGame,
    pauseGame,
    resumeGame,
    shuffleBoard,
  } = useGameStore();

  const [showHint, setShowHint] = useState(false);
  const [hintTiles, setHintTiles] = useState<{ tile1: any; tile2: any } | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameCompletion, setShowGameCompletion] = useState(false);

  // Initialize the game on component mount
  useEffect(() => {
    if (!gameStarted) {
      initializeBoard(8, 8); // Start with 8x8 board for level 1
      setGameStarted(true);

      // Start background music
      setTimeout(() => {
        soundManager.resumeAudioContext();
        soundManager.playBackgroundMusic();
      }, 1000); // Delay to allow user interaction
    }
  }, [initializeBoard, gameStarted]);

  // Handle level completion and game completion
  useEffect(() => {
    if (gameStatus === 'levelComplete') {
      setShowLevelComplete(true);
    } else if (gameStatus === 'won' && level === 5) {
      setShowGameCompletion(true);
    }
  }, [gameStatus, level]);

  const handleNewGame = () => {
    resetGame();
    setShowHint(false);
    setHintTiles(null);
  };

  const handlePauseResume = () => {
    if (gameStatus === 'playing') {
      pauseGame();
    } else if (gameStatus === 'paused') {
      resumeGame();
    }
  };

  const handleShuffle = () => {
    shuffleBoard();
    setShowHint(false);
    setHintTiles(null);
  };

  const handleHint = () => {
    if (board.length > 0) {
      const hint = getHint(board);
      if (hint) {
        setHintTiles(hint);
        setShowHint(true);
        setTimeout(() => {
          setShowHint(false);
          setHintTiles(null);
        }, 3000); // Show hint for 3 seconds
      }
    }
  };

  const handleMatchFound = () => {
    // Additional effects when a match is found
    setShowHint(false);
    setHintTiles(null);
  };

  const handleNoValidMoves = () => {
    // Show notification when no valid moves are available
    console.log('No valid moves available - auto shuffle will occur');
  };

  // Debug function to simulate win game
  const handleDebugWin = () => {
    const { board, score } = useGameStore.getState();

    // Clear all tiles by setting them to empty
    const clearedBoard = board.map(row =>
      row.map(tile => ({
        ...tile,
        isMatched: true,
        isEmpty: true,
        isSelected: false
      }))
    );

    // Update game state to won
    useGameStore.setState({
      board: clearedBoard,
      gameStatus: 'won',
      score: score + 500, // Add bonus points for winning
      selectedTiles: []
    });

    console.log('🎉 Debug: Game won!');
  };

  return (
    <div
      className="h-screen overflow-hidden relative"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

      {/* Header - Fixed at top */}
      <motion.header
        className="relative z-10 bg-white/30 backdrop-blur-sm shadow-sm h-16 flex items-center"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div>
                <h1 className="text-xl font-bold text-white">
                  Ponkachu
                </h1>
              </div>
            </motion.div>

            {/* Game Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleNewGame}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎮
              </motion.button>

              <motion.button
                onClick={handlePauseResume}
                disabled={gameStatus === 'won' || gameStatus === 'lost'}
                className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {gameStatus === 'playing' ? '⏸️' : '▶️'}
              </motion.button>

              <motion.button
                onClick={handleShuffle}
                disabled={gameStatus !== 'playing'}
                className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄
              </motion.button>

              <motion.button
                onClick={handleHint}
                disabled={gameStatus !== 'playing'}
                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💡
              </motion.button>

              {/* Debug Win Button */}
              <motion.button
                onClick={handleDebugWin}
                disabled={gameStatus === 'won' || gameStatus === 'lost'}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Debug: Simulate Win Game"
              >
                🏆
              </motion.button>

              {/* Sound Controls */}
              <SoundControls />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Game Area - Full height minus header */}
      <div className="relative z-10 h-[calc(100vh-4rem)] flex">
        {/* Left Panel - Stats */}
        <div className="w-64 p-4">
          <StatsPanel />
        </div>

        {/* Center - Game Board */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GameBoard
              onMatch={handleMatchFound}
              onNoValidMoves={handleNoValidMoves}
            />

            {/* Hint Display */}
            {showHint && hintTiles && (
              <motion.div
                className="bg-green-100 border border-green-300 rounded-lg p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-green-800 text-xs font-medium text-center">
                  💡 Hint: ({hintTiles.tile1.row + 1}, {hintTiles.tile1.col + 1}) → ({hintTiles.tile2.row + 1}, {hintTiles.tile2.col + 1})
                </div>
              </motion.div>
            )}

            {/* Game Instructions - Compact */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-xs text-gray-600 text-center">
                <div className="font-semibold mb-1">How to Play</div>
                <div>Match tiles with max 1 turn • Clear all before time runs out</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel - Leaderboard */}
        <div className="w-72 p-4">
          <Leaderboard />
        </div>
      </div>

      {/* Level Complete Dialog */}
      <LevelCompleteDialog
        isOpen={showLevelComplete}
        onClose={() => setShowLevelComplete(false)}
      />

      {/* Game Completion Dialog */}
      <GameCompletionDialog
        isOpen={showGameCompletion}
        onClose={() => setShowGameCompletion(false)}
      />
    </div>
  );
}