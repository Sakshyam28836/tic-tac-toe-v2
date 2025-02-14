
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  onLeaderboardClick: () => void;
}

const Header = ({ onLeaderboardClick }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

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
        <h1 className="text-xl font-bold text-slate-800">Tic-Tac-Tactical</h1>
        <div className="flex items-center gap-4">
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
