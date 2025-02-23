
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { UserProfile } from '@/types/auth';

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          id: user.id,
          email: user.email,
          username: user.user_metadata.username,
        });

        // Fetch user coins
        const { data: coinsData } = await supabase
          .from('user_coins')
          .select('coins')
          .eq('user_id', user.id)
          .single();

        if (coinsData) {
          setCoins(coinsData.coins);
        }
      }
    } catch (error: any) {
      toast.error('Error loading profile');
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-4">
        <p className="text-slate-600">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6"
    >
      <div className="glass p-6 rounded-xl bg-white/30 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <Input
              value={profile.username || ''}
              readOnly
              className="bg-white/50"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <Input
              value={profile.email || ''}
              readOnly
              className="bg-white/50"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Coins Balance</label>
            <div className="text-2xl font-bold text-primary">{coins.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
