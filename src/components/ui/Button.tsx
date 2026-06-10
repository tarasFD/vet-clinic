import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
  secondary:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm font-medium",
  lg: "px-6 py-3 text-base font-medium",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
