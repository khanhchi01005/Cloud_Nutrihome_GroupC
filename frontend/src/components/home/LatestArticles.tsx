import { FiBookOpen, FiUser, FiCalendar } from "react-icons/fi";

interface Post {
    title: string;
    summary: string;
    image: string;
    author: string;
    date: string; // ISO hoặc dạng "2025-02-10"
}

interface LatestArticlesProps {
    articles: Post[];
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiBookOpen size={20} className="text-blue-600" />
                Bài viết mới
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {articles.map((art) => (
                    <div
                        key={art.title}
                        className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    >
                        <img
                            src={art.image}
                            alt={art.title}
                            className="w-full h-40 object-cover"
                        />

                        <div className="p-3">
                            {/* Title */}
                            <h3 className="font-semibold text-base line-clamp-2">
                                {art.title}
                            </h3>

                            {/* Author + Date with icons */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <FiUser size={12} />
                                    {art.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiCalendar size={12} />
                                    {art.date}
                                </span>
                            </div>

                            {/* Summary */}
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                {art.summary}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút Xem thêm */}
            <div
                className="flex justify-center mt-4 cursor-pointer"
                onClick={() => (window.location.href = "/community")}
            >
                <a className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">
                    Xem thêm
                </a>
            </div>
        </section>
    );
}
