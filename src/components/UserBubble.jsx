import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';

export default function UserBubble({ 
  user, 
  isDropTarget = false,
  isDragging = false,
  onDrop,
  isActive = false,
}) {
  const { currentUserId, setCurrentUserId, setView } = useOrder();
  const isCurrentUser = user.id === currentUserId;

  const handleClick = () => {
    // Don't navigate if we're in the middle of a drag
    if (isDragging) return;
    setCurrentUserId(user.id);
    setView('checkout');
  };

  return (
    <motion.button
      layout
      layoutId={`user-${user.id}`}
      onClick={handleClick}
      whileHover={!isDragging ? { scale: 1.1 } : {}}
      whileTap={!isDragging ? { scale: 0.95 } : {}}
      animate={{
        scale: isDropTarget ? 1.3 : isDragging ? 1.1 : 1,
        boxShadow: isDropTarget 
          ? `0 0 30px ${user.color}` 
          : isDragging 
            ? `0 0 15px ${user.color}50`
            : 'none',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative flex-shrink-0
        w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
        rounded-full
        flex items-center justify-center
        focus:outline-none focus:ring-4 focus:ring-primary/50
        transition-all duration-200
        ${isCurrentUser ? 'ring-4 ring-white ring-offset-2' : ''}
        ${isDragging ? 'cursor-default' : 'cursor-pointer'}
      `}
      style={{ backgroundColor: user.color }}
    >
      <span className="font-poppins font-semibold text-white text-sm sm:text-base md:text-xl">
        {user.initials}
      </span>

      {/* Drop indicator */}
      {isDropTarget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          className="absolute inset-[-4px] rounded-full border-4 border-white"
        />
      )}
      
      {/* Pulsing indicator when dragging */}
      {isDragging && !isDropTarget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-[-2px] rounded-full border-2 border-white/50"
        />
      )}
    </motion.button>
  );
}

// Add User Button
export function AddUserButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex-shrink-0
        w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
        rounded-full
        bg-gray-200 dark:bg-gray-700
        border-2 border-gray-400 dark:border-gray-500
        flex items-center justify-center
        focus:outline-none focus:ring-4 focus:ring-primary/50
        transition-colors duration-200
        relative
      `}
    >
      {/* Vertical line */}
      <div className="w-1 h-6 bg-gray-600 dark:bg-gray-300 rounded-full absolute" />
      {/* Horizontal line */}
      <div className="w-6 h-1 bg-gray-600 dark:bg-gray-300 rounded-full absolute" />
    </motion.button>
  );
}
