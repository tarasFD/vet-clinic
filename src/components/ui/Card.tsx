import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  title,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md ${hoverable ? "hover:border-blue-300 transition-all" : ""} ${className}`}
    >
      {title && (
        <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
}
