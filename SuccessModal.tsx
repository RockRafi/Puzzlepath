import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  level: number;
  moves: number;
  onNextLevel: () => void;
  onRestart: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  level,
  moves,
  onNextLevel,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Trophy className="w-8 h-8 text-success-600" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Level Complete! 🎉
        </h2>
        
        <p className="text-gray-600 mb-6">
          You solved level {level} in {moves} moves!
        </p>
        
        <div className="flex gap-3">
          <motion.button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </motion.button>
          
          <motion.button
            onClick={onNextLevel}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next Level
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};