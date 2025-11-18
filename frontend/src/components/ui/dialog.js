import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from "react-dom";
export const Dialog = ({ open, onOpenChange, children, }) => {
    if (!open)
        return null;
    return ReactDOM.createPortal(_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", onClick: () => onOpenChange(false), children: _jsx("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-lg p-4", onClick: (e) => e.stopPropagation(), children: children }) }), document.body);
};
export const DialogContent = ({ children, className = "", ...props }) => (_jsx("div", { className: className, ...props, children: children }));
export const DialogHeader = ({ children, className = "", ...props }) => (_jsx("div", { className: `mb-3 ${className}`, ...props, children: children }));
export const DialogTitle = ({ children, className = "", ...props }) => (_jsx("h2", { className: `text-xl font-semibold ${className}`, ...props, children: children }));
