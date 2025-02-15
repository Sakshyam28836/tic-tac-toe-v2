
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface DifficultySelectorProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const DifficultySelector = ({ difficulty, onSelect }: DifficultySelectorProps) => {
  return (
    <div className="fixed top-20 right-4 p-4 bg-white/30 backdrop-blur-lg rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Difficulty</span>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant={difficulty === 'easy' ? 'default' : 'ghost'}
          onClick={() => onSelect('easy')}
          className={difficulty === 'easy' ? 'bg-primary text-white' : 'text-slate-600'}
        >
          Easy
        </Button>
        <Button
          size="sm"
          variant={difficulty === 'medium' ? 'default' : 'ghost'}
          onClick={() => onSelect('medium')}
          className={difficulty === 'medium' ? 'bg-primary text-white' : 'text-slate-600'}
        >
          Medium
        </Button>
        <Button
          size="sm"
          variant={difficulty === 'hard' ? 'default' : 'ghost'}
          onClick={() => onSelect('hard')}
          className={difficulty === 'hard' ? 'bg-primary text-white' : 'text-slate-600'}
        >
          Hard
        </Button>
      </div>
    </div>
  );
};

export default DifficultySelector;
