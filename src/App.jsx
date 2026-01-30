import { AnimatePresence, motion } from 'framer-motion';
import { useOrder } from './context/OrderContext';
import { useTheme } from './context/ThemeContext';
import { OrderGrid, CheckoutSummary, UsersList } from './components';

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

  return (
    <div className={`
      min-h-screen w-full
      ${isDarkMode ? 'dark bg-dark-bg' : 'bg-light-bg'}
      transition-colors duration-500
    `}>
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
            <OrderGrid />
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
