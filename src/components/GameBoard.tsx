
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameBoardProps {
  gameMode: 'ai' | 'friend';
  difficulty: 'easy' | 'medium' | 'hard';
}

const GameBoard = ({ gameMode, difficulty }: GameBoardProps) => {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);

  const checkWinner = (squares: Array<'X' | 'O' | null>): 'X' | 'O' | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return 'draw';
    }

    return null;
  };

  const getAIMove = (squares: Array<'X' | 'O' | null>): number => {
    const emptySquares = squares
      .map((square, index) => square === null ? index : -1)
      .filter(index => index !== -1);

    if (difficulty === 'easy') {
      return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    // For medium and hard difficulties, implement more sophisticated AI logic
    if (difficulty === 'hard') {
      // Check for winning move
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          if (checkWinner(squares) === 'O') {
            squares[i] = null;
            return i;
          }
          squares[i] = null;
        }
      }

      // Check for blocking opponent's winning move
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          if (checkWinner(squares) === 'X') {
            squares[i] = null;
            return i;
          }
          squares[i] = null;
        }
      }

      // Take center if available
      if (squares[4] === null) return 4;

      // Take corners if available
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(i => squares[i] === null);
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    }

    // For medium difficulty or if no strategic move is found
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const handleMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner) {
      const aiMove = getAIMove([...board]);
      setTimeout(() => handleMove(aiMove), 500);
    }
  }, [currentPlayer, gameMode, board, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] pt-20 px-4">
      <div className="max-w-lg mx-auto">
        <div className="glass p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {board.map((cell, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: cell ? 1 : 1.05 }}
                whileTap={{ scale: cell ? 1 : 0.95 }}
                className={`h-24 rounded-lg text-4xl font-bold ${
                  cell ? 'bg-white/40' : 'bg-white/20'
                } hover:bg-white/30 transition-colors`}
                onClick={() => handleMove(index)}
                disabled={!!cell || !!winner}
              >
                {cell}
              </motion.button>
            ))}
          </div>

          {winner && (
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
              </h2>
              <Button onClick={resetGame}>Play Again</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
