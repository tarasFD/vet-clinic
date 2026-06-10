import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-gray-900"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:bg-blue-50/50 focus:outline-none disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-500 ${error ? "border-red-500 focus:border-red-500" : ""} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-sm font-medium text-red-600">{error}</span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
