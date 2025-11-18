import { jsx as _jsx } from "react/jsx-runtime";
export const Button = ({ variant = "default", className = "", children, ...props }) => {
    const styles = {
        default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    };
    return (_jsx("button", { ...props, className: `px-4 py-2 rounded-md transition font-medium ${styles[variant]} ${className}`, children: children }));
};
