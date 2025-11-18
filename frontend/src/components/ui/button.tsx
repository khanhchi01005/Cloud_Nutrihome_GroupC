// src/components/ui/button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({
    variant = "default",
    className = "",
    children,
    ...props
}) => {
    const styles = {
        default:
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
        outline:
            "border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        ghost:
            "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    };

    return (
        <button
            {...props}
            className={`px-4 py-2 rounded-md transition font-medium ${styles[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
