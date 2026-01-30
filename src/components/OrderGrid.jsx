import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';
import ItemCard from './ItemCard';
import UserBubble, { AddUserButton } from './UserBubble';
import Logo from './Logo';
import HotelBadge from './HotelBadge';
import ThemeToggle from './ThemeToggle';

const COLORS = ['#E53935', '#7CB342', '#1E88E5', '#FB8C00', '#5E35B1', '#00897B', '#C62828', '#F57C00'];

export default function OrderGrid() {
  const { order, assignItemToUser, addUser, setView } = useOrder();
  const { isDarkMode } = useTheme();
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTargetUser, setDropTargetUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
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
    setShowAddUserModal(true);
  };

  const handleConfirmAddUser = () => {
    if (newUserName.trim()) {
      // Generate initials from name
      const initials = newUserName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      // Pick a random color
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      // Add user to the order
      addUser(initials, randomColor, newUserName);
      
      // Reset and close modal
      setNewUserName('');
      setShowAddUserModal(false);
    }
  };

  const handleCloseModal = () => {
    setNewUserName('');
    setShowAddUserModal(false);
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
            <motion.button
              onClick={() => setView('users')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-lg
                font-poppins font-semibold text-sm
                transition-colors duration-200
                ${isDarkMode
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-black/10 text-black hover:bg-black/20'
                }
              `}
            >
              Users
            </motion.button>
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
        </div>
      </motion.div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                w-full max-w-sm mx-4 p-6 rounded-2xl
                ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}
              `}
            >
              <h2 className={`
                font-poppins font-semibold text-2xl mb-4
                ${isDarkMode ? 'text-white' : 'text-black'}
              `}>
                Add New User
              </h2>
              
              <input
                type="text"
                placeholder="Enter user name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleConfirmAddUser()}
                autoFocus
                className={`
                  w-full px-4 py-3 rounded-lg mb-4
                  font-poppins text-base
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${isDarkMode 
                    ? 'bg-white/10 text-white placeholder-white/50' 
                    : 'bg-black/10 text-black placeholder-black/50'
                  }
                `}
              />
              
              <div className="flex gap-3">
                <motion.button
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 py-3 rounded-lg font-poppins font-semibold
                    transition-colors duration-200
                    ${isDarkMode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-black/10 text-black hover:bg-black/20'
                    }
                  `}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={handleConfirmAddUser}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 py-3 rounded-lg font-poppins font-semibold
                    text-white bg-primary
                    transition-colors duration-200
                    hover:bg-primary/90
                  `}
                >
                  Add User
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
