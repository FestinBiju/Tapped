import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ItemCard({ item, onDragStart, onDrag, onDragEnd, isDragging }) {
  const { isDarkMode } = useTheme();

  // Format item name to handle multi-line display
  const formatName = (name) => {
    const words = name.split(' ');
    if (words.length > 1) {
      return words;
    }
    return [name];
  };

  const nameWords = formatName(item.name);

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
      className={`
        relative cursor-grab active:cursor-grabbing
        w-full h-36 sm:h-40 md:h-44
        rounded-4xl border-5 border-dashed
        p-4 sm:p-5 flex flex-col justify-between
        transition-colors duration-300
        ${isDarkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-light-card border-light-border'
        }
        ${item.assignedTo.length > 0 ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 25 }
      }}
    >
      {/* Item Name */}
      <div className="flex flex-col">
        {nameWords.map((word, idx) => (
          <h3 
            key={idx}
            className={`
              font-poppins font-semibold
              text-lg sm:text-xl md:text-2xl lg:text-3xl
              leading-tight
              ${isDarkMode ? 'text-white' : 'text-black'}
            `}
          >
            {word}
          </h3>
        ))}
      </div>

      {/* Quantity and Price */}
      <div className="flex flex-col gap-0.5">
        <p className={`
          font-poppins font-normal
          text-xs sm:text-sm md:text-base
          ${isDarkMode ? 'text-white/60' : 'text-black/60'}
        `}>
          Qty: {item.qty}
        </p>
        <p className={`
          font-poppins font-normal
          text-xs sm:text-sm md:text-base
          ${isDarkMode ? 'text-white/60' : 'text-black/60'}
        `}>
          ₹{item.price.toFixed(2)}
        </p>
      </div>

      {/* Assigned users indicator */}
      {item.assignedTo.length > 0 && (
        <div className="absolute -top-2 -right-2 flex -space-x-2">
          {item.assignedTo.slice(0, 3).map((userId, idx) => (
            <div 
              key={userId}
              className="w-6 h-6 rounded-full bg-primary border-2 border-white dark:border-dark-bg flex items-center justify-center"
              style={{ zIndex: 3 - idx }}
            >
              <span className="text-[8px] text-white font-semibold">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
