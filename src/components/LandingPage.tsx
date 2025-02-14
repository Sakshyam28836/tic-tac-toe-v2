
import { motion } from "framer-motion";
import { GameController, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="glass rounded-2xl p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Tic-Tac-Tactical
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            Challenge your mind with the classic game reimagined
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-6 rounded-xl hover-scale"
            >
              <div className="text-primary mb-4">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            variant="secondary"
            className="hover-scale"
          >
            Play vs AI
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="hover-scale"
          >
            Play vs Friend
          </Button>
        </div>

        <footer className="mt-16 text-slate-500 text-sm">
          <p>Created by Sakshyam Paudel</p>
          <p>Supported by Rakesh Sir</p>
          <p>Janak Model Secondary School</p>
          <p className="mt-2">© 2025 Sakshyam Paudel. All rights reserved.</p>
        </footer>
      </motion.div>
    </div>
  );
};

const features = [
  {
    title: "Play Against AI",
    description: "Challenge our AI with three difficulty levels - from beginner-friendly to expert mode.",
    icon: GameController,
  },
  {
    title: "Play with Friends",
    description: "Challenge your friends in local multiplayer mode for classic head-to-head battles.",
    icon: Users,
  },
  {
    title: "Leaderboard",
    description: "Compete for the top spot by mastering our hardest AI difficulty.",
    icon: Trophy,
  },
];

export default LandingPage;
