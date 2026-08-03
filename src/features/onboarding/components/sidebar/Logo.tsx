const Logo = () => {
  return (
    <div className="flex h-14 w-full items-center gap-2.5 px-5">
      <div className="flex h-7 w-7 items-center justify-center rounded-sm">
        <img
          src="/Wevo-logo.svg"
          alt="Logo"
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-lg font-bold tracking-tight text-gray-800">
        Wevo
      </span>
    </div>
  );
};

export default Logo;
