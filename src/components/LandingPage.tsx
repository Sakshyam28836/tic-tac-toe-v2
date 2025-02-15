import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import AuthPage from './AuthPage';
import GameBoard from './GameBoard';
import DifficultySelector from './DifficultySelector';
import Leaderboard from './Leaderboard';
import Header from './Header';
import Profile from "./Profile";

const LandingPage = () => {
  const [gameMode, setGameMode] = useState<'menu' | 'ai' | 'friend' | 'leaderboard' | 'profile'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [user, setUser] = useUser();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching username:", error);
          } else if (data) {
            setUsername(data.username);
          }
        } catch (error) {
          console.error("Unexpected error fetching username:", error);
        }
      } else {
        setUsername(null);
      }
    };

    fetchUsername();
  }, [user]);

  if (gameMode === 'profile') {
    return (
      <>
        <Header onLeaderboardClick={() => setGameMode('leaderboard')} />
        <Profile onBack={() => setGameMode('menu')} />
      </>
    );
  }

  if (gameMode === 'ai') {
    return (
      <>
        <Header onLeaderboardClick={() => setGameMode('leaderboard')} />
        <GameBoard gameMode="ai" difficulty={difficulty} />
      </>
    );
  }

  if (gameMode === 'friend') {
    return (
      <>
        <Header onLeaderboardClick={() => setGameMode('leaderboard')} />
        <GameBoard gameMode="friend" difficulty={difficulty} />
      </>
    );
  }

  if (gameMode === 'leaderboard') {
    return (
      <>
        <Header onLeaderboardClick={() => setGameMode('leaderboard')} />
        <Leaderboard onBack={() => setGameMode('menu')} />
      </>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3]">
      <Header onLeaderboardClick={() => setGameMode('leaderboard')} onProfileClick={() => setGameMode('profile')} />
      <div className="py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Avatar className="mx-auto mb-4 w-24 h-24">
            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`} />
            <AvatarFallback>{username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome, {username || 'User'}!
          </h1>
          <p className="text-slate-600">Ready for a game?</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary/90 to-blue-500/90 text-white"
            onClick={() => setGameMode('ai')}
          >
            Play vs AI
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm"
            onClick={() => setGameMode('friend')}
          >
            Play vs Friend
          </Button>

          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm"
            onClick={() => setGameMode('profile')}
          >
            Profile Settings
          </Button>
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500">
            Created by <a href="https://github.com/luisOrozco9" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Luis Orozco</a>
          </p>
          <ModeToggle />
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;
