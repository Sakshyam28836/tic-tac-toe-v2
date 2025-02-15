
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
      // In hard mode, always use the perfect strategy
      return getBestPerfectMove(board, aiPlayer);
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

const getBestPerfectMove = (board: GameBoard, aiPlayer: Player): number => {
  // First, check if we can win in one move
  const winningMove = findWinningMove(board, aiPlayer);
  if (winningMove !== -1) return winningMove;

  // Then, block opponent's winning move
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  const blockingMove = findWinningMove(board, opponent);
  if (blockingMove !== -1) return blockingMove;

  // Take center if available
  if (board[4] === null) return 4;

  // Take corners if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available side
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(i => board[i] === null);
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }

  // Fallback to minimax if no optimal move is found
  return getBestMove(board, aiPlayer);
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
