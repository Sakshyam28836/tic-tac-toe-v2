import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Gamepad2, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import Game from "./Game";
import Header from "./Header";
import Leaderboard from "./Leaderboard";
import AuthPage from "./AuthPage";

const LandingPage = () => {
  const [gameMode, setGameMode] = useState<'menu' | 'ai' | 'friend' | 'leaderboard'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (gameMode === 'ai') {
    return (
      <>
        <Header onLeaderboardClick={() => setGameMode('leaderboard')} />
        <Game difficulty={difficulty} isVsAI={true} onBackToMenu={() => setGameMode('menu')} />
      </>
    );
  }

  if (gameMode === 'friend') {
    return (
      <>
        <Header onLeaderboardClick={() => setGameMode('leaderboard')} />
        <Game isVsAI={false} onBackToMenu={() => setGameMode('menu')} />
      </>
    );
  }

  if (gameMode === 'leaderboard') {
    return (
      <>
        <Header onLeaderboardClick={() => {}} />
        <Leaderboard onBack={() => setGameMode('menu')} />
      </>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3]">
      <Header onLeaderboardClick={() => setGameMode('leaderboard')} />
      <div className="py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl font-extrabold text-slate-800 mb-4">
            Tic-Tac-Toe-V2
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            A strategic twist on the classic Tic-Tac-Toe, now with online leaderboards!
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <div className="flex flex-col gap-4">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-gradient-to-r from-primary/90 to-blue-500/90 text-white hover:from-primary hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => setGameMode('ai')}
              >
                Play vs AI
              </Button>
              <div className="flex gap-2 justify-center">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <Button
                    key={diff}
                    variant={difficulty === diff ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setDifficulty(diff)}
                    className={`capitalize ${
                      difficulty === diff 
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setGameMode('friend')}
            >
              Play vs Friend
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass p-6 rounded-lg bg-white/20 backdrop-blur-sm shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.4 + index * 0.1 }}
                >
                  <div className="text-2xl text-primary mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Play vs AI",
    description: "Challenge our advanced AI with adjustable difficulty levels.",
    icon: <Gamepad2 size={32} />,
  },
  {
    title: "Multiplayer Mode",
    description: "Play against your friends in a classic hot-seat mode.",
    icon: <Users size={32} />,
  },
  {
    title: "Leaderboard",
    description: "Compete with other players and climb to the top of the leaderboard.",
    icon: <Trophy size={32} />,
  },
];

export default LandingPage;
