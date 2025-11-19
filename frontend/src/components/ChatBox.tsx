import React, { useRef, useState, useEffect } from "react";
import { useChatAsk } from "../hooks/chatbot_hooks";
import { Send, Minus, Maximize2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const USER_NAME = "Long";
const USER_AVA = "/images/user/mambo.jpg";
const BOT_NAME = "nutrihome";
const BOT_AVA = "/images/Logo.png";

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

export default function ChatBox({ onClose }: { onClose: () => void }) {
  const { mutate: ask } = useChatAsk();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ user: string; bot: string }[]>(() => {
    const saved = localStorage.getItem("nutrihome_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [botTyping, setBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isLarge, setIsLarge] = useState(false); // state phóng to
  const [typingContent, setTypingContent] = useState(""); // Nội dung hiển thị tạm thời

  const handleSend = () => {
    if (!input.trim() || botTyping) return;
    const message = input.trim();
    setInput("");
    setHistory((prev) => [...prev, { user: message, bot: "" }]);
    setBotTyping(true);

    ask(
      { question: message, history },
      {
        onSuccess: (res) => {
          let index = 0;
          const text = res.answer || "";
          setTypingContent(""); // reset

          const interval = setInterval(() => {
            if (index === 0) setTypingContent(""); // clear để show TypingDots trước khi có ký tự

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
      }
    );
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    localStorage.setItem("nutrihome_history", JSON.stringify(history));
  }, [history]);


  return (
    <div
      className={`flex flex-col border rounded-lg shadow-lg bg-white transition-all duration-300 absolute bottom-0 right-0 ${isLarge ? "h-[700px] w-[600px]" : "h-[500px] w-[384px]"
        }`}
    >
      {/* Header với nút đóng và phóng to */}
      <div className="flex items-center justify-between p-4 bg-indigo-600 text-white font-semibold rounded-t-lg">
        <div className="flex items-center gap-2">
          <img src={BOT_AVA} className="w-8 h-8 rounded-full" />
          <span>nutrihome Chatbot</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Reset lịch sử chat */}
          <button
            onClick={() => {
              setHistory([]);
              localStorage.removeItem("nutrihome_history");
            }}
            className="cursor-pointer p-1 rounded-full hover:bg-indigo-500"
            aria-label="Reset lịch sử"
          >
            <RotateCcw size={18} />
          </button>
          {/* Phóng to */}
          <button
            onClick={() => setIsLarge((prev) => !prev)}
            className="cursor-pointer p-1 rounded-full hover:bg-indigo-500"
            aria-label="Phóng to"
          >
            <Maximize2 size={18} />
          </button>
          {/* Thu gọn */}
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-full hover:bg-indigo-500"
            aria-label="Thu gọn"
          >
            <Minus size={18} />
          </button>
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((h, i) => (
          <div key={i} className="space-y-2">
            {/* user bubble */}
            <div className="flex justify-end items-start gap-2">
              <div className="flex flex-col items-end max-w-[70%]">
                <span className="text-xs text-gray-500 mb-1">{USER_NAME}</span>
                <div className="bg-indigo-500 text-white px-4 py-2 rounded-2xl rounded-tr-none">
                  {h.user}
                </div>
              </div>
              <img src={USER_AVA} className="w-8 h-8 rounded-full" />
            </div>

            {/* bot bubble */}
            <div className="flex justify-start items-start gap-2">
              <img src={BOT_AVA} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col max-w-[70%]">
                <span className="text-xs text-gray-500 mb-1">{BOT_NAME}</span>

                {/* Hiển thị nội dung có sẵn của bot (câu cũ vẫn hiện) */}
                {h.bot && (
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none prose prose-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {h.bot}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Nếu là tin nhắn cuối và bot đang gõ chưa xong */}
                {i === history.length - 1 && botTyping && !h.bot && (
                  typingContent ? (
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none prose prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {typingContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 opacity-70 mb-1">
                      <TypingDots />
                    </span>
                  )
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
