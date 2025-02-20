
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { checkWinner, getAIMove } from '@/utils/gameLogic';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type Player = 'X' | 'O' | null;
type Difficulty = 'easy' | 'medium' | 'hard';

interface GameProps {
  difficulty?: Difficulty;
  isVsAI?: boolean;
  onBackToMenu: () => void;
}

const COIN_REWARDS = {
  easy: {
    win: 3,
    draw: 2.5,
    play: 2
  },
  medium: {
    win: 4.5,
    draw: 4.5,
    play: 3.5
  },
  hard: {
    win: 6,
    draw: 5,
    play: 4
  }
};

const Game = ({ difficulty = 'medium', isVsAI = true, onBackToMenu }: GameProps) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const awardCoins = async (result: 'win' | 'loss' | 'draw') => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    let coinsToAward = COIN_REWARDS[difficulty].play;
    if (result === 'win') {
      coinsToAward = COIN_REWARDS[difficulty].win;
    } else if (result === 'draw') {
      coinsToAward = COIN_REWARDS[difficulty].draw;
    }

    const { data, error } = await supabase
      .from('user_coins')
      .select('coins')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user coins:', error);
      return;
    }

    const currentCoins = data?.coins || 0;
    const newCoins = currentCoins + coinsToAward;

    const { error: updateError } = await supabase
      .from('user_coins')
      .update({ coins: newCoins })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating coins:', updateError);
      return;
    }

    toast.success(`Earned ${coinsToAward} coins!`);
  };

  const recordGameResult = async (result: 'win' | 'loss' | 'draw') => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scores')
        .insert([
          {
            user_id: user.id,
            difficulty,
            result,
          }
        ]);
      
      if (error) throw error;
      
      // Award coins after recording the game result
      await awardCoins(result);
    } catch (error: any) {
      console.error('Error recording score:', error);
      toast.error('Failed to record score');
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || (!isXNext && isVsAI)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  useEffect(() => {
    const currentWinner = checkWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      if (currentWinner === 'draw') {
        toast("It's a draw!");
        recordGameResult('draw');
      } else {
        toast(`${currentWinner} wins!`);
        if (isVsAI) {
          recordGameResult(currentWinner === 'X' ? 'win' : 'loss');
        }
      }
    } else if (isVsAI && !isXNext && !winner) {
      // AI's turn
      setTimeout(() => {
        const aiMove = getAIMove(board, difficulty, 'O');
        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        setIsXNext(true);
      }, 500);
    }
  }, [board, isXNext, isVsAI, difficulty, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] p-4"
    >
      <div className="glass p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {isVsAI ? `Playing vs AI (${difficulty})` : 'Playing vs Friend'}
          </h2>
          <p className="text-slate-600">
            {winner
              ? winner === 'draw'
                ? "It's a draw!"
                : `Winner: ${winner}`
              : `Next player: ${isXNext ? 'X' : 'O'}`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((value, index) => (
            <motion.button
              key={index}
              whileHover={!value && !winner ? { scale: 1.05 } : {}}
              whileTap={!value && !winner ? { scale: 0.95 } : {}}
              className={`w-20 h-20 text-4xl font-bold rounded-lg ${
                value ? 'bg-white/50' : 'bg-white/30'
              } backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center transition-colors
                ${!value && !winner ? 'hover:bg-white/40' : ''}`}
              onClick={() => handleClick(index)}
              disabled={!!value || !!winner || (!isXNext && isVsAI)}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: value ? 1 : 0 }}
                className={value === 'X' ? 'text-blue-600' : 'text-rose-600'}
              >
                {value}
              </motion.span>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={resetGame}
            className="border-2 border-primary/20 hover:border-primary/40"
          >
            Reset Game
          </Button>
          <Button
            variant="secondary"
            onClick={onBackToMenu}
            className="bg-gradient-to-r from-primary/90 to-blue-500/90 text-white"
          >
            Back to Menu
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Game;
