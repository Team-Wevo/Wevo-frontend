import type { IconProps } from "./types";

export const EditNameIcon = ({
  size = 24,
  color,
  className = "",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 21 21"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.1001 3.60043L16.9001 7.40051M18.9654 5.32187C19.4677 4.81971 19.7499 4.13858 19.75 3.42833C19.7501 2.71808 19.468 2.03689 18.9659 1.5346C18.4637 1.03232 17.7826 0.750089 17.0724 0.75C16.3621 0.749911 15.6809 1.03197 15.1787 1.53413L2.49985 14.216C2.27928 14.4359 2.11616 14.7067 2.02485 15.0045L0.769888 19.139C0.745335 19.2211 0.743481 19.3084 0.764521 19.3915C0.785562 19.4747 0.828713 19.5506 0.889395 19.6111C0.950078 19.6717 1.02603 19.7148 1.10919 19.7357C1.19235 19.7566 1.27962 19.7546 1.36174 19.7299L5.49713 18.4759C5.79464 18.3854 6.0654 18.2232 6.28564 18.0037L18.9654 5.32187Z"
      stroke={color ?? "url(#paint0_linear_2228_2068)"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2228_2068"
        x1="10.25"
        y1="0.75"
        x2="10.25"
        y2="19.75"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B8AEFF" />
        <stop
          offset="1"
          stopColor="#322A85"
        />
      </linearGradient>
    </defs>
  </svg>
);
