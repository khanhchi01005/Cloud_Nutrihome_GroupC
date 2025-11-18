import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RecipeCard } from "../components/RecipeCard";
import type { Recipe } from "../components/RecipeCard";
import {
    FiChevronLeft,
    FiChevronRight,
    FiArrowUp,
    FiArrowDown,
    FiSearch
} from "react-icons/fi";

function removeAccents(str: string) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

const recipes = localStorage.getItem("recipes");
const recipesData: Recipe[] = recipes ? JSON.parse(recipes) : [];

export default function RecipesPage() {
    const [params] = useSearchParams();
    const keyword = params.get("q")?.toLowerCase() ?? "";

    const [sortType, setSortType] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

    const pageSize = 18;

    // 🔥 FILTER theo keyword
    const keywordNoAccent = removeAccents(keyword.toLowerCase());

    const filteredRecipes = keyword
        ? recipesData.filter((r) => {
            const nameNoAccent = removeAccents(r.name.toLowerCase());
            return nameNoAccent.includes(keywordNoAccent);
        })
        : recipesData;

    const totalPages = Math.ceil(filteredRecipes.length / pageSize);

    // ---- SORT ----
    const sorted = [...filteredRecipes].sort((a, b) => {
        const val = (() => {
            switch (sortType) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "carbs":
                    return (a.carbs ?? 0) - (b.carbs ?? 0);
                case "protein":
                    return (a.protein ?? 0) - (b.protein ?? 0);
                case "fat":
                    return (a.fat ?? 0) - (b.fat ?? 0);
                case "time": {
                    const toSec = (t: string | undefined) => {
                        if (!t) return 0;
                        const [h, m, s] = t.split(":").map(Number);
                        return h * 3600 + m * 60 + s;
                    };
                    return toSec(a.cooking_time) - toSec(b.cooking_time);
                }
                default:
                    return 0;
            }
        })();

        return sortOrder === "asc" ? val : -val;
    });

    const currentPageItems = sorted.slice((page - 1) * pageSize, page * pageSize);

    // ---- RENDER PAGINATION (max 6 ô) ----
    function getPageNumbers() {
        const pages: (number | string)[] = [];

        if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);

        if (page <= 3) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (page >= totalPages - 2) {
            return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, "...", page - 1, page, page + 1, "...", totalPages];
    }

    const renderPageButton = (num: number | string) => {
        if (num === "...") {
            return (
                <span key={`dot-${Math.random()}`} className="px-3 py-1 text-gray-500">
                    ...
                </span>
            );
        }

        return (
            <button
                key={num}
                onClick={() => setPage(num as number)}
                className={`px-3 py-1 rounded-md border cursor-pointer transition 
                    ${page === num
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 text-gray-700 hover:bg-blue-100"
                    }`}
            >
                {num}
            </button>
        );
    };

    const sortOptions = [
        { key: "name", label: "A - Z" },
        { key: "carbs", label: "Carbs" },
        { key: "protein", label: "Protein" },
        { key: "fat", label: "Fat" },
        { key: "time", label: "Thời gian" },
    ];

    const toggleSort = (key: string) => {
        if (sortType === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortType(key);
            setSortOrder("asc");
        }
    };

    return (
        <div className="px-4 py-6 pt-27 container mx-auto">

            {/* ---- Kết quả tìm kiếm ---- */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                    Đã tìm thấy <span className="text-blue-600">{filteredRecipes.length}</span> món ăn
                    {keyword && <span className="text-gray-600"> cho từ khóa "<b>{keyword}</b>"</span>}
                </h2>

                {/* SORT hidden when no items */}
                {filteredRecipes.length > 0 && (
                    <div className="flex gap-2 mt-3 sm:mt-0">
                        {sortOptions.map((btn) => (
                            <button
                                key={btn.key}
                                onClick={() => toggleSort(btn.key)}
                                className={`px-3 py-1 border rounded-md text-sm flex items-center gap-1 cursor-pointer transition
                                ${sortType === btn.key
                                        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                                        : "border-gray-300 text-gray-700 hover:bg-blue-100"
                                    }`}
                            >
                                {sortType === btn.key &&
                                    (sortOrder === "asc" ? (
                                        <FiArrowUp size={14} />
                                    ) : (
                                        <FiArrowDown size={14} />
                                    ))}

                                {btn.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ❌ Không tìm thấy món ăn */}
            {filteredRecipes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                    <FiSearch className="text-7xl mb-4 opacity-70" />
                    <p className="text-xl font-semibold">Không tìm thấy món ăn phù hợp</p>
                    {keyword && (
                        <p className="mt-1 text-gray-500">
                            Không có kết quả cho từ khóa "<b>{keyword}</b>"
                        </p>
                    )}
                </div>
            )}

            {/* ---- GRID MÓN ĂN ---- */}
            {filteredRecipes.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                    {currentPageItems.map((r) => (
                        <RecipeCard key={r.name} recipe={r} />
                    ))}
                </div>
            )}

            {/* ---- Pagination ---- */}
            {filteredRecipes.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="p-2 rounded-md disabled:opacity-20 cursor-pointer hover:bg-blue-100 transition"
                    >
                        <FiChevronLeft size={18} />
                    </button>

                    {getPageNumbers().map(renderPageButton)}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="p-2 rounded-md disabled:opacity-20 cursor-pointer hover:bg-blue-100 transition"
                    >
                        <FiChevronRight size={18} />
                    </button>
                </div>
            )}

        </div>
    );
}
