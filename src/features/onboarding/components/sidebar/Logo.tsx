const Logo = () => {
  return (
    <div className="flex h-14 w-full items-center gap-2.5 border-b border-gray-200 px-5">
      <div className="flex h-6 w-6 items-center justify-center rounded-sm">
        <img
          src="../../../../../public/Wevo-logo.svg"
          alt="Logo"
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-m font-bold tracking-tight text-gray-800">
        WEVO
      </span>
    </div>
  );
};

export default Logo;
