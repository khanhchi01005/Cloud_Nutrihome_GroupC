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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const emptyFields = requiredFields.filter(
      (key) => !form[key as keyof typeof form]?.toString().trim()
    );

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
    } else {
      setError(registerError || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800">
      <div className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-600 p-10 animate-fadeIn text-blue-900">
        <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow-md">Đăng ký</h2>

        {(error || registerError) && (
          <div className="mb-6 px-5 py-3 bg-red-100 text-red-900 rounded-lg border border-red-400 shadow-md">
            {error || registerError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={loading} className="space-y-4">
            {/* Họ và tên + Giới tính */}
            <div className="flex flex-col md:flex-row md:gap-4">
              <input
                type="text"
                placeholder="Họ và tên"
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 placeholder:text-blue-700 placeholder:opacity-90 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-700 mb-4 md:mb-0"
              />
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-700 cursor-pointer"
              >
                <option value="">Giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            {/* Ngày/Tháng/Năm sinh + Tần suất hoạt động */}
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <input
                type="number"
                placeholder="Ngày"
                value={form.birthDay}
                onChange={(e) => setForm({ ...form, birthDay: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0"
                min={1}
                max={31}
              />
              <input
                type="number"
                placeholder="Tháng"
                value={form.birthMonth}
                onChange={(e) => setForm({ ...form, birthMonth: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0"
                min={1}
                max={12}
              />
              <input
                type="number"
                placeholder="Năm"
                value={form.birthYear}
                onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0"
                min={1900}
                max={new Date().getFullYear()}
              />
              <select
                value={form.activity_level}
                onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg cursor-pointer"
              >
                <option value="">Tần suất hoạt động</option>
                <option value="low">Ít</option>
                <option value="medium">Trung bình</option>
                <option value="high">Nhiều</option>
              </select>
            </div>

            {/* Chiều cao + Cân nặng */}
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <input
                type="number"
                placeholder="Chiều cao (cm)"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0"
              />
              <input
                type="number"
                placeholder="Cân nặng (kg)"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg"
              />
            </div>

            {/* Bệnh lý + Dị ứng */}
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <input
                type="text"
                placeholder="Bệnh lý"
                value={form.disease}
                onChange={(e) => setForm({ ...form, disease: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg mb-4 sm:mb-0"
              />
              <input
                type="text"
                placeholder="Dị ứng"
                value={form.allergen}
                onChange={(e) => setForm({ ...form, allergen: e.target.value })}
                className="flex-1 bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg"
              />
            </div>

            {/* Tên đăng nhập + mật khẩu + confirm */}
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg"
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full bg-white bg-opacity-60 ring-2 ring-blue-700 rounded-xl px-5 py-3 text-blue-900 text-lg"
            />

            <button
              type="submit"
              className={`w-full mt-4 py-3 rounded-xl font-bold text-xl transition-transform duration-300
                ${loading
                  ? "bg-blue-400 cursor-not-allowed text-blue-900 shadow-inner animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-700/70 text-white cursor-pointer"
                }`}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </fieldset>
        </form>

        <p className="mt-8 text-center text-blue-900 text-lg">
          Đã có tài khoản?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-blue-700 font-semibold hover:underline"
          >
            Đăng nhập
          </span>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease forwards; }
      `}</style>
    </div>
  );
}
