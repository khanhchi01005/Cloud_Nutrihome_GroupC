// Header.tsx
import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiGlobe, FiMenu } from "react-icons/fi";
import { AuthContext } from "../AuthContext";
import NavBar from "./NavBar";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState("VI");
  const [keyword, setKeyword] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const foodSuggestions = [
    "Cơm", "Bún bò", "Phở", "Salad", "Trứng", "Gà", "Canh", "Cháo", "Mì xào", "Bánh mì"
  ];

  const handleSearch = (q?: string) => {
    const query = q ?? keyword;
    if (query.trim()) {
      navigate(`/recipes?type=recipe&q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <>
      {/* OVERLAY MỜ khi NavBar mở, nhưng không che Header */}
      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      <NavBar open={navOpen} onClose={() => setNavOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-30 font-sans font-bold">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">

          {/* ICON MENU */}
          <button
            onClick={() => setNavOpen(true)}
            className="text-white text-2xl cursor-pointer p-2 rounded-full hover:bg-white/20 transition"
          >
            <FiMenu className="font-bold" />
          </button>

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/images/NutriHome.png"
              alt="Nutrihome Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-2xl ml-2">NUTRIHOME</span>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 max-w-3xl mx-4 relative">
            <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 p-2 text-black focus:outline-none text-sm font-bold"
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 px-3 flex items-center justify-center cursor-pointer"
                onClick={() => handleSearch()}
              >
                <FiSearch className="text-white text-lg font-bold" />
              </button>
            </div>

            {/* Gợi ý món ăn */}
            <div className="flex flex-wrap gap-3 mt-2 ml-5">
              {foodSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="text-white text-sm hover:underline transition cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-3 relative">

            {/* LANGUAGE */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="cursor-pointer flex items-center justify-center border border-blue-500 text-blue-500 bg-white px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition w-16"
              >
                <FiGlobe className="mr-1" />
                <span>{language}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full mt-1 w-16 bg-white text-black shadow rounded">
                  <button
                    onClick={() => { setLanguage("VI"); setLangOpen(false); }}
                    className="cursor-pointer block rounded w-full px-2 py-1 hover:bg-gray-100 text-center"
                  >VI</button>
                  <button
                    onClick={() => { setLanguage("EN"); setLangOpen(false); }}
                    className="cursor-pointer block rounded w-full px-2 py-1 hover:bg-gray-100 text-center"
                  >EN</button>
                </div>
              )}
            </div>

            {/* USER */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 border border-blue-500 text-blue-500 bg-white px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition cursor-pointer"
                >
                  {user.username ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : <FiUser />}
                  <span>Xin chào, {user.fullname ?? user.username}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white text-black rounded shadow z-50">
                    <button
                      onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}
                      className="rounded w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      Cập nhật thông tin cá nhân
                    </button>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate("/"); }}
                      className="rounded w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 border border-blue-500 text-blue-500 bg-white px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition"
              >
                <FiUser />
                <span>Đăng nhập / Đăng ký</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
