import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLogin } from "../hooks/login_hooks";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate();
    const { login, loading, error: loginError } = useLogin();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!form.username.trim() || !form.password.trim()) {
            setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
            return;
        }
        const user = await login(form.username, form.password);
        if (user) {
            navigate("/"); // đăng nhập thành công → về home
        }
        else {
            setError(loginError || "Sai tài khoản hoặc mật khẩu");
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800", children: [_jsxs("div", { className: "max-w-md w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-600 p-10 animate-fadeIn", children: [_jsx("h2", { className: "text-4xl font-extrabold mb-8 text-center text-blue-900 drop-shadow-md", children: "\u0110\u0103ng nh\u1EADp" }), (error || loginError) && (_jsx("div", { className: "mb-6 px-5 py-3 bg-red-100 text-red-900 rounded-lg border border-red-400 shadow-md", children: error || loginError })), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [_jsx("input", { type: "text", placeholder: "T\u00EAn \u0111\u0103ng nh\u1EADp", value: form.username, onChange: (e) => setForm({ ...form, username: e.target.value }), className: "bg-white bg-opacity-60 placeholder:text-blue-700 placeholder:opacity-90 ring-2 ring-blue-700 border-blue-700 rounded-xl px-5 py-3\r\n              border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700\r\n              text-blue-900 text-lg transition", autoComplete: "username" }), _jsx("input", { type: "password", placeholder: "M\u1EADt kh\u1EA9u", value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }), className: "bg-white bg-opacity-60 placeholder:text-blue-700 placeholder:opacity-90 ring-2 ring-blue-700 border-blue-700 rounded-xl px-5 py-3\r\n              border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700\r\n              text-blue-900 text-lg transition", autoComplete: "current-password" }), _jsx("button", { type: "submit", disabled: loading, className: `mt-4 py-3 rounded-xl font-bold text-xl
              transition-transform duration-300
              ${loading
                                    ? "bg-blue-400 cursor-not-allowed text-blue-900 shadow-inner"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-700/70 text-white cursor-pointer"}`, children: loading ? "Đang đăng nhập..." : "Đăng nhập" })] }), _jsxs("p", { className: "mt-8 text-center text-blue-900 text-lg", children: ["Ch\u01B0a c\u00F3 t\u00E0i kho\u1EA3n?", " ", _jsx("span", { onClick: () => navigate("/signup"), className: "cursor-pointer text-blue-700 font-semibold hover:underline", children: "\u0110\u0103ng k\u00FD ngay" })] })] }), _jsx("style", { children: `
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease forwards;
        }
      ` })] }));
}
