import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiCpu, FiGift, FiTarget, FiBarChart2, FiPackage, FiFileText } from "react-icons/fi";
import ChatBox from "./ChatBox";

const features = [
  { name: "Cửa hàng", route: "/search?type=shop", icon: <FiShoppingBag /> },
  { name: "Sản phẩm", route: "/search?type=product", icon: <FiPackage /> },
  { name: "AI gợi ý", isChat: true, icon: <FiCpu /> }, // đánh dấu mở chat
  { name: "Voucher", route: "/voucher", icon: <FiGift /> },
  { name: "Minigame", route: "/game", icon: <FiTarget /> },
  { name: "Bảng xếp hạng", route: "/ranking", icon: <FiBarChart2 /> },
  { name: "Bài viết", route: "/posts", icon: <FiFileText /> },
];

export default function FeatureCards() {
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="relative">
      {/* Grid các tính năng */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 my-6">
        {features.map((f, i) =>
          f.isChat ? (
            <div
              key={i}
              onClick={() => setOpenChat(true)}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg 
                        hover:scale-105 transition transform duration-300 p-4 flex flex-col 
                        items-center text-center cursor-pointer"
            >
              <div className="text-3xl text-blue-600 mb-2">{f.icon}</div>
              <p className="font-bold text-base">{f.name}</p>
            </div>
          ) : (
            <Link
              key={i}
              to={f.route!}   //  <- route chắc chắn có
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg 
                        hover:scale-105 transition transform duration-300 p-4 flex flex-col 
                        items-center text-center cursor-pointer"
            >
              <div className="text-3xl text-blue-600 mb-2">{f.icon}</div>
              <p className="font-bold text-base">{f.name}</p>
            </Link>
          )
        )}
      </div>

      {/* Chatbox nutrihome */}
      {openChat && (
        <div className="fixed bottom-20 right-18 w-96 h-[510px] z-50">
          <ChatBox onClose={() => setOpenChat(false)} />
        </div>
      )}
    </div>
  );
}
