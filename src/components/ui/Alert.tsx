import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "error" | "success" | "warning" | "info";
  title?: string;
  onClose?: () => void;
  className?: string;
}

const variants = {
  error: {
    bg: "bg-red-50",
    border: "border-red-300",
    icon: "🚨",
    titleColor: "text-red-900",
    textColor: "text-red-800",
    buttonColor: "text-red-600 hover:text-red-700",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    icon: "✅",
    titleColor: "text-emerald-900",
    textColor: "text-emerald-800",
    buttonColor: "text-emerald-600 hover:text-emerald-700",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-300",
    icon: "⚠️",
    titleColor: "text-amber-900",
    textColor: "text-amber-800",
    buttonColor: "text-amber-600 hover:text-amber-700",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    icon: "ℹ️",
    titleColor: "text-blue-900",
    textColor: "text-blue-800",
    buttonColor: "text-blue-600 hover:text-blue-700",
  },
};

export function Alert({
  children,
  variant = "info",
  title,
  onClose,
  className = "",
}: AlertProps) {
  const style = variants[variant];

  return (
    <div
      className={`rounded-lg border-2 ${style.bg} ${style.border} p-4 flex items-start gap-4 ${className}`}
    >
      <span className="text-2xl flex-shrink-0">{style.icon}</span>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-bold ${style.titleColor} mb-1`}>{title}</h4>
        )}
        <div className={`text-sm leading-relaxed ${style.textColor}`}>
          {children}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 font-semibold ${style.buttonColor} transition-colors p-1`}
          aria-label="Закрити"
        >
          ✕
        </button>
      )}
    </div>
  );
}
