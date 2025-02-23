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

// Improved perfect strategy implementation
const getPerfectMove = (board: GameBoard, aiPlayer: Player): number => {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  
  // Optimization: Take center on first move if available
  if (board.every(cell => cell === null)) {
    return 4;
  }

  // Optimization: If center is taken by opponent on first move, take corner
  if (board.filter(cell => cell !== null).length === 1 && board[4] === opponent) {
    return 0;
  }

  // Immediate win check
  const winMove = findWinningMove(board, aiPlayer);
  if (winMove !== -1) return winMove;

  // Block opponent's winning move
  const blockMove = findWinningMove(board, opponent);
  if (blockMove !== -1) return blockMove;

  // Initialize alpha-beta values for perfect play
  let bestScore = -Infinity;
  let bestMove = -1;
  const alpha = -Infinity;
  const beta = Infinity;

  // Try each available move
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = aiPlayer;
      const score = minimax(board, 0, false, aiPlayer, opponent, alpha, beta);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  // If no winning strategy is found, use positional strategy
  if (bestMove === -1) {
    // Prioritize strategic positions
    const strategicMoves = [
      4,  // Center
      0, 2, 6, 8,  // Corners
      1, 3, 5, 7   // Sides
    ];

    for (const move of strategicMoves) {
      if (board[move] === null) {
        return move;
      }
    }
  }

  return bestMove;
};

const findWinningMove = (board: GameBoard, player: Player): number => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    const cells = [board[a], board[b], board[c]];
    if (cells.filter(cell => cell === player).length === 2 &&
        cells.filter(cell => cell === null).length === 1) {
      const emptyIndex = cells.indexOf(null);
      return [a, b, c][emptyIndex];
    }
  }
  return -1;
};

// Enhanced minimax with alpha-beta pruning for perfect play
const minimax = (
  board: GameBoard,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  opponent: Player,
  alpha: number,
  beta: number
): number => {
  const result = checkWinner(board);
  
  // Terminal state evaluations
  if (result === aiPlayer) return 10 - depth;
  if (result === opponent) return depth - 10;
  if (result === 'draw') return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiPlayer;
        const eval = minimax(board, depth + 1, false, aiPlayer, opponent, alpha, beta);
        board[i] = null;
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (alpha >= beta) break; // Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = opponent;
        const eval = minimax(board, depth + 1, true, aiPlayer, opponent, alpha, beta);
        board[i] = null;
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break; // Alpha cutoff
      }
    }
    return minEval;
  }
};

// Keep this as a fallback strategy
const getBestMove = (board: GameBoard, player: Player): number => {
  let bestScore = -Infinity;
  let bestMove = 0;
  const opponent = player === 'X' ? 'O' : 'X';

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;
      const score = minimax(board, 0, false, player, opponent, -Infinity, Infinity);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};
