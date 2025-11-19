import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    const userMenuRef = useRef(null);

    const foodSuggestions = [
        "Cơm", "Bún bò", "Phở", "Salad", "Trứng", "Gà", "Canh", "Cháo", "Mì xào", "Bánh mì"
    ];

    const handleSearch = (q) => {
        const query = q ?? keyword;
        if (query.trim()) {
            navigate(`/recipes?type=recipe&q=${encodeURIComponent(query.trim())}`);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
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

    return (_jsxs(_Fragment, {
        children: [
            navOpen && (_jsx("div", { onClick: () => setNavOpen(false), className: "fixed inset-0 bg-black/50 z-40" })),
            _jsx(NavBar, { open: navOpen, onClose: () => setNavOpen(false) }),
            _jsx("header", {
                className: "fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-30 font-sans font-bold", children: _jsxs("div", {
                    className: "container mx-auto flex items-center justify-between px-4 py-3", children: [
                        _jsx("button", { onClick: () => setNavOpen(true), className: "text-white text-2xl cursor-pointer p-2 rounded-full hover:bg-white/20 transition", children: _jsx(FiMenu, {}) }),
                        _jsxs(Link, {
                            to: "/", className: "flex items-center space-x-2", children: [
                                _jsx("img", { src: "/images/NutriHome.png", alt: "Nutrihome Logo", className: "h-10 w-10 rounded-full object-cover" }),
                                _jsx("span", { className: "text-2xl ml-2", children: "NUTRIHOME" })
                            ]
                        }),
                        _jsxs("div", {
                            className: "flex-1 max-w-3xl mx-4 relative", children: [
                                _jsxs("div", {
                                    className: "flex bg-white border border-gray-300 rounded overflow-hidden", children: [
                                        _jsx("input", { type: "text", placeholder: "Tìm kiếm món ăn...", value: keyword, onChange: (e) => setKeyword(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), className: "flex-1 p-2 text-black focus:outline-none text-sm font-bold" }),
                                        _jsx("button", { className: "bg-blue-500 hover:bg-blue-700 px-3 flex items-center justify-center cursor-pointer", onClick: () => handleSearch(), children: _jsx(FiSearch, { className: "text-white text-lg" }) })
                                    ]
                                }),
                                _jsx("div", { className: "flex flex-wrap gap-3 mt-2 ml-5", children: foodSuggestions.map((s, i) => (_jsx("button", { onClick: () => handleSearch(s), className: "text-white text-sm hover:underline transition cursor-pointer", children: s }, i))) })
                            ]
                        }),
                        _jsxs("div", {
                            className: "flex items-center space-x-3 relative", children: [
                                _jsxs("div", {
                                    className: "relative", children: [
                                        _jsxs("button", {
                                            onClick: () => setLangOpen(!langOpen), className: "cursor-pointer flex items-center justify-center border border-blue-500 text-blue-500 bg-white px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition w-16", children: [
                                                _jsx(FiGlobe, { className: "mr-1" }),
                                                _jsx("span", { children: language })
                                            ]
                                        }),
                                        langOpen && (_jsxs("div", {
                                            className: "absolute top-full mt-1 w-16 bg-white text-black shadow rounded", children: [
                                                _jsx("button", { onClick: () => { setLanguage("VI"); setLangOpen(false); }, className: "cursor-pointer block rounded w-full px-2 py-1 hover:bg-gray-100 text-center", children: "VI" }),
                                                _jsx("button", { onClick: () => { setLanguage("EN"); setLangOpen(false); }, className: "cursor-pointer block rounded w-full px-2 py-1 hover:bg-gray-100 text-center", children: "EN" })
                                            ]
                                        }))
                                    ]
                                }),
                                user ? (_jsxs("div", {
                                    ref: userMenuRef, className: "relative", children: [
                                        _jsxs("button", {
                                            onClick: () => setUserMenuOpen(!userMenuOpen), className: "flex items-center space-x-2 border border-blue-500 text-blue-500 bg-white px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition cursor-pointer", children: [
                                                user.avatar ? (_jsx("img", { src: user.avatar, alt: user.username, className: "h-6 w-6 rounded-full object-cover" })) : _jsx(FiUser, {}),
                                                _jsxs("span", { children: ["Xin chào, ", user.fullname ?? user.username] })
                                            ]
                                        }),
                                        userMenuOpen && (_jsxs("div", {
                                            className: "absolute right-0 mt-1 w-48 bg-white text-black rounded shadow z-50", children: [
                                                _jsx("button", { onClick: () => { navigate("/profile"); setUserMenuOpen(false); }, className: "rounded w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer", children: "Thông tin cá nhân" }),
                                                _jsx("button", { onClick: () => { logout(); setUserMenuOpen(false); navigate("/"); }, className: "rounded w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer", children: "Đăng xuất" })
                                            ]
                                        }))
                                    ]
                                })) : (_jsxs(Link, { to: "/login", className: "flex items-center space-x-2 border border-blue-500 text-blue-500 bg-white px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition", children: [_jsx(FiUser, {}), _jsx("span", { children: "Đăng nhập / Đăng ký" })] }))
                            ]
                        })
                    ]
                })
            })
        ]
    }));
}
