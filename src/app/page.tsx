'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GameBoard from '../components/GameBoard';
import GameCompletionDialog from '../components/GameCompletionDialog';
import LevelCompleteDialog from '../components/LevelCompleteDialog';
import { useGameStore } from '../store/gameState';
import { getHint } from '../utils/shuffle';
import soundManager from '../utils/soundManager';

export default function Home() {
  const {
    board,
    gameStatus,
    timeLeft,
    score,
    level,
    totalScore,
    initializeBoard,
    resetGame,
    pauseGame,
    resumeGame,
    shuffleBoard,
    updateTimer,
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

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        updateTimer();
      }, 1000); // Update every second

      return () => clearInterval(timer);
    }
  }, [gameStatus, updateTimer]);

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
    // Handle successful match
  };

  const handleNoValidMoves = () => {
    // Handle no valid moves
  };

  const handleDebugWin = () => {
    // Simulate winning the game
    console.log('Debug: Simulating win');
  };

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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/images/background.png)',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header/Navbar */}
        <motion.header
          className="bg-white/80 backdrop-blur-md border-b border-white/30"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4">
            <div className="flex items-center justify-between py-3">
              {/* Game Status */}
              <div className="flex items-center space-x-4">
                <motion.div
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full ${getStatusColor()} flex items-center space-x-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-base">{getStatusIcon()}</span>
                  <span>
                    {gameStatus === 'playing' ? 'Playing' :
                      gameStatus === 'paused' ? 'Paused' :
                        gameStatus === 'won' ? 'Victory!' :
                          'Game Over'}
                  </span>
                </motion.div>
              </div>

              {/* Game Stats */}
              <div className="flex items-center space-x-6">
                {/* Timer */}
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Time</div>
                  <div className={`text-lg font-bold ${timeLeft <= 30 ? 'text-red-600' :
                    timeLeft <= 60 ? 'text-yellow-600' :
                      'text-gray-800'
                    }`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Score</div>
                  <div className="text-lg font-bold text-green-600">
                    {score.toLocaleString()}
                  </div>
                </div>

                {/* Level */}
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Level</div>
                  <div className="text-lg font-bold text-purple-600">
                    {level}/5
                  </div>
                </div>

                {/* Total Score */}
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Total</div>
                  <div className="text-lg font-bold text-orange-600">
                    {totalScore.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Game Controls */}
              <div className="flex gap-2">
                <motion.button
                  onClick={handleNewGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Game
                </motion.button>

                <motion.button
                  onClick={handlePauseResume}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {gameStatus === 'playing' ? 'Pause' : 'Resume'}
                </motion.button>

                <motion.button
                  onClick={handleShuffle}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shuffle
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <GameBoard
              onMatch={handleMatchFound}
              onNoValidMoves={handleNoValidMoves}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <LevelCompleteDialog
        isOpen={showLevelComplete}
        onClose={() => setShowLevelComplete(false)}
      />
      <GameCompletionDialog
        isOpen={showGameCompletion}
        onClose={() => setShowGameCompletion(false)}
      />
    </div>
  );
}