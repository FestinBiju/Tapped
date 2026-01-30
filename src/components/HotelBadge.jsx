import { useTheme } from '../context/ThemeContext';

export default function HotelBadge({ name }) {
  return (
    <div className="
      px-4 py-2
      rounded-4xl
      border-5 border-solid border-primary-light
      bg-white
    ">
      <span className="font-poppins font-light text-base sm:text-lg md:text-xl text-black">
        {name}
      </span>
    </div>
  );
}
