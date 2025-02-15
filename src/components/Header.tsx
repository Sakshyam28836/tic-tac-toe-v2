import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { LogOut, Trophy, User } from 'lucide-react';

interface HeaderProps {
  onLeaderboardClick: () => void;
  onProfileClick?: () => void;
}

const Header = ({ onLeaderboardClick, onProfileClick }: HeaderProps) => {
  const [mounted, setMounted] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          {user && onProfileClick && (
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
