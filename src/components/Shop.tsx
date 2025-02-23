
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Crown, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ShopProps {
  onBack: () => void;
}

interface Rank {
  id: string;
  name: string;
  price: number;
  icon: JSX.Element;
  description: string;
}

const ranks: Rank[] = [
  {
    id: 'veda',
    name: 'Veda',
    price: 100,
    icon: <Crown className="w-6 h-6 text-purple-500" />,
    description: 'Show your dedication with the mystical Veda rank!'
  },
  {
    id: 'sheeps-king',
    name: 'Sheeps King',
    price: 1000,
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    description: 'Rule the game as the mighty Sheeps King!'
  }
];

const Shop = ({ onBack }: ShopProps) => {
  const [userCoins, setUserCoins] = useState(0);
  const [currentRank, setCurrentRank] = useState('Novice');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user's coins
      const { data: coinsData } = await supabase
        .from('user_coins')
        .select('coins')
        .eq('user_id', user.id)
        .single();

      // Fetch user's current rank
      const { data: rankData } = await supabase
        .from('user_ranks')
        .select('rank_name')
        .eq('user_id', user.id)
        .single();

      if (coinsData) setUserCoins(coinsData.coins);
      if (rankData) setCurrentRank(rankData.rank_name);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const purchaseRank = async (rank: Rank) => {
    try {
      setPurchasing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to purchase ranks');
        return;
      }

      if (userCoins < rank.price) {
        toast.error('Not enough coins!');
        return;
      }

      // Update user's coins and rank
      const { error: updateError } = await supabase
        .from('user_coins')
        .update({ coins: userCoins - rank.price })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const { error: rankError } = await supabase
        .from('user_ranks')
        .update({ rank_name: rank.name })
        .eq('user_id', user.id);

      if (rankError) throw rankError;

      setUserCoins(prev => prev - rank.price);
      setCurrentRank(rank.name);
      toast.success(`Successfully purchased ${rank.name} rank!`);
    } catch (error) {
      console.error('Error purchasing rank:', error);
      toast.error('Failed to purchase rank');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] p-4 pt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-primary" />
                Shop
              </h2>
              <p className="text-slate-600 mt-2">Purchase exclusive ranks with your coins!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Your Balance</p>
                <p className="text-2xl font-bold text-primary">{userCoins} coins</p>
              </div>
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2 border-2 border-primary/20 hover:border-primary/40"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ranks.map((rank) => (
              <motion.div
                key={rank.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass p-6 rounded-xl backdrop-blur-sm border-2 transition-colors
                  ${currentRank === rank.name
                    ? 'bg-primary/10 border-primary'
                    : 'bg-white/20 border-white/30 hover:border-primary/30'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {rank.icon}
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{rank.name}</h3>
                      <p className="text-sm text-slate-600">{rank.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Price</p>
                    <p className="text-xl font-bold text-primary">{rank.price} coins</p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant={currentRank === rank.name ? "secondary" : "default"}
                  disabled={currentRank === rank.name || purchasing || userCoins < rank.price}
                  onClick={() => purchaseRank(rank)}
                >
                  {currentRank === rank.name
                    ? 'Current Rank'
                    : userCoins < rank.price
                    ? 'Not Enough Coins'
                    : 'Purchase Rank'
                  }
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
