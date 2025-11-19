import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { useChatAsk } from "../hooks/chatbot_hooks";
import { Send, Minus, Maximize2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
const USER_NAME = "Long";
const USER_AVA = "/images/user/mambo.jpg";
const BOT_NAME = "NutriHome";
const BOT_AVA = "/images/Logo.png";
function TypingDots() {
    const [dots, setDots] = useState(".");
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length === 3 ? "." : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);
    return _jsx("span", { children: `Đang trả lời${dots}` });
}
export default function ChatBox({ onClose }) {
    const { mutate: ask } = useChatAsk();
    const [input, setInput] = useState("");
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem("nutrihome_history");
        return saved ? JSON.parse(saved) : [];
    });
    const [botTyping, setBotTyping] = useState(false);
    const chatEndRef = useRef(null);
    const [isLarge, setIsLarge] = useState(false); // state phóng to
    const [typingContent, setTypingContent] = useState(""); // Nội dung hiển thị tạm thời
    const handleSend = () => {
        if (!input.trim() || botTyping)
            return;
        const message = input.trim();
        setInput("");
        setHistory((prev) => [...prev, { user: message, bot: "" }]);
        setBotTyping(true);
        ask({ question: message, history }, {
            onSuccess: (res) => {
                let index = 0;
                const text = res.answer || "";
                setTypingContent(""); // reset
                const interval = setInterval(() => {
                    if (index === 0)
                        setTypingContent(""); // clear để show TypingDots trước khi có ký tự
                    index++;
                    setTypingContent(text.slice(0, index));
                    if (index === text.length) {
                        clearInterval(interval);
                        setHistory((prev) => {
                            const newHistory = [...prev];
                            newHistory[newHistory.length - 1].bot = text;
                            return newHistory;
                        });
                        setTypingContent("");
                        setBotTyping(false);
                    }
                }, 5); // nhanh hơn (15ms/ký tự)
            },
            onError: () => setBotTyping(false),
        });
    };
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);
    useEffect(() => {
        localStorage.setItem("nutrihome_history", JSON.stringify(history));
    }, [history]);
    return (_jsxs("div", {
        className: `flex flex-col border rounded-lg shadow-lg bg-white transition-all duration-300 absolute bottom-0 right-0 ${isLarge ? "h-[700px] w-[600px]" : "h-[500px] w-[384px]"}`, children: [_jsxs("div", {
            className: "flex items-center justify-between p-4 bg-indigo-600 text-white font-semibold rounded-t-lg", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("img", { src: BOT_AVA, className: "w-8 h-8 rounded-full" }), _jsx("span", { children: "nutrihome Chatbot" })] }), _jsxs("div", {
                className: "flex items-center gap-2", children: [_jsx("button", {
                    onClick: () => {
                        setHistory([]);
                        localStorage.removeItem("nutrihome_history");
                    }, className: "cursor-pointer p-1 rounded-full hover:bg-indigo-500", "aria-label": "Reset l\u1ECBch s\u1EED", children: _jsx(RotateCcw, { size: 18 })
                }), _jsx("button", { onClick: () => setIsLarge((prev) => !prev), className: "cursor-pointer p-1 rounded-full hover:bg-indigo-500", "aria-label": "Ph\u00F3ng to", children: _jsx(Maximize2, { size: 18 }) }), _jsx("button", { onClick: onClose, className: "cursor-pointer p-1 rounded-full hover:bg-indigo-500", "aria-label": "Thu g\u1ECDn", children: _jsx(Minus, { size: 18 }) })]
            })]
        }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [history.map((h, i) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-end items-start gap-2", children: [_jsxs("div", { className: "flex flex-col items-end max-w-[70%]", children: [_jsx("span", { className: "text-xs text-gray-500 mb-1", children: USER_NAME }), _jsx("div", { className: "bg-indigo-500 text-white px-4 py-2 rounded-2xl rounded-tr-none", children: h.user })] }), _jsx("img", { src: USER_AVA, className: "w-8 h-8 rounded-full" })] }), _jsxs("div", { className: "flex justify-start items-start gap-2", children: [_jsx("img", { src: BOT_AVA, className: "w-8 h-8 rounded-full" }), _jsxs("div", { className: "flex flex-col max-w-[70%]", children: [_jsx("span", { className: "text-xs text-gray-500 mb-1", children: BOT_NAME }), h.bot && (_jsx("div", { className: "bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none prose prose-sm", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw], children: h.bot }) })), i === history.length - 1 && botTyping && !h.bot && (typingContent ? (_jsx("div", { className: "bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none prose prose-sm", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw], children: typingContent }) })) : (_jsx("span", { className: "text-xs text-gray-500 opacity-70 mb-1", children: _jsx(TypingDots, {}) })))] })] })] }, i))), _jsx("div", { ref: chatEndRef })] }), _jsxs("div", { className: "p-4 border-t flex items-center gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSend(), placeholder: "Nh\u1EADp tin nh\u1EAFn...", disabled: botTyping, className: "flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100" }), _jsx("button", { onClick: handleSend, disabled: botTyping || !input.trim(), className: "p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full disabled:opacity-50", children: _jsx(Send, { size: 18 }) })] })]
    }));
}
