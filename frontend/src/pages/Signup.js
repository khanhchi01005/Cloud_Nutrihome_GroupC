import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRegister } from "../hooks/register_hooks";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
    const navigate = useNavigate();
    const { register, loading, error: registerError } = useRegister();
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullname: "",
        gender: "",
        birthDay: "",
        birthMonth: "",
        birthYear: "",
        weight: "",
        height: "",
        activity_level: "",
        disease: "",
        allergen: "",
        phone: "",
    });
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const requiredFields = [
            "username",
            "password",
            "confirmPassword",
            "fullname",
            "gender",
            "birthDay",
            "birthMonth",
            "birthYear",
            "weight",
            "height",
            "activity_level",
        ];
        const emptyFields = requiredFields.filter((key) => !form[key]?.toString().trim());
        if (emptyFields.length > 0) {
            setError("Vui lòng điền đầy đủ tất cả các thông tin bắt buộc");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }
        const dob = `${form.birthYear}-${form.birthMonth.padStart(2, "0")}-${form.birthDay.padStart(2, "0")}`;
        const result = await register({
            fullname: form.fullname,
            username: form.username,
            password: form.password,
            confirm_password: form.confirmPassword,
            dob,
            height: Number(form.height),
            weight: Number(form.weight),
            activity_level: form.activity_level,
            disease: form.disease || null,
            allergen: form.allergen || null,
            gender: form.gender,
        });
        if (result) {
            alert("Đăng ký thành công, vui lòng đăng nhập!");
            navigate("/login");
        }
        else {
            setError(registerError || "Đăng ký thất bại");
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800", children: [_jsxs("div", { className: "w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-600 p-10 animate-fadeIn text-blue-900", children: [_jsx("h2", { className: "text-4xl font-extrabold mb-8 text-center drop-shadow-md", children: "\u0110\u0103ng k\u00FD" }), (error || registerError) && (_jsx("div", { className: "mb-6 px-5 py-3 bg-red-100 text-red-900 rounded-lg border border-red-400 shadow-md", children: error || registerError })), _jsx("form", { onSubmit: handleSubmit, className: "space-y-4", children: _jsxs("fieldset", { disabled: loading, className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:gap-4", children: [_jsx("input", { type: "text", placeholder: "H\u1ECD v\u00E0 t\u00EAn", value: form.fullname, onChange: (e) => setForm({ ...form, fullname: e.target.value }), className: "flex-1 bg-white bg-opacity-60 placeholder:text-blue-700 placeholder:opacity-90 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-700 mb-4 md:mb-0" }), _jsxs("select", { value: form.gender, onChange: (e) => setForm({ ...form, gender: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-700 cursor-pointer", children: [_jsx("option", { value: "", children: "Gi\u1EDBi t\u00EDnh" }), _jsx("option", { value: "male", children: "Nam" }), _jsx("option", { value: "female", children: "N\u1EEF" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:gap-4", children: [_jsx("input", { type: "number", placeholder: "Ng\u00E0y", value: form.birthDay, onChange: (e) => setForm({ ...form, birthDay: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0", min: 1, max: 31 }), _jsx("input", { type: "number", placeholder: "Th\u00E1ng", value: form.birthMonth, onChange: (e) => setForm({ ...form, birthMonth: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0", min: 1, max: 12 }), _jsx("input", { type: "number", placeholder: "N\u0103m", value: form.birthYear, onChange: (e) => setForm({ ...form, birthYear: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0", min: 1900, max: new Date().getFullYear() }), _jsxs("select", { value: form.activity_level, onChange: (e) => setForm({ ...form, activity_level: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg cursor-pointer", children: [_jsx("option", { value: "", children: "T\u1EA7n su\u1EA5t ho\u1EA1t \u0111\u1ED9ng" }), _jsx("option", { value: "low", children: "\u00CDt" }), _jsx("option", { value: "medium", children: "Trung b\u00ECnh" }), _jsx("option", { value: "high", children: "Nhi\u1EC1u" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:gap-4", children: [_jsx("input", { type: "number", placeholder: "Chi\u1EC1u cao (cm)", value: form.height, onChange: (e) => setForm({ ...form, height: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0" }), _jsx("input", { type: "number", placeholder: "C\u00E2n n\u1EB7ng (kg)", value: form.weight, onChange: (e) => setForm({ ...form, weight: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:gap-4", children: [_jsx("input", { type: "text", placeholder: "B\u1EC7nh l\u00FD", value: form.disease, onChange: (e) => setForm({ ...form, disease: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0" }), _jsx("input", { type: "text", placeholder: "D\u1ECB \u1EE9ng", value: form.allergen, onChange: (e) => setForm({ ...form, allergen: e.target.value }), className: "flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg" })] }), _jsx("input", { type: "text", placeholder: "T\u00EAn \u0111\u0103ng nh\u1EADp", value: form.username, onChange: (e) => setForm({ ...form, username: e.target.value }), className: "w-full bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg" }), _jsx("input", { type: "password", placeholder: "M\u1EADt kh\u1EA9u", value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }), className: "w-full bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg" }), _jsx("input", { type: "password", placeholder: "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u", value: form.confirmPassword, onChange: (e) => setForm({ ...form, confirmPassword: e.target.value }), className: "w-full bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg" }), _jsx("button", { type: "submit", className: `w-full mt-4 py-3 rounded-xl font-bold text-xl transition-transform duration-300
                ${loading
                                        ? "bg-blue-400 cursor-not-allowed text-blue-900 shadow-inner animate-pulse"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-700/70 text-white cursor-pointer"}`, children: loading ? "Đang đăng ký..." : "Đăng ký" })] }) }), _jsxs("p", { className: "mt-8 text-center text-blue-900 text-lg", children: ["\u0110\u00E3 c\u00F3 t\u00E0i kho\u1EA3n?", " ", _jsx("span", { onClick: () => navigate("/login"), className: "cursor-pointer text-blue-700 font-semibold hover:underline", children: "\u0110\u0103ng nh\u1EADp" })] })] }), _jsx("style", { children: `
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease forwards; }
      ` })] }));
}
