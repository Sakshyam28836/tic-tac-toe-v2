
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
      return getBestMove(board, aiPlayer);
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
