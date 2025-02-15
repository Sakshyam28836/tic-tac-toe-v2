
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Lock } from 'lucide-react';

const Profile = ({ onBack }: { onBack: () => void }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3] p-4 pt-20"
    >
      <div className="max-w-xl mx-auto">
        <div className="glass p-8 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-slate-800">Profile Settings</h2>
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              className="border-2 border-primary/20 hover:border-primary/40"
            >
              Back to Menu
            </Button>
          </div>

          <div className="mb-8 p-4 rounded-lg bg-white/20 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/50"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/50"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary/90 to-blue-500/90 text-white"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
