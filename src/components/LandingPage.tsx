
import { motion } from "framer-motion";
import { Gamepad2, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-8 mb-8 bg-gradient-to-r from-white/40 to-white/20"
        >
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
          >
            Tic-Tac-Tactical
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-slate-600 text-lg mb-6"
          >
            Challenge your mind with the classic game reimagined
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="glass p-6 rounded-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20"
            >
              <motion.div 
                className="text-primary mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon size={32} className="mx-auto" />
              </motion.div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg"
            variant="secondary"
            className="bg-gradient-to-r from-primary/90 to-blue-500/90 text-white hover:from-primary hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Play vs AI
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Play vs Friend
          </Button>
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-slate-500 text-sm"
        >
          <div className="glass p-6 rounded-lg inline-block bg-gradient-to-b from-white/30 to-white/10">
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Created by Sakshyam Paudel
            </motion.p>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              Supported by Rakesh Sir
            </motion.p>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Janak Model Secondary School
            </motion.p>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-2 font-medium"
            >
              © 2025 Sakshyam Paudel. All rights reserved.
            </motion.p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

const features = [
  {
    title: "Play Against AI",
    description: "Challenge our AI with three difficulty levels - from beginner-friendly to expert mode.",
    icon: Gamepad2,
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
