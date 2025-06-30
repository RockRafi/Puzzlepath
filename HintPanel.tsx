import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIHint } from '../types/game';
import { X, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface HintPanelProps {
  hint: AIHint | null;
  onClose: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({ hint, onClose }) => {
  if (!hint) return null;

  const getHintIcon = () => {
    switch (hint.type) {
      case 'suggestion': return <Info className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'explanation': return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getHintStyle = () => {
    switch (hint.type) {
      case 'suggestion': return 'bg-primary-50 border-primary-200 text-primary-800';
      case 'warning': return 'bg-warning-50 border-warning-200 text-warning-800';
      case 'explanation': return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={clsx(
          'fixed top-4 right-4 max-w-sm p-4 rounded-xl border-2 shadow-lg z-50',
          getHintStyle()
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getHintIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">
              {hint.type === 'suggestion' && 'AI Suggestion'}
              {hint.type === 'warning' && 'Warning'}
              {hint.type === 'explanation' && 'Explanation'}
            </p>
            <p className="text-sm">{hint.message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};