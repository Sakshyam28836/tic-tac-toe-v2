
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Trophy, User, PieChart } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  onLeaderboardClick: () => void;
  onProfileClick?: () => void;
  onStatsClick?: () => void;
}

const Header = ({ onLeaderboardClick, onProfileClick, onStatsClick }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [coins, setCoins] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserCoins(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserCoins(session.user.id);
      }
    });
  }, []);

  const fetchUserCoins = async (userId: string) => {
    const { data } = await supabase
      .from('user_coins')
      .select('coins')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setCoins(data.coins);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Tic-Tac-TOE-V²</h1>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm text-primary font-medium">
              {coins.toFixed(1)} coins
            </div>
          )}
          {onStatsClick && (
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-primary hover:bg-white/20"
              onClick={onStatsClick}
            >
              <PieChart className="w-5 h-5 mr-2" />
              Stats
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-slate-700 hover:text-primary hover:bg-white/20"
            onClick={onLeaderboardClick}
          >
            <Trophy className="w-5 h-5 mr-2" />
            Leaderboard
          </Button>
          {onProfileClick && (
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-primary hover:bg-white/20"
              onClick={onProfileClick}
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </Button>
          )}
          {user ? (
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-rose-500 hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="bg-gradient-to-r from-primary/90 to-blue-500/90 text-white"
              onClick={() => window.location.href = '/auth'}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
