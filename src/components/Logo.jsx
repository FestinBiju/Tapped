import { useTheme } from '../context/ThemeContext';

// Bill icon SVG component
export function BillIcon({ className = "w-12 h-12" }) {
  const { isDarkMode } = useTheme();
  
  return (
    <svg 
      className={className} 
      viewBox="0 0 94 107" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M79.1 0H14.1C6.3 0 0 6.3 0 14.1V92.9C0 100.7 6.3 107 14.1 107H79.1C86.9 107 93.2 100.7 93.2 92.9V14.1C93.2 6.3 86.9 0 79.1 0Z" 
        fill={isDarkMode ? "#734ede" : "#734ede"}
      />
      <path 
        d="M70.5 26.4H22.7C20.5 26.4 18.7 28.2 18.7 30.4C18.7 32.6 20.5 34.4 22.7 34.4H70.5C72.7 34.4 74.5 32.6 74.5 30.4C74.5 28.2 72.7 26.4 70.5 26.4Z" 
        fill="white"
      />
      <path 
        d="M70.5 45.7H22.7C20.5 45.7 18.7 47.5 18.7 49.7C18.7 51.9 20.5 53.7 22.7 53.7H70.5C72.7 53.7 74.5 51.9 74.5 49.7C74.5 47.5 72.7 45.7 70.5 45.7Z" 
        fill="white"
      />
      <path 
        d="M47.1 65H22.7C20.5 65 18.7 66.8 18.7 69C18.7 71.2 20.5 73 22.7 73H47.1C49.3 73 51.1 71.2 51.1 69C51.1 66.8 49.3 65 47.1 65Z" 
        fill="white"
      />
    </svg>
  );
}

export default function Logo({ showText = true }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <BillIcon className="w-10 h-10 sm:w-12 sm:h-12" />
      {showText && (
        <span className="font-poppins font-semibold text-primary text-2xl sm:text-3xl md:text-4xl">
          Tapped
        </span>
      )}
    </div>
  );
}
