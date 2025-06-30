import { GameState, Move, AIHint, PlayerStats } from '../types/game';

export class AISystem {
  private playerStats: PlayerStats = {
    level: 1,
    successRate: 0,
    averageTime: 0,
    averageMoves: 0,
    hintsUsed: 0,
    totalPuzzlesSolved: 0,
  };

  generateHint(gameState: GameState): AIHint {
    const { playerPosition, grid, moves, switches } = gameState;
    
    // Analyze current situation
    const nearbyGoals = this.findNearbyGoals(playerPosition, grid);
    const nearbyWalls = this.findNearbyWalls(playerPosition, grid);
    const unactivatedSwitches = this.findUnactivatedSwitches(grid, switches);
    
    // Generate contextual hints
    if (moves.length === 0) {
      return {
        type: 'suggestion',
        message: 'Start by planning your path to the goal. Look for obstacles and switches that might block your way.',
        priority: 'medium'
      };
    }
    
    if (nearbyGoals.length > 0) {
      return {
        type: 'suggestion',
        message: `You're close to a goal! Try moving ${nearbyGoals[0].direction}.`,
        priority: 'high'
      };
    }
    
    if (unactivatedSwitches.length > 0 && this.hasBlockedPaths(gameState)) {
      return {
        type: 'suggestion',
        message: 'Some doors are blocking your path. Look for switches to activate them.',
        priority: 'high'
      };
    }
    
    if (moves.length > 20) {
      return {
        type: 'warning',
        message: 'Your solution is getting quite long. Try to find a more efficient path.',
        priority: 'medium'
      };
    }
    
    return {
      type: 'explanation',
      message: 'Think step by step: Where do you need to go? What obstacles are in your way?',
      priority: 'low'
    };
  }

  adaptDifficulty(gameState: GameState, timeSpent: number, attempts: number): number {
    // Simple adaptive difficulty based on performance
    if (attempts > 5 && timeSpent > 300) { // 5+ attempts, 5+ minutes
      return Math.max(1, gameState.level - 1); // Make it easier
    }
    
    if (attempts <= 2 && timeSpent < 60) { // Quick success
      return gameState.level + 1; // Make it harder
    }
    
    return gameState.level; // Keep same difficulty
  }

  generateExplanation(gameState: GameState): string[] {
    const steps = [
      '1. Analyze the maze layout and identify your goal',
      '2. Look for switches that control doors in your path',
      '3. Plan the shortest route, considering obstacles',
      '4. Execute your moves step by step',
    ];
    
    if (this.hasBlockedPaths(gameState)) {
      steps.splice(2, 0, '2.5. Activate necessary switches before approaching doors');
    }
    
    return steps;
  }

  private findNearbyGoals(position: any, grid: any[][]): Array<{direction: string}> {
    const directions = ['up', 'down', 'left', 'right'];
    const nearby = [];
    
    for (const dir of directions) {
      const newPos = this.getPositionInDirection(position, dir);
      if (this.isValidPosition(newPos, grid) && grid[newPos.y][newPos.x].type === 'goal') {
        nearby.push({ direction: dir });
      }
    }
    
    return nearby;
  }

  private findNearbyWalls(position: any, grid: any[][]): Array<{direction: string}> {
    const directions = ['up', 'down', 'left', 'right'];
    const nearby = [];
    
    for (const dir of directions) {
      const newPos = this.getPositionInDirection(position, dir);
      if (this.isValidPosition(newPos, grid) && grid[newPos.y][newPos.x].type === 'wall') {
        nearby.push({ direction: dir });
      }
    }
    
    return nearby;
  }

  private findUnactivatedSwitches(grid: any[][], switches: Record<string, boolean>): string[] {
    const unactivated = [];
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        if (cell.type === 'switch' && cell.id && !switches[cell.id]) {
          unactivated.push(cell.id);
        }
      }
    }
    
    return unactivated;
  }

  private hasBlockedPaths(gameState: GameState): boolean {
    const { grid, switches } = gameState;
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        if (cell.type === 'door' && cell.switchId && !switches[cell.switchId]) {
          return true;
        }
      }
    }
    
    return false;
  }

  private getPositionInDirection(position: any, direction: string) {
    switch (direction) {
      case 'up': return { x: position.x, y: position.y - 1 };
      case 'down': return { x: position.x, y: position.y + 1 };
      case 'left': return { x: position.x - 1, y: position.y };
      case 'right': return { x: position.x + 1, y: position.y };
      default: return position;
    }
  }

  private isValidPosition(position: any, grid: any[][]): boolean {
    return position.x >= 0 && position.x < grid[0].length && 
           position.y >= 0 && position.y < grid.length;
  }
}