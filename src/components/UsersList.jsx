import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export default function UsersList() {
  const { order, deleteUser, setView } = useOrder();
  const { isDarkMode } = useTheme();
  const [userToDelete, setUserToDelete] = useState(null);

  const handleBack = () => {
    setView('order');
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setUserToDelete(null);
  };

  const userToDeleteData = order?.users?.find(u => u.id === userToDelete);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        min-h-screen w-full
        transition-colors duration-500
        ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}
      `}
    >
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2
                ${isDarkMode ? 'text-white' : 'text-black'}
              `}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </motion.button>
            <Logo />
          </div>
          <ThemeToggle />
        </header>

        {/* Title */}
        <h1 className={`
          font-poppins font-semibold
          text-3xl sm:text-4xl
          mb-8
          ${isDarkMode ? 'text-white' : 'text-black'}
        `}>
          Users
        </h1>

        {/* Users List */}
        <div className="space-y-3">
          <AnimatePresence>
            {order?.users?.length > 0 ? (
              order.users.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`
                    flex items-center justify-between p-4 rounded-lg
                    ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14
                        rounded-full
                        flex items-center justify-center
                        flex-shrink-0
                      `}
                      style={{ backgroundColor: user.color }}
                    >
                      <span className="font-poppins font-semibold text-white text-sm sm:text-base">
                        {user.initials}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`
                        font-poppins font-semibold
                        text-base sm:text-lg
                        ${isDarkMode ? 'text-white' : 'text-black'}
                      `}>
                        {user.name}
                      </p>
                      <p className={`
                        font-poppins text-sm
                        ${isDarkMode ? 'text-white/50' : 'text-black/50'}
                      `}>
                        {user.initials}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <motion.button
                    onClick={() => handleDeleteClick(user.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12
                      rounded-lg
                      flex items-center justify-center
                      transition-colors duration-200
                      ${isDarkMode 
                        ? 'hover:bg-white/10 text-red-400 hover:text-red-300' 
                        : 'hover:bg-black/10 text-red-500 hover:text-red-600'
                      }
                    `}
                    title="Delete user"
                  >
                    <svg 
                      className="w-5 h-5 sm:w-6 sm:h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className={`
                text-center py-12
                ${isDarkMode ? 'text-white/50' : 'text-black/50'}
              `}>
                <p className="font-poppins text-lg">No users yet</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && userToDeleteData && (
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
                font-poppins font-semibold text-2xl mb-2
                ${isDarkMode ? 'text-white' : 'text-black'}
              `}>
                Delete User?
              </h2>
              
              <p className={`
                font-poppins text-base mb-6
                ${isDarkMode ? 'text-white/70' : 'text-black/70'}
              `}>
                Are you sure you want to delete <span className="font-semibold">{userToDeleteData.name}</span>? This will also remove them from all assigned items.
              </p>
              
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
                  onClick={handleConfirmDelete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 py-3 rounded-lg font-poppins font-semibold
                    text-white bg-red-500
                    transition-colors duration-200
                    hover:bg-red-600
                  `}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
