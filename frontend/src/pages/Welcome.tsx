import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FiUser, FiStar, FiCheckCircle, FiShield, FiMail, FiPhone } from "react-icons/fi";
import { FiMapPin, FiFacebook, FiInstagram } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";

export default function Welcome() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactInfo = [
    {
      icon: <FiPhone className="text-green-400 text-5xl" />,
      title: "Điện thoại",
      description: "+84 123 456 789",
      href: "tel:+84123456789",
    },
    {
      icon: <FiMail className="text-purple-400 text-5xl" />,
      title: "Email",
      description: "support@nutrihome.vn",
      href: "mailto:support@nutrihome.vn",
    },
    {
      icon: <FiMapPin className="text-red-400 text-5xl" />,
      title: "Vị trí",
      description: "144 đường Xuân Thủy, Cầu Giấy, Hà Nội, Việt Nam",
      href: "https://www.google.com/maps/place/144+%C4%90.+Xu%C3%A2n+Th%E1%BB%A7y,+C%E1%BA%A7u+Gi%E1%BA%A5y,+H%C3%A0+N%E1%BB%99i",
    },
  ];

  const socialLinks = [
    {
      icon: <FiFacebook className="text-blue-600 text-4xl" />,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <FiInstagram className="text-pink-400 text-4xl" />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <FaTiktok className="text-pink-600 text-4xl" />,
      href: "https://tiktok.com",
      label: "TikTok",
    },
  ];

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "particle-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random(),
      alphaSpeed: 0.01 + Math.random() * 0.02,
    }));

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.alphaSpeed;
        if (p.alpha > 1 || p.alpha < 0) p.alphaSpeed = -p.alphaSpeed;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(173, 216, 230, ${p.alpha * 0.8})`; // light blue
        ctx.shadowColor = `rgba(173, 216, 230, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full px-6 py-12 text-white font-sans relative overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #003366 0%, #0055AA 50%, #3399FF 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <h1
          className="text-6xl md:text-7xl font-extrabold mb-6 max-w-4xl text-center leading-tight
            bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent
            animate-fadeInDown"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards", opacity: 0 }}
        >
          Chào mừng đến với NUTRIHOME
        </h1>
        <p
          className="text-2xl md:text-3xl max-w-6xl mb-8 text-blue-200 text-center
            animate-fadeInUp"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards", opacity: 0 }}
        >
          Hệ thống tư vấn dinh dưỡng gia đình thông minh, gợi ý thực đơn cân bằng, an toàn và phù hợp với mọi thành viên.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-16 animate-fadeInUp" style={{ animationDelay: "1s", animationFillMode: "forwards", opacity: 0 }}>
          <Link
            to="/login"
            className="relative inline-flex items-center px-10 py-4 font-semibold rounded-lg
            bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800
            text-white shadow-xl hover:scale-105 hover:brightness-110
            transition-transform duration-300
            before:absolute before:inset-0 before:rounded-lg before:bg-white before:opacity-10 before:blur-xl before:pointer-events-none"
            style={{ animation: "glowPulse 3s ease-in-out infinite" }}
          >
            Đăng nhập
          </Link>

          <Link
            to="/signup"
            className="relative inline-flex items-center px-10 py-4 font-semibold rounded-lg
            bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
            text-white shadow-xl hover:scale-105 hover:brightness-110
            transition-transform duration-300
            before:absolute before:inset-0 before:rounded-lg before:bg-white before:opacity-10 before:blur-xl before:pointer-events-none"
            style={{ animation: "glowPulse 3s ease-in-out infinite 1.5s" }}
          >
            Đăng ký
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-blue-300 animate-fadeInUp" style={{ animationDelay: "1.4s", animationFillMode: "forwards", opacity: 0 }}>
          Tính năng nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mb-16 animate-fadeInUp" style={{ animationDelay: "1.6s", animationFillMode: "forwards", opacity: 0 }}>
          <Card icon={<FiStar className="text-yellow-400 text-5xl" />} title="Tư vấn dinh dưỡng" description="Gợi ý thực đơn cá nhân và gia đình dựa trên dữ liệu dinh dưỡng." />
          <Card icon={<FiCheckCircle className="text-green-400 text-5xl" />} title="Theo dõi sức khỏe" description="Giám sát lượng calo, protein, chất béo và vitamin hàng ngày." />
          <Card icon={<FiShield className="text-cyan-400 text-5xl" />} title="An toàn thực phẩm" description="Kiểm tra nguyên liệu, cảnh báo dị ứng và các nguy cơ dinh dưỡng." />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-blue-300 animate-fadeInUp" style={{ animationDelay: "1.8s", animationFillMode: "forwards", opacity: 0 }}>
          Liên hệ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mb-8 animate-fadeInUp" style={{ animationDelay: "2s", animationFillMode: "forwards", opacity: 0 }}>
          {contactInfo.map(({ icon, title, description, href }, idx) => (
            <Card
              key={idx}
              icon={icon}
              title={title}
              description={
                href ? (
                  <a href={href} className="underline hover:text-blue-300" target="_blank" rel="noreferrer">
                    {description}
                  </a>
                ) : (
                  description
                )
              }
            />
          ))}
        </div>

        <div className="flex justify-center space-x-6 max-w-5xl mx-auto mb-12 animate-fadeInUp" style={{ animationDelay: "2.2s", animationFillMode: "forwards", opacity: 0 }}>
          {socialLinks.map(({ icon, href, label }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="hover:scale-110 transition-transform duration-200"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(173, 216, 230, 0.6));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 26px rgba(173, 216, 230, 1));
            opacity: 0.85;
          }
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown { animation-name: fadeInDown; animation-duration: 1s; animation-fill-mode: forwards; }
        .animate-fadeInUp { animation-name: fadeInUp; animation-duration: 1s; animation-fill-mode: forwards; }
      `}</style>
    </div>
  );
}

function Card({ icon, title, description }: { icon: React.ReactNode; title: string; description: string | React.ReactNode }) {
  return (
    <div
      tabIndex={0}
      className="bg-blue-900 bg-opacity-50 rounded-xl p-6 shadow-lg backdrop-blur-md cursor-pointer
        transition-transform duration-300 hover:scale-[1.04] hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-blue-300">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  );
}
