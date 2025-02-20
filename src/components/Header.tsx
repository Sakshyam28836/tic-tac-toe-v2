
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Trophy, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  onLeaderboardClick: () => void;
  onShopClick?: () => void;
}

const Header = ({ onLeaderboardClick, onShopClick }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [coins, setCoins] = useState(0);
  const [rank, setRank] = useState('none');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });
  }, []);

  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_coins')
      .select('coins, rank')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      setCoins(data.coins);
      setRank(data.rank);
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
        
        {user && (
          <div className="flex items-center gap-6 mr-8">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-primary">
                {coins.toFixed(1)} coins
              </span>
              <span className="px-2 py-1 rounded-full bg-white/20 text-xs font-medium">
                {rank.charAt(0).toUpperCase() + rank.slice(1)}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {onShopClick && (
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-primary hover:bg-white/20"
              onClick={onShopClick}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop
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
