import React, { useState } from "react";
import { MessageCircle } from "lucide-react"; // icon đẹp hơn
import ChatBox from "./ChatBox";

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer fixed bottom-6 right-6 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-20 right-18 w-96 h-[510px] z-50">
          <ChatBox onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
