import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameGrid } from './components/GameGrid';
import { ProgrammingPanel } from './components/ProgrammingPanel';
import { HintPanel } from './components/HintPanel';
import { SuccessModal } from './components/SuccessModal';
import { GameState, Move, AIHint } from './types/game';
import { createInitialGameState, executeMove } from './utils/gameLogic';
import { AISystem } from './utils/aiSystem';
import { Brain, Zap } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(1));
  const [currentHint, setCurrentHint] = useState<AIHint | null>(null);
  const [aiSystem] = useState(() => new AISystem());
  const [showSuccess, setShowSuccess] = useState(false);

  const addMove = useCallback((move: Move) => {
    setGameState(prev => ({
      ...prev,
      moves: [...prev.moves, move],
    }));
  }, []);

  const removeMove = useCallback((index: number) => {
    setGameState(prev => ({
      ...prev,
      moves: prev.moves.filter((_, i) => i !== index),
    }));
  }, []);

  const executeProgram = useCallback(async () => {
    if (gameState.moves.length === 0 || gameState.isExecuting) return;

    setGameState(prev => ({ ...prev, isExecuting: true, currentMoveIndex: 0 }));

    for (let i = 0; i < gameState.moves.length; i++) {
      setGameState(prev => ({ ...prev, currentMoveIndex: i }));
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGameState(prev => {
        const updates = executeMove(prev, prev.moves[i]);
        const newState = { ...prev, ...updates };
        
        if (newState.isComplete) {
          setTimeout(() => setShowSuccess(true), 500);
        }
        
        return newState;
      });
    }

    setGameState(prev => ({ ...prev, isExecuting: false, currentMoveIndex: -1 }));
  }, [gameState.moves, gameState.isExecuting]);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState(gameState.level));
    setCurrentHint(null);
    setShowSuccess(false);
  }, [gameState.level]);

  const nextLevel = useCallback(() => {
    const newLevel = gameState.level + 1;
    setGameState(createInitialGameState(newLevel));
    setCurrentHint(null);
    setShowSuccess(false);
  }, [gameState.level]);

  const getHint = useCallback(() => {
    if (gameState.hints > 0) {
      const hint = aiSystem.generateHint(gameState);
      setCurrentHint(hint);
      setGameState(prev => ({ ...prev, hints: prev.hints - 1 }));
    }
  }, [gameState, aiSystem]);

  const closeHint = useCallback(() => {
    setCurrentHint(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sf">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">PuzzlePaths</h1>
                <p className="text-sm text-gray-600">AI-Powered Programming Puzzles</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>AI Assistant Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameGrid gameState={gameState} />
          </motion.div>

          {/* Programming Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProgrammingPanel
              moves={gameState.moves}
              onAddMove={addMove}
              onRemoveMove={removeMove}
              onExecute={executeProgram}
              onReset={resetGame}
              onGetHint={getHint}
              isExecuting={gameState.isExecuting}
              currentMoveIndex={gameState.currentMoveIndex}
            />
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Play</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="mb-2">🏁 <strong>Start:</strong> Your robot begins here</p>
              <p className="mb-2">⭐ <strong>Goal:</strong> Collect all stars to win</p>
              <p>🧱 <strong>Wall:</strong> Blocks your path</p>
            </div>
            <div>
              <p className="mb-2">🔘 <strong>Switch:</strong> Activates doors when stepped on</p>
              <p className="mb-2">🚫 <strong>Door:</strong> Blocks path until switch is activated</p>
              <p>💡 <strong>Hint:</strong> Get AI assistance when stuck</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Hint Panel */}
      <HintPanel hint={currentHint} onClose={closeHint} />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        level={gameState.level}
        moves={gameState.moves.length}
        onNextLevel={nextLevel}
        onRestart={resetGame}
      />
    </div>
  );
}

export default App;