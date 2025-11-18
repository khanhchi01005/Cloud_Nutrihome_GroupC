import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RecipeCard } from "../components/RecipeCard";
import { FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown, FiSearch } from "react-icons/fi";
function removeAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}
const recipes = localStorage.getItem("recipes");
const recipesData = recipes ? JSON.parse(recipes) : [];
export default function RecipesPage() {
    const [params] = useSearchParams();
    const keyword = params.get("q")?.toLowerCase() ?? "";
    const [sortType, setSortType] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
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
                    const toSec = (t) => {
                        if (!t)
                            return 0;
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
        const pages = [];
        if (totalPages <= 6)
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }
        if (page >= totalPages - 2) {
            return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, "...", page - 1, page, page + 1, "...", totalPages];
    }
    const renderPageButton = (num) => {
        if (num === "...") {
            return (_jsx("span", { className: "px-3 py-1 text-gray-500", children: "..." }, `dot-${Math.random()}`));
        }
        return (_jsx("button", { onClick: () => setPage(num), className: `px-3 py-1 rounded-md border cursor-pointer transition 
                    ${page === num
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 text-gray-700 hover:bg-blue-100"}`, children: num }, num));
    };
    const sortOptions = [
        { key: "name", label: "A - Z" },
        { key: "carbs", label: "Carbs" },
        { key: "protein", label: "Protein" },
        { key: "fat", label: "Fat" },
        { key: "time", label: "Thời gian" },
    ];
    const toggleSort = (key) => {
        if (sortType === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        }
        else {
            setSortType(key);
            setSortOrder("asc");
        }
    };
    return (_jsxs("div", { className: "px-4 py-6 pt-27 container mx-auto", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4", children: [_jsxs("h2", { className: "text-lg font-semibold", children: ["\u0110\u00E3 t\u00ECm th\u1EA5y ", _jsx("span", { className: "text-blue-600", children: filteredRecipes.length }), " m\u00F3n \u0103n", keyword && _jsxs("span", { className: "text-gray-600", children: [" cho t\u1EEB kh\u00F3a \"", _jsx("b", { children: keyword }), "\""] })] }), filteredRecipes.length > 0 && (_jsx("div", { className: "flex gap-2 mt-3 sm:mt-0", children: sortOptions.map((btn) => (_jsxs("button", { onClick: () => toggleSort(btn.key), className: `px-3 py-1 border rounded-md text-sm flex items-center gap-1 cursor-pointer transition
                                ${sortType === btn.key
                                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-blue-100"}`, children: [sortType === btn.key &&
                                    (sortOrder === "asc" ? (_jsx(FiArrowUp, { size: 14 })) : (_jsx(FiArrowDown, { size: 14 }))), btn.label] }, btn.key))) }))] }), filteredRecipes.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-gray-600", children: [_jsx(FiSearch, { className: "text-7xl mb-4 opacity-70" }), _jsx("p", { className: "text-xl font-semibold", children: "Kh\u00F4ng t\u00ECm th\u1EA5y m\u00F3n \u0103n ph\u00F9 h\u1EE3p" }), keyword && (_jsxs("p", { className: "mt-1 text-gray-500", children: ["Kh\u00F4ng c\u00F3 k\u1EBFt qu\u1EA3 cho t\u1EEB kh\u00F3a \"", _jsx("b", { children: keyword }), "\""] }))] })), filteredRecipes.length > 0 && (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-6 gap-4", children: currentPageItems.map((r) => (_jsx(RecipeCard, { recipe: r }, r.name))) })), filteredRecipes.length > 0 && totalPages > 1 && (_jsxs("div", { className: "flex justify-center items-center gap-2 mt-6", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage(page - 1), className: "p-2 rounded-md disabled:opacity-20 cursor-pointer hover:bg-blue-100 transition", children: _jsx(FiChevronLeft, { size: 18 }) }), getPageNumbers().map(renderPageButton), _jsx("button", { disabled: page === totalPages, onClick: () => setPage(page + 1), className: "p-2 rounded-md disabled:opacity-20 cursor-pointer hover:bg-blue-100 transition", children: _jsx(FiChevronRight, { size: 18 }) })] }))] }));
}
