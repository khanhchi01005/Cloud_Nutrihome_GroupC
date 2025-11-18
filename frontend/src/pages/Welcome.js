import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FiStar, FiCheckCircle, FiShield, FiMail, FiPhone } from "react-icons/fi";
import { FiMapPin, FiFacebook, FiInstagram } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
export default function Welcome() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const contactInfo = [
        {
            icon: _jsx(FiPhone, { className: "text-green-400 text-5xl" }),
            title: "Điện thoại",
            description: "+84 123 456 789",
            href: "tel:+84123456789",
        },
        {
            icon: _jsx(FiMail, { className: "text-purple-400 text-5xl" }),
            title: "Email",
            description: "support@nutrihome.vn",
            href: "mailto:support@nutrihome.vn",
        },
        {
            icon: _jsx(FiMapPin, { className: "text-red-400 text-5xl" }),
            title: "Vị trí",
            description: "144 đường Xuân Thủy, Cầu Giấy, Hà Nội, Việt Nam",
            href: "https://www.google.com/maps/place/144+%C4%90.+Xu%C3%A2n+Th%E1%BB%A7y,+C%E1%BA%A7u+Gi%E1%BA%A5y,+H%C3%A0+N%E1%BB%99i",
        },
    ];
    const socialLinks = [
        {
            icon: _jsx(FiFacebook, { className: "text-blue-600 text-4xl" }),
            href: "https://facebook.com",
            label: "Facebook",
        },
        {
            icon: _jsx(FiInstagram, { className: "text-pink-400 text-4xl" }),
            href: "https://instagram.com",
            label: "Instagram",
        },
        {
            icon: _jsx(FaTiktok, { className: "text-pink-600 text-4xl" }),
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
            if (!ctx)
                return;
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.alpha += p.alphaSpeed;
                if (p.alpha > 1 || p.alpha < 0)
                    p.alphaSpeed = -p.alphaSpeed;
                if (p.x < 0)
                    p.x = width;
                else if (p.x > width)
                    p.x = 0;
                if (p.y < 0)
                    p.y = height;
                else if (p.y > height)
                    p.y = 0;
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
    return (_jsxs("div", { className: "min-h-screen w-full px-6 py-12 text-white font-sans relative overflow-x-hidden", style: {
            background: "linear-gradient(135deg, #003366 0%, #0055AA 50%, #3399FF 100%)",
            backgroundAttachment: "fixed",
        }, children: [_jsxs("div", { className: "max-w-6xl mx-auto flex flex-col items-center", children: [_jsx("h1", { className: "text-6xl md:text-7xl font-extrabold mb-6 max-w-4xl text-center leading-tight\r\n            bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent\r\n            animate-fadeInDown", style: { animationDelay: "0.2s", animationFillMode: "forwards", opacity: 0 }, children: "Ch\u00E0o m\u1EEBng \u0111\u1EBFn v\u1EDBi NUTRIHOME" }), _jsx("p", { className: "text-2xl md:text-3xl max-w-6xl mb-8 text-blue-200 text-center\r\n            animate-fadeInUp", style: { animationDelay: "0.8s", animationFillMode: "forwards", opacity: 0 }, children: "H\u1EC7 th\u1ED1ng t\u01B0 v\u1EA5n dinh d\u01B0\u1EE1ng gia \u0111\u00ECnh th\u00F4ng minh, g\u1EE3i \u00FD th\u1EF1c \u0111\u01A1n c\u00E2n b\u1EB1ng, an to\u00E0n v\u00E0 ph\u00F9 h\u1EE3p v\u1EDBi m\u1ECDi th\u00E0nh vi\u00EAn." }), _jsxs("div", { className: "flex flex-wrap justify-center gap-8 mb-16 animate-fadeInUp", style: { animationDelay: "1s", animationFillMode: "forwards", opacity: 0 }, children: [_jsx(Link, { to: "/login", className: "relative inline-flex items-center px-10 py-4 font-semibold rounded-lg\r\n            bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800\r\n            text-white shadow-xl hover:scale-105 hover:brightness-110\r\n            transition-transform duration-300\r\n            before:absolute before:inset-0 before:rounded-lg before:bg-white before:opacity-10 before:blur-xl before:pointer-events-none", style: { animation: "glowPulse 3s ease-in-out infinite" }, children: "\u0110\u0103ng nh\u1EADp" }), _jsx(Link, { to: "/signup", className: "relative inline-flex items-center px-10 py-4 font-semibold rounded-lg\r\n            bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600\r\n            text-white shadow-xl hover:scale-105 hover:brightness-110\r\n            transition-transform duration-300\r\n            before:absolute before:inset-0 before:rounded-lg before:bg-white before:opacity-10 before:blur-xl before:pointer-events-none", style: { animation: "glowPulse 3s ease-in-out infinite 1.5s" }, children: "\u0110\u0103ng k\u00FD" })] }), _jsx("h2", { className: "text-3xl font-bold mb-6 text-blue-300 animate-fadeInUp", style: { animationDelay: "1.4s", animationFillMode: "forwards", opacity: 0 }, children: "T\u00EDnh n\u0103ng n\u1ED5i b\u1EADt" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mb-16 animate-fadeInUp", style: { animationDelay: "1.6s", animationFillMode: "forwards", opacity: 0 }, children: [_jsx(Card, { icon: _jsx(FiStar, { className: "text-yellow-400 text-5xl" }), title: "T\u01B0 v\u1EA5n dinh d\u01B0\u1EE1ng", description: "G\u1EE3i \u00FD th\u1EF1c \u0111\u01A1n c\u00E1 nh\u00E2n v\u00E0 gia \u0111\u00ECnh d\u1EF1a tr\u00EAn d\u1EEF li\u1EC7u dinh d\u01B0\u1EE1ng." }), _jsx(Card, { icon: _jsx(FiCheckCircle, { className: "text-green-400 text-5xl" }), title: "Theo d\u00F5i s\u1EE9c kh\u1ECFe", description: "Gi\u00E1m s\u00E1t l\u01B0\u1EE3ng calo, protein, ch\u1EA5t b\u00E9o v\u00E0 vitamin h\u00E0ng ng\u00E0y." }), _jsx(Card, { icon: _jsx(FiShield, { className: "text-cyan-400 text-5xl" }), title: "An to\u00E0n th\u1EF1c ph\u1EA9m", description: "Ki\u1EC3m tra nguy\u00EAn li\u1EC7u, c\u1EA3nh b\u00E1o d\u1ECB \u1EE9ng v\u00E0 c\u00E1c nguy c\u01A1 dinh d\u01B0\u1EE1ng." })] }), _jsx("h2", { className: "text-3xl font-bold mb-6 text-blue-300 animate-fadeInUp", style: { animationDelay: "1.8s", animationFillMode: "forwards", opacity: 0 }, children: "Li\u00EAn h\u1EC7" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mb-8 animate-fadeInUp", style: { animationDelay: "2s", animationFillMode: "forwards", opacity: 0 }, children: contactInfo.map(({ icon, title, description, href }, idx) => (_jsx(Card, { icon: icon, title: title, description: href ? (_jsx("a", { href: href, className: "underline hover:text-blue-300", target: "_blank", rel: "noreferrer", children: description })) : (description) }, idx))) }), _jsx("div", { className: "flex justify-center space-x-6 max-w-5xl mx-auto mb-12 animate-fadeInUp", style: { animationDelay: "2.2s", animationFillMode: "forwards", opacity: 0 }, children: socialLinks.map(({ icon, href, label }, idx) => (_jsx("a", { href: href, target: "_blank", rel: "noreferrer", "aria-label": label, className: "hover:scale-110 transition-transform duration-200", children: icon }, idx))) })] }), _jsx("style", { children: `
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
      ` })] }));
}
function Card({ icon, title, description }) {
    return (_jsxs("div", { tabIndex: 0, className: "bg-blue-900 bg-opacity-50 rounded-xl p-6 shadow-lg backdrop-blur-md cursor-pointer\r\n        transition-transform duration-300 hover:scale-[1.04] hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-400", children: [_jsx("div", { className: "mb-4", children: icon }), _jsx("h3", { className: "text-xl font-semibold mb-2 text-blue-300", children: title }), _jsx("p", { className: "text-blue-100", children: description })] }));
}
