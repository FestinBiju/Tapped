import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ItemCard({ item, users = [], onDragStart, onDrag, onDragEnd, isDragging }) {
  const { isDarkMode } = useTheme();

  // Get assigned users with their colors
  const assignedUsers = item.assignedTo
    .map(userId => users.find(u => u.id === userId))
    .filter(Boolean);

  // Get the primary border color (first assigned user's color)
  const borderColor = assignedUsers.length > 0 ? assignedUsers[0].color : null;

  return (
    <motion.div
      layout
      layoutId={`item-${item.id}`}
      drag
      dragSnapToOrigin
      dragElastic={0.5}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 50,
        boxShadow: isDarkMode 
          ? '0 20px 40px rgba(0, 0, 0, 0.5)' 
          : '0 20px 40px rgba(0, 0, 0, 0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      style={{
        borderColor: borderColor || undefined,
        borderStyle: borderColor ? 'solid' : 'dashed',
      }}
      className={`
        relative cursor-grab active:cursor-grabbing
        w-full min-h-36 sm:min-h-40 md:min-h-44
        rounded-4xl border-5
        p-4 sm:p-5 flex flex-col justify-between
        transition-colors duration-300 overflow-hidden
        ${!borderColor && (isDarkMode 
          ? 'border-dark-border' 
          : 'border-light-border')
        }
        ${isDarkMode ? 'bg-dark-card' : 'bg-light-card'}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 25 }
      }}
    >
      {/* Item Name */}
      <div className="flex-1 overflow-hidden">
        <h3 
          className={`
            font-poppins font-semibold
            text-lg sm:text-xl md:text-2xl
            leading-tight break-words hyphens-auto
            ${isDarkMode ? 'text-white' : 'text-black'}
          `}
        >
          {item.name}
        </h3>
      </div>

      {/* Quantity and Price */}
      <div className="flex flex-col gap-0.5 mt-2 flex-shrink-0">
        <p className={`
          font-poppins font-normal
          text-xs sm:text-sm
          ${isDarkMode ? 'text-white/60' : 'text-black/60'}
        `}>
          Qty: {item.qty}
        </p>
        <p className={`
          font-poppins font-normal
          text-xs sm:text-sm
          ${isDarkMode ? 'text-white/60' : 'text-black/60'}
        `}>
          ₹{item.price.toFixed(2)}
        </p>
      </div>

      {/* Assigned users indicator dots */}
      {assignedUsers.length > 0 && (
        <div className="absolute top-3 right-3 flex gap-1.5">
          {assignedUsers.map((user, idx) => (
            <div 
              key={user.id}
              className="w-4 h-4 rounded-full shadow-md"
              style={{ 
                backgroundColor: user.color,
              }}
              title={user.name}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
