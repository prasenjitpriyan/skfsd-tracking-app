import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FileText, Truck, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  className?: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions: FABAction[] = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Daily Entry',
      onClick: () => navigate('/offices'),
    },
    {
      icon: <Truck className="h-5 w-5" />,
      label: 'Delivery Data',
      onClick: () => navigate('/delivery'),
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: 'View Targets',
      onClick: () => navigate('/targets'),
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
  ];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col gap-3 items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                className="flex items-center gap-3 group"
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
              >
                <span className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium text-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
                <motion.div
                  className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.icon}
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button with Pulse */}
      <motion.button
        className={cn(
          "relative h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center",
          !isOpen && "animate-pulse-ring"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Pulse rings */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
          </>
        )}
        
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
