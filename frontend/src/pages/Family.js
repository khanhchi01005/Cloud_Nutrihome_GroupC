import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/FamilyPage.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import FamilyMemberCard from "../components/family/FamilyMemberCard";
import { useGetFamilyMembers, useLookupUserByUsername, useAddUserToFamily } from "../hooks/family_hooks";
export default function FamilyPage() {
    const FAMILY_ID = 1;
    const [open, setOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
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
        if (!keyword)
            return;
        lookupUser(keyword);
        setSelectedUserId(null);
    };
    const handleAddMember = async () => {
        if (!selectedUserId)
            return;
        await addUserToFamily(FAMILY_ID, selectedUserId);
        await getFamilyMembers(FAMILY_ID);
        setOpen(false);
        setSearchKeyword("");
        setSelectedUserId(null);
    };
    const getAvatarUrl = (username, avatar) => avatar || `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`;
    return (_jsxs("div", { className: "px-4 py-6 container mx-auto mt-27", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Ch\u00E0o m\u1EEBng \u0111\u1EBFn v\u1EDBi gia \u0111\u00ECnh c\u1EE7a b\u1EA1n" }), _jsx("p", { className: "text-gray-500 mb-6", children: "Qu\u1EA3n l\u00FD th\u00E0nh vi\u00EAn v\u00E0 theo d\u00F5i dinh d\u01B0\u1EE1ng d\u1EC5 d\u00E0ng." }), _jsx(Button, { className: "cursor-pointer", onClick: () => setOpen(true), children: "+ Th\u00EAm th\u00E0nh vi\u00EAn" }), _jsx(Dialog, { open: open, onOpenChange: setOpen, children: _jsxs(DialogContent, { className: "max-w-lg", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Th\u00EAm th\u00E0nh vi\u00EAn" }) }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Input, { className: "flex-[8]" // 70%
                                    , placeholder: "Nh\u1EADp username", value: searchKeyword, onChange: (e) => setSearchKeyword(e.target.value) }), _jsx(Button, { className: "flex-[2] cursor-pointer" // 30%
                                    , onClick: handleSearch, disabled: loadingSearch, children: loadingSearch ? "Đang tìm..." : "Tìm kiếm" })] }), user && (_jsxs("div", { className: `mt-4 flex items-center gap-3 p-3 border rounded-xl cursor-pointer 
            ${selectedUserId === user.user_id ? "bg-blue-50 border-blue-400" : "bg-white"}`, onClick: () => setSelectedUserId(prev => prev === user.user_id ? null : user.user_id), children: [_jsx("img", { src: getAvatarUrl(user.username, user.avatar), className: "w-12 h-12 rounded-full object-cover" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-semibold", children: user.fullname || user.username }), _jsxs("p", { className: "text-gray-500 text-sm", children: ["@", user.username] })] }), _jsx("input", { type: "checkbox", checked: selectedUserId === user.user_id, readOnly: true, className: "cursor-pointer" })] })), _jsx(Button, { disabled: !selectedUserId || addingUser, className: "mt-4 w-full cursor-pointer", onClick: handleAddMember, children: addingUser ? "Đang thêm..." : "Thêm thành viên" })] }) }), _jsxs("div", { className: "mt-10 space-y-4", children: [loadingMembers && _jsx("p", { children: "\u0110ang t\u1EA3i th\u00E0nh vi\u00EAn..." }), !loadingMembers && members.length === 0 && _jsx("p", { children: "Ch\u01B0a c\u00F3 th\u00E0nh vi\u00EAn n\u00E0o." }), members.map((member) => (_jsx(FamilyMemberCard, { member: {
                            ...member,
                            avatar: getAvatarUrl(member.username, member.avatar)
                        } }, member.user_id)))] })] }));
}
