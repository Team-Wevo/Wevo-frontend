import { useNavigate } from "react-router-dom";

interface LogoProps {
  isLoggedIn?: boolean;
}

const Logo = ({ isLoggedIn = false }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(isLoggedIn ? "/home" : "/")}
      aria-label="홈으로 이동"
      className="flex h-14 w-full cursor-pointer items-center gap-2.5 px-5 text-left"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-sm">
        <img
          src="/Wevo-logo.svg"
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-lg font-bold tracking-tight text-gray-800">
        Wevo
      </span>
    </button>
  );
};

export default Logo;
