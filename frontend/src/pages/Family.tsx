// src/pages/FamilyPage.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import FamilyMemberCard from "../components/family/FamilyMemberCard";
import {
    useGetFamilyMembers,
    useLookupUserByUsername,
    useAddUserToFamily
} from "../hooks/family_hooks";

export default function FamilyPage() {
    const FAMILY_ID = 1;

    const [open, setOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    // --- Hooks API ---
    const { members, loading: loadingMembers, getFamilyMembers } = useGetFamilyMembers();
    const { user, loading: loadingSearch, lookupUser } = useLookupUserByUsername();
    const { addUserToFamily, loading: addingUser } = useAddUserToFamily();

    // Load danh sách thành viên khi vào trang
    useEffect(() => {
        getFamilyMembers(FAMILY_ID);
    }, []);

    // --- Handlers ---
    const handleSearch = () => {
        const keyword = searchKeyword.trim();
        if (!keyword) return;
        lookupUser(keyword);
        setSelectedUserId(null);
    };

    const handleAddMember = async () => {
        if (!selectedUserId) return;

        await addUserToFamily(FAMILY_ID, selectedUserId);
        await getFamilyMembers(FAMILY_ID);

        setOpen(false);
        setSearchKeyword("");
        setSelectedUserId(null);
    };

    const getAvatarUrl = (username: string, avatar?: string | null) =>
        avatar || `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`;

    return (
        <div className="px-4 py-6 container mx-auto mt-27">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-2">Chào mừng đến với gia đình của bạn</h1>
            <p className="text-gray-500 mb-6">Quản lý thành viên và theo dõi dinh dưỡng dễ dàng.</p>

            {/* Thêm thành viên */}
            <Button className="cursor-pointer" onClick={() => setOpen(true)}>+ Thêm thành viên</Button>

            {/* Dialog thêm thành viên */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Thêm thành viên</DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-2 mt-4">
                        <Input
                            className="flex-[8]" // 70%
                            placeholder="Nhập username"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <Button
                            className="flex-[2] cursor-pointer" // 30%
                            onClick={handleSearch}
                            disabled={loadingSearch}
                        >
                            {loadingSearch ? "Đang tìm..." : "Tìm kiếm"}
                        </Button>
                    </div>

                    {user && (
                        <div
                            className={`mt-4 flex items-center gap-3 p-3 border rounded-xl cursor-pointer 
            ${selectedUserId === user.user_id ? "bg-blue-50 border-blue-400" : "bg-white"}`}
                            onClick={() =>
                                setSelectedUserId(prev => prev === user.user_id ? null : user.user_id)
                            }
                        >
                            <img
                                src={getAvatarUrl(user.username, user.avatar)}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{user.fullname || user.username}</p>
                                <p className="text-gray-500 text-sm">@{user.username}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedUserId === user.user_id}
                                readOnly
                                className="cursor-pointer"
                            />
                        </div>
                    )}

                    <Button
                        disabled={!selectedUserId || addingUser}
                        className="mt-4 w-full cursor-pointer"
                        onClick={handleAddMember}
                    >
                        {addingUser ? "Đang thêm..." : "Thêm thành viên"}
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Danh sách thành viên */}
            <div className="mt-10 space-y-4">
                {loadingMembers && <p>Đang tải thành viên...</p>}

                {!loadingMembers && members.length === 0 && <p>Chưa có thành viên nào.</p>}

                {members.map((member: any) => (
                    <FamilyMemberCard
                        key={member.user_id}
                        member={{
                            ...member,
                            avatar: getAvatarUrl(member.username, member.avatar)
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
