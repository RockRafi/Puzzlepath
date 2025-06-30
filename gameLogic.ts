import { GameState, Position, Cell, Move } from '../types/game';

export const GRID_SIZE = 8;

export function createInitialGrid(level: number): Cell[][] {
  const grid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({ type: 'empty' as const }))
  );

  // Level-based maze generation
  switch (level) {
    case 1:
      // Simple path with one goal
      grid[1][1] = { type: 'start' };
      grid[1][6] = { type: 'goal' };
      grid[3][3] = { type: 'wall' };
      grid[3][4] = { type: 'wall' };
      grid[4][3] = { type: 'wall' };
      break;
    
    case 2:
      // Add a switch and door
      grid[1][1] = { type: 'start' };
      grid[6][6] = { type: 'goal' };
      grid[3][3] = { type: 'switch', id: 'switch1', isActive: false };
      grid[4][4] = { type: 'door', switchId: 'switch1', isActive: false };
      grid[2][2] = { type: 'wall' };
      grid[5][5] = { type: 'wall' };
      break;
    
    default:
      // More complex maze
      grid[0][0] = { type: 'start' };
      grid[7][7] = { type: 'goal' };
      grid[2][2] = { type: 'switch', id: 'switch1', isActive: false };
      grid[5][5] = { type: 'door', switchId: 'switch1', isActive: false };
      // Add some walls
      for (let i = 1; i < 6; i++) {
        grid[3][i] = { type: 'wall' };
      }
      grid[3][2] = { type: 'empty' }; // Gap in wall
      break;
  }

  return grid;
}

export function createInitialGameState(level: number): GameState {
  const grid = createInitialGrid(level);
  const startPos = findStartPosition(grid);
  const totalGoals = countGoals(grid);

  return {
    grid,
    playerPosition: startPos,
    moves: [],
    isExecuting: false,
    isComplete: false,
    currentMoveIndex: 0,
    switches: {},
    collectedGoals: 0,
    totalGoals,
    level,
    hints: 3,
  };
}

function findStartPosition(grid: Cell[][]): Position {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x].type === 'start') {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
}

function countGoals(grid: Cell[][]): number {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x].type === 'goal') {
        count++;
      }
    }
  }
  return count;
}

export function isValidMove(
  position: Position,
  direction: string,
  grid: Cell[][],
  switches: Record<string, boolean>
): boolean {
  const newPos = getNewPosition(position, direction);
  
  if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
    return false;
  }

  const cell = grid[newPos.y][newPos.x];
  
  if (cell.type === 'wall') {
    return false;
  }
  
  if (cell.type === 'door' && cell.switchId) {
    return switches[cell.switchId] || false;
  }

  return true;
}

export function getNewPosition(position: Position, direction: string): Position {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - 1 };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    case 'left':
      return { x: position.x - 1, y: position.y };
    case 'right':
      return { x: position.x + 1, y: position.y };
    default:
      return position;
  }
}

export function executeMove(
  gameState: GameState,
  move: Move
): Partial<GameState> {
  const { playerPosition, grid, switches, collectedGoals } = gameState;
  
  if (move.type === 'move' && move.direction) {
    if (isValidMove(playerPosition, move.direction, grid, switches)) {
      const newPosition = getNewPosition(playerPosition, move.direction);
      const cell = grid[newPosition.y][newPosition.x];
      
      let newCollectedGoals = collectedGoals;
      let newSwitches = { ...switches };
      
      if (cell.type === 'goal') {
        newCollectedGoals++;
      }
      
      if (cell.type === 'switch' && cell.id) {
        newSwitches[cell.id] = !newSwitches[cell.id];
      }
      
      return {
        playerPosition: newPosition,
        switches: newSwitches,
        collectedGoals: newCollectedGoals,
        isComplete: newCollectedGoals >= gameState.totalGoals,
      };
    }
  }
  
  return {};
}