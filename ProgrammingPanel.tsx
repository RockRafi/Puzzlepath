import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Move } from '../types/game';
import { Plus, Play, RotateCcw, Lightbulb, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface ProgrammingPanelProps {
  moves: Move[];
  onAddMove: (move: Move) => void;
  onRemoveMove: (index: number) => void;
  onExecute: () => void;
  onReset: () => void;
  onGetHint: () => void;
  isExecuting: boolean;
  currentMoveIndex: number;
}

export const ProgrammingPanel: React.FC<ProgrammingPanelProps> = ({
  moves,
  onAddMove,
  onRemoveMove,
  onExecute,
  onReset,
  onGetHint,
  isExecuting,
  currentMoveIndex,
}) => {
  const moveButtons = [
    { direction: 'up', icon: ArrowUp, label: 'Up' },
    { direction: 'down', icon: ArrowDown, label: 'Down' },
    { direction: 'left', icon: ArrowLeft, label: 'Left' },
    { direction: 'right', icon: ArrowRight, label: 'Right' },
  ];

  const addMove = (direction: string) => {
    const move: Move = {
      id: `move-${Date.now()}`,
      type: 'move',
      direction: direction as any,
    };
    onAddMove(move);
  };

  const getMoveIcon = (move: Move) => {
    switch (move.direction) {
      case 'up': return <ArrowUp className="w-4 h-4" />;
      case 'down': return <ArrowDown className="w-4 h-4" />;
      case 'left': return <ArrowLeft className="w-4 h-4" />;
      case 'right': return <ArrowRight className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Your Path</h3>
      
      {/* Move Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {moveButtons.map(({ direction, icon: Icon, label }) => (
          <motion.button
            key={direction}
            onClick={() => addMove(direction)}
            className="flex items-center justify-center gap-2 p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl border border-primary-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isExecuting}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Move Sequence */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Move Sequence</h4>
        <div className="min-h-[120px] bg-gray-50 rounded-xl p-3 border-2 border-dashed border-gray-200">
          <AnimatePresence>
            {moves.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Add moves to create your program
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {moves.map((move, index) => (
                  <motion.div
                    key={move.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all',
                      index === currentMoveIndex && isExecuting
                        ? 'bg-primary-500 text-white border-primary-600 animate-pulse'
                        : index < currentMoveIndex && isExecuting
                        ? 'bg-success-100 text-success-700 border-success-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    )}
                    onClick={() => !isExecuting && onRemoveMove(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getMoveIcon(move)}
                    <span>{move.direction}</span>
                    {!isExecuting && (
                      <span className="text-xs text-gray-400">×</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <motion.button
          onClick={onExecute}
          disabled={moves.length === 0 || isExecuting}
          className="flex-1 flex items-center justify-center gap-2 p-3 bg-success-500 hover:bg-success-600 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-4 h-4" />
          {isExecuting ? 'Running...' : 'Execute'}
        </motion.button>
        
        <motion.button
          onClick={onReset}
          disabled={isExecuting}
          className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-xl transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={onGetHint}
          disabled={isExecuting}
          className="flex items-center justify-center p-3 bg-warning-100 hover:bg-warning-200 disabled:bg-gray-50 text-warning-700 rounded-xl transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Lightbulb className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};