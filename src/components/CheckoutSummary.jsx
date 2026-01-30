import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import HotelBadge from './HotelBadge';

export default function CheckoutSummary() {
  const { order, currentUser, calculateUserShare, setView, assignItemToUser } = useOrder();
  const { isDarkMode } = useTheme();

  // Calculate the current user's share
  const userShare = currentUser ? calculateUserShare(currentUser.id) : null;

  const handleBack = () => {
    setView('order');
  };

  const handlePay = () => {
    // TODO: Integrate payment gateway
    alert('Payment initiated!');
  };

  if (!currentUser || !userShare) {
    return (
      <div className={`
        min-h-screen w-full flex items-center justify-center
        ${isDarkMode ? 'bg-dark-bg text-white' : 'bg-light-bg text-black'}
      `}>
        <p className="font-poppins text-lg">Select a user to view their share</p>
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            <HotelBadge name={order.hotelName} />
          </div>
        </header>

        {/* Your Share Header */}
        <div className="text-center mb-8">
          <h1 className={`
            font-poppins
            text-3xl sm:text-4xl
            ${isDarkMode ? 'text-white' : 'text-black'}
          `}>
            <span className="font-semibold">Your Share:</span>
            {' '}
            <span className="font-normal">₹{userShare.total.toFixed(2)}</span>
          </h1>
          <p className={`
            font-poppins font-light
            text-base sm:text-lg mt-2
            ${isDarkMode ? 'text-white' : 'text-black'}
          `}>
            {currentUser.name}, this is your total
          </p>
        </div>

        {/* Items List */}
        <div className="space-y-0">
          {userShare.items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`
                flex justify-between items-center
                py-4
                ${isDarkMode ? 'text-white' : 'text-black'}
              `}>
                <span className="font-poppins font-light text-base sm:text-lg">
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-poppins font-light text-base sm:text-lg">
                    ₹{item.sharedPrice.toFixed(2)}
                  </span>
                  <motion.button
                    onClick={() => assignItemToUser(item.id, currentUser.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      p-2 rounded-lg
                      transition-colors duration-200
                      ${isDarkMode 
                        ? 'hover:bg-white/10 text-red-400 hover:text-red-300' 
                        : 'hover:bg-black/10 text-red-500 hover:text-red-600'
                      }
                    `}
                    title="Delete item"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
              <div className={`
                h-[1px] w-full
                ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}
              `} />
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className={`
          mt-8 space-y-2
          ${isDarkMode ? 'text-white' : 'text-black'}
        `}>
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="font-poppins font-semibold text-base sm:text-lg">
              Subtotal:
            </span>
            <span className="font-poppins font-light text-base sm:text-lg">
              ₹{userShare.subtotal.toFixed(2)}
            </span>
          </div>

          {/* Service Charge */}
          <div className="flex justify-between items-center">
            <span className="font-poppins font-semibold text-base sm:text-lg">
              Service charge:
            </span>
            <span className="font-poppins font-light text-base sm:text-lg">
              ₹{userShare.serviceCharge.toFixed(2)}
            </span>
          </div>

          {/* GST */}
          <div className="flex justify-between items-center">
            <span className="font-poppins font-semibold text-base sm:text-lg">
              GST:
            </span>
            <span className="font-poppins font-light text-base sm:text-lg">
              ₹{userShare.gst.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Pay Button - Fixed at bottom */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`
          fixed bottom-0 left-0 right-0
          px-4 sm:px-6 py-6 sm:py-8
          ${isDarkMode ? 'bg-dark-bg/95' : 'bg-light-bg/95'}
          backdrop-blur-md
        `}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={handlePay}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              w-full py-5 sm:py-6
              bg-primary
              rounded-full
              font-poppins font-semibold
              text-xl sm:text-2xl md:text-3xl
              text-white
              shadow-lg shadow-primary/30
              focus:outline-none focus:ring-4 focus:ring-primary/50
              transition-shadow duration-300
              hover:shadow-xl hover:shadow-primary/40
            "
          >
            Pay with GPay
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
