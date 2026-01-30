import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';
import UserBubble, { AddUserButton } from './UserBubble';
import ThemeToggle from './ThemeToggle';

const COLORS = ['#E53935', '#7CB342', '#1E88E5', '#FB8C00', '#5E35B1', '#00897B', '#C62828', '#F57C00'];

export default function Sidebar({ isOpen, onClose }) {
  const { order, addUser, setCurrentUserId, currentUserId } = useOrder();
  const { isDarkMode } = useTheme();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = () => setShowAddUserModal(true);
  const handleCloseModal = () => {
    setNewUserName('');
    setShowAddUserModal(false);
  };
  const handleConfirmAddUser = () => {
    if (newUserName.trim()) {
      const initials = newUserName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      addUser(initials, randomColor, newUserName);
      setNewUserName('');
      setShowAddUserModal(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 h-full w-80 max-w-full z-50 shadow-2xl ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`font-poppins font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>Menu</h2>
              <button onClick={onClose} className="text-2xl font-bold">×</button>
            </div>
            <div className="mb-8">
              <ThemeToggle />
            </div>
            <div className="mb-4">
              <h3 className={`font-poppins font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Users</h3>
              <div className="flex flex-wrap gap-3">
                {order.users.map(user => (
                  <UserBubble
                    key={user.id}
                    user={user}
                    isActive={user.id === currentUserId}
                    onClick={() => setCurrentUserId(user.id)}
                  />
                ))}
                <AddUserButton onClick={handleAddUser} />
              </div>
            </div>
            {/* Add more sidebar content here if needed */}
          </div>

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
                  onClick={e => e.stopPropagation()}
                  className={`w-full max-w-sm mx-4 p-6 rounded-2xl ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}`}
                >
                  <h2 className={`font-poppins font-semibold text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Add New User</h2>
                  <input
                    type="text"
                    placeholder="Enter user name"
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleConfirmAddUser()}
                    autoFocus
                    className={`w-full px-4 py-3 rounded-lg mb-4 font-poppins text-base focus:outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-white/10 text-white placeholder-white/50' : 'bg-black/10 text-black placeholder-black/50'}`}
                  />
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleCloseModal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-3 rounded-lg font-poppins font-semibold transition-colors duration-200 ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'}`}
                    >Cancel</motion.button>
                    <motion.button
                      onClick={handleConfirmAddUser}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded-lg font-poppins font-semibold text-white bg-primary transition-colors duration-200 hover:bg-primary/90"
                    >Add User</motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
