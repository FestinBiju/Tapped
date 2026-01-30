import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';
import ItemCard from './ItemCard';
import UserBubble, { AddUserButton } from './UserBubble';
import Logo from './Logo';
import HotelBadge from './HotelBadge';
import ThemeToggle from './ThemeToggle';

export default function OrderGrid() {
  const { order, assignItemToUser, setView } = useOrder();
  const { isDarkMode } = useTheme();
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTargetUser, setDropTargetUser] = useState(null);
  const userBubblesRef = useRef({});

  // Track pointer position during drag using global pointer events
  const checkDropTarget = useCallback((clientX, clientY) => {
    let foundTarget = null;
    
    Object.entries(userBubblesRef.current).forEach(([userId, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        // Add some padding for easier targeting
        const padding = 30;
        if (
          clientX >= rect.left - padding &&
          clientX <= rect.right + padding &&
          clientY >= rect.top - padding &&
          clientY <= rect.bottom + padding
        ) {
          foundTarget = userId;
        }
      }
    });
    
    setDropTargetUser(foundTarget);
    return foundTarget;
  }, []);

  // Global pointer move tracking when dragging
  useEffect(() => {
    if (!draggedItem) return;

    const handlePointerMove = (e) => {
      checkDropTarget(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [draggedItem, checkDropTarget]);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrag = (event, info) => {
    // Also check on drag events for redundancy
    if (info.point) {
      checkDropTarget(info.point.x, info.point.y);
    }
  };

  const handleDragEnd = (item, event, info) => {
    // Final check at drop position
    const finalTarget = info?.point 
      ? checkDropTarget(info.point.x, info.point.y)
      : dropTargetUser;
    
    if (draggedItem && finalTarget) {
      assignItemToUser(item.id, finalTarget);
    }
    setDraggedItem(null);
    setDropTargetUser(null);
  };

  const handleAddUser = () => {
    // TODO: Open modal to add new user
    console.log('Add user clicked');
  };

  const handleProceed = () => {
    setView('checkout');
  };

  return (
    <div className={`
      min-h-screen w-full
      transition-colors duration-500
      ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}
    `}>
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <HotelBadge name={order.hotelName} />
          </div>
        </header>

        {/* Order Title */}
        <h1 className={`
          font-poppins font-semibold
          text-3xl sm:text-4xl md:text-5xl
          mb-6
          ${isDarkMode ? 'text-white' : 'text-black'}
        `}>
          Order #{order.id}
        </h1>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <AnimatePresence>
            {order.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDragStart={() => handleDragStart(item)}
                onDrag={handleDrag}
                onDragEnd={(event, info) => handleDragEnd(item, event, info)}
                isDragging={draggedItem?.id === item.id}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* User Bar - Fixed at bottom */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`
          fixed bottom-0 left-0 right-0
          px-4 sm:px-6 py-4 sm:py-6
          ${isDarkMode ? 'bg-dark-bg/95' : 'bg-light-bg/95'}
          backdrop-blur-md
          border-t
          ${isDarkMode ? 'border-white/10' : 'border-black/10'}
        `}
      >
        {/* Drag instruction hint */}
        {draggedItem && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              text-center text-sm mb-2 font-poppins
              ${isDarkMode ? 'text-white/70' : 'text-black/70'}
            `}
          >
            Drop on a user to assign "{draggedItem.name}"
          </motion.p>
        )}
        <div className="max-w-lg mx-auto flex items-center gap-3 sm:gap-4 overflow-x-auto">
          {/* User Bubbles */}
          {order.users.map((user) => (
            <div
              key={user.id}
              ref={(el) => (userBubblesRef.current[user.id] = el)}
            >
              <UserBubble
                user={user}
                isDropTarget={dropTargetUser === user.id}
                isDragging={!!draggedItem}
              />
            </div>
          ))}

          {/* Add User Button */}
          <AddUserButton onClick={handleAddUser} />

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Proceed Arrow */}
          <motion.button
            onClick={handleProceed}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex-shrink-0
              w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
              flex items-center justify-center
              ${isDarkMode ? 'text-white' : 'text-black'}
            `}
          >
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
