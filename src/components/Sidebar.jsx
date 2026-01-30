import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AddUserButton } from './UserBubble';
import ThemeToggle from './ThemeToggle';

const COLORS = ['#E53935', '#7CB342', '#1E88E5', '#FB8C00', '#5E35B1', '#00897B', '#C62828', '#F57C00'];

export default function Sidebar({ isOpen, onClose }) {
  const { order, addUser, deleteUser } = useOrder();
  const { isDarkMode } = useTheme();
  const { user, signOut, getUserInfo } = useAuth();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const userInfo = getUserInfo();

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
      onClose();
    }
  };

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

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      deleteUser(userId);
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
              <button onClick={onClose} className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>×</button>
            </div>

            {/* User Profile Section */}
            {userInfo && (
              <div className={`
                flex items-center gap-3 mb-6 p-3 rounded-xl
                ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}
              `}>
                {userInfo.photoURL ? (
                  <img 
                    src={userInfo.photoURL} 
                    alt={userInfo.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-poppins font-semibold text-sm">
                    {userInfo.initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-poppins font-medium truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {userInfo.name}
                  </p>
                  {userInfo.email && (
                    <p className={`font-poppins text-xs truncate ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                      {userInfo.email}
                    </p>
                  )}
                  {userInfo.isAnonymous && (
                    <p className={`font-poppins text-xs ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                      Guest User
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mb-8">
              <ThemeToggle />
            </div>
            <div className="flex-1">
              <h3 className={`font-poppins font-semibold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Users</h3>
              
              {/* User List as Rows */}
              <div className="space-y-2 mb-4">
                {order?.users?.map(user => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`
                      flex items-center justify-between
                      p-3 rounded-xl
                      ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}
                    `}
                  >
                    {/* User Avatar and Name */}
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-poppins font-semibold text-sm"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.initials}
                      </div>
                      <span className={`font-poppins font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {user.name}
                      </span>
                    </div>
                    
                    {/* Delete Button */}
                    <motion.button
                      onClick={() => handleDeleteUser(user.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`
                        p-2 rounded-lg
                        ${isDarkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-500/10 text-red-500'}
                        transition-colors duration-200
                      `}
                      title="Remove user"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Add User Button */}
              <motion.button
                onClick={handleAddUser}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center justify-center gap-2
                  p-3 rounded-xl
                  border-2 border-dashed
                  ${isDarkMode ? 'border-white/30 text-white/70 hover:bg-white/5' : 'border-black/30 text-black/70 hover:bg-black/5'}
                  transition-colors duration-200
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-poppins font-medium">Add User</span>
              </motion.button>
            </div>

            {/* Sign Out Button */}
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center justify-center gap-2
                p-3 rounded-xl mt-auto
                ${isDarkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}
                transition-colors duration-200
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-poppins font-medium">Sign Out</span>
            </motion.button>
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
