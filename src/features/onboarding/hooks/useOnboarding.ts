import { useState } from "react";

const useOnboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
};

export default useOnboarding;
