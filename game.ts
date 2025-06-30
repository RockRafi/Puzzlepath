export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  type: 'empty' | 'wall' | 'start' | 'goal' | 'switch' | 'door';
  id?: string;
  switchId?: string; // For doors, which switch controls them
  isActive?: boolean; // For switches and doors
}

export interface GameState {
  grid: Cell[][];
  playerPosition: Position;
  moves: Move[];
  isExecuting: boolean;
  isComplete: boolean;
  currentMoveIndex: number;
  switches: Record<string, boolean>;
  collectedGoals: number;
  totalGoals: number;
  level: number;
  hints: number;
}

export interface Move {
  id: string;
  type: 'move' | 'toggle' | 'loop' | 'condition';
  direction?: 'up' | 'down' | 'left' | 'right';
  condition?: string;
  iterations?: number;
  subMoves?: Move[];
}

export interface AIHint {
  type: 'suggestion' | 'explanation' | 'warning';
  message: string;
  moveIndex?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface PlayerStats {
  level: number;
  successRate: number;
  averageTime: number;
  averageMoves: number;
  hintsUsed: number;
  totalPuzzlesSolved: number;
}