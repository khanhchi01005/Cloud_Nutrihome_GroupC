export default function NutritionTable({ calories, carbs, fat, protein }) {
    return (
        <div className="border border-blue-500 rounded-xl p-4 w-full max-w-xs">
            <h3 className="text-base font-semibold mb-3">Hàm lượng dinh dưỡng của bữa ăn</h3>
            <table className="text-sm w-full table-fixed">
                <tbody className="space-y-2">
                    <tr className="flex justify-between">
                        <td className="font-semibold">Kcal:</td>
                        <td className="text-right">{calories} kcal</td>
                    </tr>
                    <tr className="flex justify-between">
                        <td className="font-semibold">Carbs:</td>
                        <td className="text-right">{carbs} g</td>
                    </tr>
                    <tr className="flex justify-between">
                        <td className="font-semibold">Fat:</td>
                        <td className="text-right">{fat} g</td>
                    </tr>
                    <tr className="flex justify-between">
                        <td className="font-semibold">Protein:</td>
                        <td className="text-right">{protein} g</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
