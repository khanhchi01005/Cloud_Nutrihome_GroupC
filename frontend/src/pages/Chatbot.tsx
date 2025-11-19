import React, { useRef, useState, useEffect } from "react";
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
  return <span>{`Đang trả lời${dots}`}</span>;
}

export default function ChatBox() {
  const { mutate: ask } = useChatAsk();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ user: string; bot: string }[]>([]);
  const [botTyping, setBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!input.trim() || botTyping) return;
    const message = input.trim();
    setInput(""); // clear ngay lập tức
    setHistory((prev) => [...prev, { user: message, bot: "" }]);
    setBotTyping(true);

    ask(
      { question: message, history },
      {
        onSuccess: (res) => {
          setHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].bot = res.answer;
            return newHistory;
          });
          setBotTyping(false);
        },
        onError: () => setBotTyping(false),
      }
    );
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className="flex flex-col h-[500px] w-full max-w-xl mx-auto border rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white font-semibold rounded-t-lg">
        Chat Tư Vấn Đặc Sản
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((h, i) => (
          <div key={i} className="space-y-2">
            {/* user bubble */}
            <div className="flex justify-end items-start gap-2">
              <div className="flex flex-col items-end max-w-[70%]">
                <span className="text-xs text-gray-500 mb-1">{USER_NAME}</span>
                <div className="bg-indigo-500 text-white px-4 py-2 rounded-2xl rounded-br-none">
                  {h.user}
                </div>
              </div>
              <img src={USER_AVA} className="w-8 h-8 rounded-full" />
            </div>

            {/* bot bubble */}
            <div className="flex justify-start items-start gap-2">
              <img src={BOT_AVA} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col max-w-[70%]">
                {/* Tên bot */}
                <span className="text-xs text-gray-500 mb-1">{BOT_NAME}</span>

                {/* Hiển thị đang trả lời ngay dưới tên */}
                {i === history.length - 1 && botTyping && (
                  <span className="text-xs text-gray-500 opacity-70 mb-1">
                    <TypingDots />
                  </span>
                )}

                {/* Nội dung trả lời */}
                {h.bot && (
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none prose prose-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {h.bot}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>

          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          disabled={botTyping}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
        />
        <button
          onClick={handleSend}
          disabled={botTyping || !input.trim()}
          className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
