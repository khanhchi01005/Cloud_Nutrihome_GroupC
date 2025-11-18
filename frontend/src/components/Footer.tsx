import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`bg-blue-700 text-white ${className || ""}`}>
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo + giới thiệu */}
        <div>
          <h2 className="text-2xl font-bold mb-3">NutriHome</h2>
          <p className="text-sm leading-6 text-justify">
            NutriHome là hệ thống tư vấn dinh dưỡng gia đình, hỗ trợ các gia đình xây dựng khẩu phần ăn khoa học, đầy đủ dinh dưỡng và dễ thực hiện. Ứng dụng gợi ý thực đơn phù hợp, hướng dẫn cách nấu ăn, tận dụng nguyên liệu sẵn có và ghi lại lịch sử ăn uống của từng thành viên để đưa ra các đề xuất cá nhân hóa.
          </p>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> <span>+84 123 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> <span>support@nutrihome.vn</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>144 đường Xuân Thủy, Cầu Giấy, Hà Nội, Việt Nam</span>
            </li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Theo dõi chúng tôi</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/posts/3" className="hover:underline">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="/posts/4" className="hover:underline">
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a href="/posts/5" className="hover:underline">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="/posts/6" className="hover:underline">
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="bg-blue-900 text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} NutriHome - All rights reserved
      </div>
    </footer>
  );
}
