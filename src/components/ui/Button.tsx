// src/components/ui/Button.tsx
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         children,
         className = '',
         variant = 'primary',
         size = 'md',
         isLoading = false,
         fullWidth = false,
         disabled = false,
         ...props
     }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
            secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg"
        };

        const width = fullWidth ? "w-full" : "";
        const isDisabled = disabled || isLoading;

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${width}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
                disabled={isDisabled}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Loading...</span>
                    </div>
                ) : (
                    children
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };