
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, Award } from 'lucide-react';
import { toast } from 'sonner';

interface ShopProps {
  onBack: () => void;
}

const RANKS = [
  {
    id: 'heroic',
    name: 'Heroic',
    cost: 1000,
    icon: <Award className="w-6 h-6 text-purple-500" />,
    color: 'from-purple-500/20 to-purple-600/20'
  },
  {
    id: 'master',
    name: 'Master',
    cost: 5000,
    icon: <Trophy className="w-6 h-6 text-blue-500" />,
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    id: 'grandmaster',
    name: 'Grand Master',
    cost: 10000,
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    color: 'from-yellow-500/20 to-yellow-600/20'
  }
];

const Shop = ({ onBack }: ShopProps) => {
  const [coins, setCoins] = useState(0);
  const [currentRank, setCurrentRank] = useState('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_coins')
      .select('coins, rank')
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast.error('Failed to fetch user data');
      return;
    }

    if (data) {
      setCoins(data.coins);
      setCurrentRank(data.rank);
    }
    setLoading(false);
  };

  const purchaseRank = async (rankId: string, cost: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to purchase ranks');
      return;
    }

    if (coins < cost) {
      toast.error('Not enough coins!');
      return;
    }

    const { error } = await supabase
      .from('user_coins')
      .update({
        coins: coins - cost,
        rank: rankId
      })
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to purchase rank');
      return;
    }

    setCoins(coins - cost);
    setCurrentRank(rankId);
    toast.success(`Successfully purchased ${rankId} rank!`);
    fetchUserData();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] p-4 pt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <Trophy className="text-yellow-500 w-8 h-8" />
                Shop
              </h2>
              <p className="text-slate-600 mt-2">Purchase exclusive ranks with your coins!</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{coins.toFixed(1)} coins</div>
              <div className="text-sm text-slate-600">Current Rank: {currentRank}</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Loading shop data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RANKS.map((rank) => (
                <motion.div
                  key={rank.id}
                  className={`glass p-6 rounded-xl bg-gradient-to-r ${rank.color} backdrop-blur-sm 
                    border border-white/30 shadow-lg relative overflow-hidden`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm">
                      {rank.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{rank.name}</h3>
                      <p className="text-slate-600">{rank.cost} coins</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => purchaseRank(rank.id, rank.cost)}
                    disabled={currentRank === rank.id || coins < rank.cost}
                    className="w-full bg-white/50 hover:bg-white/70"
                  >
                    {currentRank === rank.id ? 'Owned' : 'Purchase'}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-2 border-primary/20 hover:border-primary/40"
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
