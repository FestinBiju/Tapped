import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function LoginScreen() {
  const { signInWithGoogle, signInAsGuest, loading } = useAuth();
  const { isDarkMode } = useTheme();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  const handleGuestSignIn = async () => {
    try {
      await signInAsGuest();
    } catch (error) {
      alert('Failed to sign in as guest. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={`
        min-h-screen w-full flex items-center justify-center
        ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}
      `}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        min-h-screen w-full flex flex-col items-center justify-center px-6
        ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'}
      `}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <Logo size="large" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className={`
          font-poppins font-semibold text-2xl sm:text-3xl mb-3
          ${isDarkMode ? 'text-white' : 'text-black'}
        `}>
          Split Bills Easily
        </h1>
        <p className={`
          font-poppins font-light text-base sm:text-lg
          ${isDarkMode ? 'text-white/60' : 'text-black/60'}
        `}>
          Sign in to start splitting bills with friends
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm space-y-4"
      >
        {/* Google Sign In Button */}
        <motion.button
          onClick={handleGoogleSignIn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full py-4 px-6 rounded-full
            flex items-center justify-center gap-3
            font-poppins font-semibold text-lg
            ${isDarkMode 
              ? 'bg-white text-black' 
              : 'bg-white text-black border-2 border-gray-200'
            }
            shadow-lg hover:shadow-xl transition-shadow
          `}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
          <span className={`font-poppins text-sm ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
            or
          </span>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
        </div>

        {/* Guest Sign In Button */}
        <motion.button
          onClick={handleGuestSignIn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full py-4 px-6 rounded-full
            font-poppins font-semibold text-lg
            bg-primary text-white
            shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
            transition-shadow
          `}
        >
          Continue as Guest
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`
          mt-8 font-poppins text-xs text-center
          ${isDarkMode ? 'text-white/40' : 'text-black/40'}
        `}
      >
        By continuing, you agree to our Terms of Service
      </motion.p>
    </motion.div>
  );
}
