
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
}

const Stats = () => {
  const [stats, setStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    draws: 0,
    total: 0,
    winRate: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: scores } = await supabase
        .from('scores')
        .select('result')
        .eq('user_id', user.id);

      if (scores) {
        const wins = scores.filter(score => score.result === 'win').length;
        const losses = scores.filter(score => score.result === 'loss').length;
        const draws = scores.filter(score => score.result === 'draw').length;
        const total = scores.length;
        const winRate = total > 0 ? (wins / total) * 100 : 0;

        setStats({
          wins,
          losses,
          draws,
          total,
          winRate,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const data = [
    { name: 'Wins', value: stats.wins },
    { name: 'Losses', value: stats.losses },
    { name: 'Draws', value: stats.draws },
  ];

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto p-6"
    >
      <Card className="bg-white/30 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Game Statistics</CardTitle>
          <CardDescription>Your performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-slate-600">Total Games</div>
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Win Rate</div>
              <div className="text-2xl font-bold text-primary">
                {stats.winRate.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Stats;
