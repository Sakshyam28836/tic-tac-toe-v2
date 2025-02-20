type Player = 'X' | 'O' | null;
type GameBoard = Player[];
type Difficulty = 'easy' | 'medium' | 'hard';

export const checkWinner = (board: GameBoard): Player | 'draw' | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
};

export const getAIMove = (board: GameBoard, difficulty: Difficulty, aiPlayer: Player): number => {
  switch (difficulty) {
    case 'easy':
      return getRandomMove(board);
    case 'medium':
      return Math.random() < 0.6 ? getBestMove(board, aiPlayer) : getRandomMove(board);
    case 'hard':
      // In hard mode, always use the perfect strategy with no randomness
      return getPerfectMove(board, aiPlayer);
    default:
      return getRandomMove(board);
  }
};

const getRandomMove = (board: GameBoard): number => {
  const availableMoves = board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Updated getPerfectMove function for more aggressive AI
const getPerfectMove = (board: GameBoard, aiPlayer: Player): number => {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  
  // First move optimization: Always take center if available
  if (board.filter(cell => cell !== null).length === 0) {
    return 4; // Take center on first move
  }
  
  // If center is taken by opponent on first move, take corner
  if (board.filter(cell => cell !== null).length === 1 && board[4] === opponent) {
    // Choose corner strategically based on future winning possibilities
    return 0;
  }

  // Check for immediate win
  const winMove = findWinningMove(board, aiPlayer);
  if (winMove !== -1) return winMove;

  // Create double threat (two possible ways to win)
  const doubleThreatMove = findDoubleThreatMove(board, aiPlayer);
  if (doubleThreatMove !== -1) return doubleThreatMove;

  // Block opponent's winning move
  const blockMove = findWinningMove(board, opponent);
  if (blockMove !== -1) return blockMove;

  // Create fork opportunity (multiple winning paths)
  const forkMove = findForkMove(board, aiPlayer);
  if (forkMove !== -1) return forkMove;

  // Block opponent's fork opportunity
  const blockForkMove = findForkMove(board, opponent);
  if (blockForkMove !== -1) return blockForkMove;

  // Strategic position taking
  const strategicMove = findStrategicMove(board, aiPlayer);
  if (strategicMove !== -1) return strategicMove;

  // Take center if available
  if (board[4] === null) return 4;

  // Take opposite corner of opponent's move
  const oppositeCornerMove = getOppositeCorner(board, opponent);
  if (oppositeCornerMove !== -1) return oppositeCornerMove;

  // Take any empty corner
  const cornerMove = getEmptyCorner(board);
  if (cornerMove !== -1) return cornerMove;

  // Take any empty side
  const sideMove = getEmptySide(board);
  if (sideMove !== -1) return sideMove;

  // Fallback to first available move
  return board.findIndex(cell => cell === null);
};

// New function to find moves that create double winning threats
const findDoubleThreatMove = (board: GameBoard, player: Player): number => {
  const emptyCells = board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);

  for (const index of emptyCells) {
    const boardCopy = [...board];
    boardCopy[index] = player;
    
    let winningPaths = 0;
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    // Count potential winning paths after this move
    for (const [a, b, c] of lines) {
      const cells = [boardCopy[a], boardCopy[b], boardCopy[c]];
      if (cells.filter(cell => cell === player).length === 2 &&
          cells.filter(cell => cell === null).length === 1) {
        winningPaths++;
      }
    }

    // If this move creates two or more winning paths, return it
    if (winningPaths >= 2) return index;
  }

  return -1;
};

// New function to find strategic moves that lead to winning positions
const findStrategicMove = (board: GameBoard, player: Player): number => {
  const strategicPatterns = [
    // Corner + Center pattern
    { cells: [0, 4], next: 8 },
    { cells: [2, 4], next: 6 },
    { cells: [6, 4], next: 2 },
    { cells: [8, 4], next: 0 },
    // Side + Center pattern
    { cells: [1, 4], next: 7 },
    { cells: [3, 4], next: 5 },
    { cells: [5, 4], next: 3 },
    { cells: [7, 4], next: 1 }
  ];

  for (const pattern of strategicPatterns) {
    if (pattern.cells.every(i => board[i] === player) && 
        board[pattern.next] === null) {
      return pattern.next;
    }
  }

  return -1;
};

const findForkMove = (board: GameBoard, player: Player): number => {
  const emptyCells = board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);

  for (const index of emptyCells) {
    const boardCopy = [...board];
    boardCopy[index] = player;
    
    let winningPaths = 0;
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      const cells = [boardCopy[a], boardCopy[b], boardCopy[c]];
      if (cells.filter(cell => cell === player).length === 1 &&
          cells.filter(cell => cell === null).length === 2) {
        winningPaths++;
      }
    }

    if (winningPaths >= 2) return index;
  }

  return -1;
};

const getOppositeCorner = (board: GameBoard, player: Player): number => {
  const oppositeCorners = [[0, 8], [2, 6]];
  for (const [corner1, corner2] of oppositeCorners) {
    if (board[corner1] === player && board[corner2] === null) return corner2;
    if (board[corner2] === player && board[corner1] === null) return corner1;
  }
  return -1;
};

const getEmptyCorner = (board: GameBoard): number => {
  const corners = [0, 2, 6, 8];
  for (const corner of corners) {
    if (board[corner] === null) return corner;
  }
  return -1;
};

const getEmptySide = (board: GameBoard): number => {
  const sides = [1, 3, 5, 7];
  for (const side of sides) {
    if (board[side] === null) return side;
  }
  return -1;
};

const findWinningMove = (board: GameBoard, player: Player): number => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    const cells = [board[a], board[b], board[c]];
    const nullIndex = cells.indexOf(null);
    if (nullIndex !== -1 && 
        cells.filter(cell => cell === player).length === 2 &&
        cells.filter(cell => cell === null).length === 1) {
      return [a, b, c][nullIndex];
    }
  }
  return -1;
};

// Keep this as a fallback strategy
const getBestMove = (board: GameBoard, player: Player): number => {
  let bestScore = -Infinity;
  let bestMove = 0;
  const opponent = player === 'X' ? 'O' : 'X';

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;
      const score = minimax(board, 0, false, player, opponent);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const minimax = (
  board: GameBoard,
  depth: number,
  isMaximizing: boolean,
  player: Player,
  opponent: Player
): number => {
  const result = checkWinner(board);
  if (result === player) return 10 - depth;
  if (result === opponent) return depth - 10;
  if (result === 'draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = player;
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false, player, opponent));
        board[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = opponent;
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true, player, opponent));
        board[i] = null;
      }
    }
    return bestScore;
  }
};
