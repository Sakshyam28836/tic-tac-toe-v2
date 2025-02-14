
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  wins: number;
  losses: number;
  draws: number;
}

const Leaderboard = ({ onBack }: { onBack: () => void }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data: scores, error } = await supabase
        .from('scores')
        .select(`
          user_id,
          result,
          profiles:profiles(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process scores into leaderboard entries
      const userStats = new Map<string, LeaderboardEntry>();
      
      scores?.forEach((score: any) => {
        const username = score.profiles.username;
        const current = userStats.get(username) || {
          username,
          wins: 0,
          losses: 0,
          draws: 0
        };

        if (score.result === 'win') current.wins++;
        else if (score.result === 'loss') current.losses++;
        else current.draws++;

        userStats.set(username, current);
      });

      const leaderboardData = Array.from(userStats.values())
        .sort((a, b) => b.wins - a.wins);

      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] p-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Leaderboard
            </h2>
            <Button
              variant="outline"
              onClick={onBack}
              className="border-2 border-primary/20 hover:border-primary/40"
            >
              Back to Menu
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-4 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center font-bold text-slate-600">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{entry.username}</h3>
                      <p className="text-sm text-slate-600">
                        Wins: {entry.wins} | Losses: {entry.losses} | Draws: {entry.draws}
                      </p>
                    </div>
                  </div>
                  {index < 3 && (
                    <Medal className={
                      index === 0 ? "text-yellow-500" :
                      index === 1 ? "text-gray-400" :
                      "text-amber-700"
                    } />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
