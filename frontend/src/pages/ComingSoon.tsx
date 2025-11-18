import { Link } from "react-router-dom";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useEffect } from "react";

export default function ComingSoon() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* Nội dung Coming Soon */}
      <main
        className="flex-1 flex flex-col items-center justify-center text-white 
             bg-gradient-to-br from-sky-500 to-blue-600
             relative overflow-hidden"
      >
        {/* Hiệu ứng nền nhấp nháy */}
        <div className="absolute w-96 h-96 bg-sky-300 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-blue-400 opacity-30 rounded-full blur-2xl bottom-10 right-10 animate-pulse" />
        <div className="absolute w-64 h-64 bg-sky-200 opacity-10 rounded-full blur-2xl top-1/3 left-1/4 animate-pulse" />
        <div className="absolute w-72 h-72 bg-blue-300 opacity-15 rounded-full blur-3xl bottom-1/3 right-1/3 animate-pulse" />

        {/* Text Coming Soon */}
        <h1 className="text-7xl font-extrabold drop-shadow-2xl animate-bounce text-center">
          Coming Soon
        </h1>
        <p className="mt-6 text-xl max-w-lg text-center animate-fadeIn">
          Trang bạn đang tìm hiện đang được phát triển.<br />
          Hãy quay lại trang chủ và khám phá các tính năng khác!
        </p>

        {/* Nút quay lại */}
        <Link
          to="/"
          className="mt-10 flex items-center gap-3 px-10 py-4 bg-white text-blue-700 
               rounded-full font-semibold shadow-xl hover:shadow-2xl 
               hover:scale-110 transition-transform"
        >
          <FiArrowLeftCircle size={24} />
          Về trang chủ
        </Link>

        {/* Bản quyền nhỏ */}
        <div className="absolute bottom-10 text-sm text-white/80 animate-pulse">
          © {new Date().getFullYear()} NutriHome Team
        </div>
      </main>


    </div>
  );
}
