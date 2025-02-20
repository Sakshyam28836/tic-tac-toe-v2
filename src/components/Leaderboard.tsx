
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Crown, Star, Award, Smile, GamepadIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardEntry {
  username: string;
  wins: number;
  losses: number;
  draws: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const Leaderboard = ({ onBack }: { onBack: () => void }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    fetchLeaderboard();
  }, [difficulty]);

  const fetchLeaderboard = async () => {
    try {
      const { data: scores, error } = await supabase
        .from('scores')
        .select('*, profiles!inner(username), user_coins!inner(rank)')
        .eq('difficulty', difficulty)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch leaderboard data');
        throw error;
      }

      const userStats = new Map<string, LeaderboardEntry & { rank: string }>();
      
      scores?.forEach((score: any) => {
        const username = score.profiles.username;
        const current = userStats.get(username) || {
          username,
          wins: 0,
          losses: 0,
          draws: 0,
          rank: score.user_coins.rank
        };

        if (score.result === 'win') current.wins++;
        else if (score.result === 'loss') current.losses++;
        else current.draws++;

        userStats.set(username, current);
      });

      const leaderboardData = Array.from(userStats.values())
        .sort((a, b) => {
          // Sort by rank first
          const rankOrder = { grandmaster: 3, master: 2, heroic: 1, none: 0 };
          if (rankOrder[a.rank as keyof typeof rankOrder] !== rankOrder[b.rank as keyof typeof rankOrder]) {
            return rankOrder[b.rank as keyof typeof rankOrder] - rankOrder[a.rank as keyof typeof rankOrder];
          }
          // Then by win rate
          const aWinRate = a.wins / (a.wins + a.losses) || 0;
          const bWinRate = b.wins / (b.wins + b.losses) || 0;
          if (bWinRate !== aWinRate) return bWinRate - aWinRate;
          // Finally by total wins
          return b.wins - a.wins;
        });

      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWinRate = (wins: number, total: number) => {
    if (total === 0) return 0;
    return (wins / total) * 100;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return <Star className="w-6 h-6 text-blue-400" />;
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] p-4 pt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <Trophy className="text-yellow-500 w-8 h-8" />
                Leaderboard
              </h2>
              <p className="text-slate-600 mt-2">Top players ranked by performance</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <GamepadIcon className={`w-4 h-4 ${getDifficultyColor(difficulty)}`} />
                      <span className="capitalize">{difficulty} Mode</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <div className="flex items-center gap-2">
                      <GamepadIcon className="w-4 h-4 text-green-500" />
                      <span>Easy Mode</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <GamepadIcon className="w-4 h-4 text-yellow-500" />
                      <span>Medium Mode</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex items-center gap-2">
                      <GamepadIcon className="w-4 h-4 text-red-500" />
                      <span>Hard Mode</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={onBack}
                className="border-2 border-primary/20 hover:border-primary/40"
              >
                Back to Menu
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => {
                const totalGames = entry.wins + entry.losses + entry.draws;
                const winRate = calculateWinRate(entry.wins, totalGames);
                
                return (
                  <motion.div
                    key={entry.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass p-6 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-100/30 to-amber-100/30' : ''}
                      ${index === 1 ? 'bg-gradient-to-r from-gray-100/30 to-slate-100/30' : ''}
                      ${index === 2 ? 'bg-gradient-to-r from-amber-100/30 to-orange-100/30' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm">
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            {entry.username}
                            {index < 3 && <Smile className="w-5 h-5 text-yellow-500" />}
                          </h3>
                          <div className="flex gap-4 mt-1 text-sm text-slate-600">
                            <span>Wins: {entry.wins}</span>
                            <span>Losses: {entry.losses}</span>
                            <span>Draws: {entry.draws}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {winRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-600">Win Rate</div>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white/30 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary/70"
                        style={{ width: `${winRate}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}

              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-slate-600">
                  No games played yet in {difficulty} mode. Be the first to join the leaderboard!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
