import { useState } from "react";
import { FiAlertCircle, FiUpload, FiLoader, FiSearch } from "react-icons/fi";
import { useScanAllergen } from "../hooks/ingredient_safety_hooks"; // <-- import hook

interface Ingredient {
    name: string;
}

export default function IngredientSafetyPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[] | null>(null);

    const { scanAllergen, loading, error } = useScanAllergen();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setIngredients(null); // reset khi chọn ảnh mới
        }
    };

    const handleScan = async () => {
        if (!selectedFile) return;
        const result = await scanAllergen(selectedFile);
        setIngredients(result.map(name => ({ name })));
    };

    return (
        <div className="container mx-auto px-4 py-6 pt-27">
            <div className="flex gap-6">

                {/* Left: Upload & Scan */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow flex flex-col">
                    <h2 className="text-xl font-bold mb-2">Tải ảnh nguyên liệu</h2>
                    <p className="text-gray-600 mb-4">
                        Chọn ảnh nguyên liệu để quét thành phần gây dị ứng.
                    </p>

                    {/* Box Upload & Preview */}
                    <div className="w-full h-62 bg-gray-100 rounded-lg border border-dashed relative flex items-center justify-center mb-4 overflow-hidden">
                        {selectedFile ? (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                className="w-full h-full object-contain bg-black"
                            />
                        ) : (
                            <label className="flex flex-col items-center justify-center absolute inset-0 cursor-pointer">
                                <FiUpload className="text-4xl mb-2 text-gray-500" />
                                <span className="text-gray-700 font-semibold">Chọn ảnh...</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="w-full flex gap-4 mt-2">
                        <label
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 bg-white rounded-md cursor-pointer hover:bg-blue-600 hover:text-white transition"
                        >
                            <FiUpload className="text-xl" />
                            <span className="font-semibold">Upload ảnh</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        <button
                            onClick={handleScan}
                            disabled={!selectedFile || loading}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white transition cursor-pointer
                ${selectedFile && !loading ? "bg-blue-600 hover:bg-blue-800" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                            <FiSearch />
                            <span>{loading ? "Đang quét..." : "Quét nguyên liệu"}</span>
                        </button>
                    </div>
                </div>

                {/* Right: Allergens List */}
                <div className="flex-2 bg-white p-6 rounded-lg shadow min-h-[300px] flex flex-col">
                    <h2 className="text-xl font-bold mb-2">Nguyên liệu dị ứng</h2>
                    <p className="text-gray-600 mb-4">
                        Danh sách các nguyên liệu có thể gây dị ứng với người dùng dựa trên ảnh đã quét.
                    </p>

                    <div className="flex-1 bg-gray-50 rounded p-4 overflow-y-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
                                <p className="text-lg font-semibold text-gray-600">Đang quét...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full text-red-500">
                                <FiAlertCircle className="text-5xl mb-4" />
                                <p className="text-lg font-semibold">{error}</p>
                            </div>
                        ) : ingredients === null ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <FiAlertCircle className="text-5xl mb-4" />
                                <p className="text-lg font-semibold">Chưa quét nguyên liệu</p>
                            </div>
                        ) : ingredients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-green-500">
                                <FiAlertCircle className="text-5xl mb-4" />
                                <p className="text-lg font-semibold">Không có nguyên liệu gây dị ứng</p>
                            </div>
                        ) : (
                            <ul className="list-disc pl-6 space-y-2 h-70 overflow-y-auto">
                                {ingredients.map((ing, idx) => (
                                    <li key={idx} className="text-gray-700 font-medium">{ing.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
