import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types/game';
import { clsx } from 'clsx';

interface GameGridProps {
  gameState: GameState;
}

export const GameGrid: React.FC<GameGridProps> = ({ gameState }) => {
  const { grid, playerPosition, switches, isExecuting } = gameState;

  const getCellStyle = (cell: any, x: number, y: number) => {
    const baseClasses = 'w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300';
    
    switch (cell.type) {
      case 'start':
        return clsx(baseClasses, 'bg-success-100 border-success-300 text-success-700');
      case 'goal':
        return clsx(baseClasses, 'bg-warning-100 border-warning-300 text-warning-700 animate-pulse-slow');
      case 'wall':
        return clsx(baseClasses, 'bg-gray-800 border-gray-900 text-white');
      case 'switch':
        const isActive = switches[cell.id] || false;
        return clsx(
          baseClasses,
          isActive 
            ? 'bg-primary-500 border-primary-600 text-white' 
            : 'bg-primary-100 border-primary-300 text-primary-700'
        );
      case 'door':
        const doorIsOpen = switches[cell.switchId] || false;
        return clsx(
          baseClasses,
          doorIsOpen 
            ? 'bg-gray-100 border-gray-300 text-gray-500' 
            : 'bg-error-500 border-error-600 text-white'
        );
      default:
        return clsx(baseClasses, 'bg-white border-gray-200 hover:border-gray-300');
    }
  };

  const getCellContent = (cell: any) => {
    switch (cell.type) {
      case 'start': return '🏁';
      case 'goal': return '⭐';
      case 'wall': return '🧱';
      case 'switch': return switches[cell.id] ? '🔛' : '🔘';
      case 'door': return switches[cell.switchId] ? '🚪' : '🚫';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="grid grid-cols-8 gap-1 mb-4">
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellStyle(cell, x, y)}
            >
              {getCellContent(cell)}
              {playerPosition.x === x && playerPosition.y === y && (
                <motion.div
                  className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    x: isExecuting ? 0 : 0,
                    y: isExecuting ? 0 : 0
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    🤖
                  </div>
                </motion.div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Level {gameState.level}</span>
        <span>Goals: {gameState.collectedGoals}/{gameState.totalGoals}</span>
        <span>Hints: {gameState.hints}</span>
      </div>
    </div>
  );
};