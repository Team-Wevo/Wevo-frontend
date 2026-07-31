import MainContent from "../../features/onboarding/components/MainContent";

interface OnBoardingPageProps {
  isLoggedIn?: boolean;
}

export const OnBoardingPage = (props: OnBoardingPageProps) => {
  void props.isLoggedIn;

  return (
    <div className="relative flex min-h-screen w-full bg-gray-100 font-sans text-slate-800 select-none">
      <MainContent />
    </div>
  );
};
