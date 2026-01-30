import { AnimatePresence, motion } from 'framer-motion';
import { useOrder } from './context/OrderContext';
import { useTheme } from './context/ThemeContext';
import { OrderGrid, CheckoutSummary, UsersList } from './components';
import Sidebar from './components/Sidebar';
import { useState } from 'react';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -50,
  },
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export default function App() {
  const { view } = useOrder();
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`
      min-h-screen w-full
      ${isDarkMode ? 'dark bg-dark-bg' : 'bg-light-bg'}
      transition-colors duration-500
    `}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AnimatePresence mode="wait">
        {view === 'order' ? (
          <motion.div
            key="order"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <OrderGrid onOpenSidebar={() => setSidebarOpen(true)} />
          </motion.div>
        ) : view === 'checkout' ? (
          <motion.div
            key="checkout"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <CheckoutSummary />
          </motion.div>
        ) : (
          <motion.div
            key="users"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <UsersList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
