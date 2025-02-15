
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getAIMove, checkWinner } from '@/utils/gameLogic';
import DifficultySelector from './DifficultySelector';

interface GameBoardProps {
  gameMode: 'ai' | 'friend';
  difficulty: 'easy' | 'medium' | 'hard';
}

const GameBoard = ({ gameMode, difficulty }: GameBoardProps) => {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);

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
      const aiMove = getAIMove(board, difficulty, 'O');
      setTimeout(() => handleMove(aiMove), 500);
    }
  }, [currentPlayer, gameMode, board, winner, difficulty]);

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
      {gameMode === 'ai' && (
        <DifficultySelector
          difficulty={difficulty}
          onSelect={(newDifficulty) => {
            resetGame();
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;
