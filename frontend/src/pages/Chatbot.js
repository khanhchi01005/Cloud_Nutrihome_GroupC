import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { useChatAsk } from "../hooks/chatbot_hooks";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
const USER_NAME = "Long";
const USER_AVA = "/images/user/mambo.jpg";
const BOT_NAME = "nutrihome";
const BOT_AVA = "/images/user/mambo.jpg";
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
export default function ChatBox() {
    const { mutate: ask } = useChatAsk();
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [botTyping, setBotTyping] = useState(false);
    const chatEndRef = useRef(null);
    const handleSend = () => {
        if (!input.trim() || botTyping)
            return;
        const message = input.trim();
        setInput(""); // clear ngay lập tức
        setHistory((prev) => [...prev, { user: message, bot: "" }]);
        setBotTyping(true);
        ask({ question: message, history }, {
            onSuccess: (res) => {
                setHistory((prev) => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].bot = res.answer;
                    return newHistory;
                });
                setBotTyping(false);
            },
            onError: () => setBotTyping(false),
        });
    };
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);
    return (_jsxs("div", { className: "flex flex-col h-[500px] w-full max-w-xl mx-auto border rounded-lg shadow-lg bg-white", children: [_jsx("div", { className: "p-4 bg-indigo-600 text-white font-semibold rounded-t-lg", children: "Chat T\u01B0 V\u1EA5n \u0110\u1EB7c S\u1EA3n" }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [history.map((h, i) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-end items-start gap-2", children: [_jsxs("div", { className: "flex flex-col items-end max-w-[70%]", children: [_jsx("span", { className: "text-xs text-gray-500 mb-1", children: USER_NAME }), _jsx("div", { className: "bg-indigo-500 text-white px-4 py-2 rounded-2xl rounded-br-none", children: h.user })] }), _jsx("img", { src: USER_AVA, className: "w-8 h-8 rounded-full" })] }), _jsxs("div", { className: "flex justify-start items-start gap-2", children: [_jsx("img", { src: BOT_AVA, className: "w-8 h-8 rounded-full" }), _jsxs("div", { className: "flex flex-col max-w-[70%]", children: [_jsx("span", { className: "text-xs text-gray-500 mb-1", children: BOT_NAME }), i === history.length - 1 && botTyping && (_jsx("span", { className: "text-xs text-gray-500 opacity-70 mb-1", children: _jsx(TypingDots, {}) })), h.bot && (_jsx("div", { className: "bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none prose prose-sm", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw], children: h.bot }) }))] })] })] }, i))), _jsx("div", { ref: chatEndRef })] }), _jsxs("div", { className: "p-4 border-t flex items-center gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSend(), placeholder: "Nh\u1EADp tin nh\u1EAFn...", disabled: botTyping, className: "flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100" }), _jsx("button", { onClick: handleSend, disabled: botTyping || !input.trim(), className: "p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full disabled:opacity-50", children: _jsx(Send, { size: 18 }) })] })] }));
}
