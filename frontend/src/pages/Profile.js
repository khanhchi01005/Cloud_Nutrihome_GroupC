import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";

export default function Profile() {
    const { user, setUser, logout } = useContext(AuthContext);
    const [fullname, setFullname] = useState(user?.fullname || "");
    const [height, setHeight] = useState(user?.height || "");
    const [weight, setWeight] = useState(user?.weight || "");
    const [activityLevel, setActivityLevel] = useState(user?.activity_level || "");
    const [disease, setDisease] = useState(user?.disease || "");
    const [allergen, setAllergen] = useState(user?.allergen || "");
    const [dob, setDob] = useState(user?.dob || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [statusMsg, setStatusMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.user_id) {
            setStatusMsg("User not found");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user.user_id);
        formData.append("fullname", fullname);
        formData.append("height", height);
        formData.append("weight", weight);
        formData.append("activity_level", activityLevel);
        formData.append("disease", disease);
        formData.append("allergen", allergen);
        formData.append("dob", dob);

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        try {
            const res = await fetch(`${API_BASE_URL}/api/personal/update`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.status === "success") {
                setStatusMsg("Cập nhật thành công! Vui lòng đăng nhập lại...");

                // Cho user thấy thông báo 1 giây rồi logout
                setTimeout(() => {
                    logout();           // xoá token, clear AuthContext
                    window.location.href = "/login"; // chuyển hướng về trang đăng nhập
                }, 1200);

            } else {
                setStatusMsg(data.message || "Lỗi cập nhật");
            }
        } catch (err) {
            console.error(err);
            setStatusMsg("Network error");
        }
    };

    return _jsxs(_Fragment, {
        children: [
            _jsx("div", {
                className: "min-h-screen flex justify-center items-center bg-gray-100 px-4 mt-20",
                children: _jsxs("div", {
                    className: "bg-white shadow-xl rounded-xl p-8 w-full max-w-lg",
                    children: [

                        // AVATAR SECTION
                        _jsxs("div", {
                            className: "flex flex-col items-center mb-6",
                            children: [
                                _jsx("img", {
                                    src: avatarFile
                                        ? URL.createObjectURL(avatarFile)
                                        : (user?.avatar || "/default-avatar.png"),
                                    className: "w-32 h-32 rounded-full object-cover shadow mb-3",
                                    alt: "Avatar"
                                }),

                                // FILE PICKER BUTTON
                                _jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        _jsx("label", {
                                            className: "bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300 transition text-sm",
                                            children: _jsxs(_Fragment, {
                                                children: [
                                                    "Chọn ảnh",
                                                    _jsx("input", {
                                                        type: "file",
                                                        accept: "image/*",
                                                        className: "hidden",
                                                        onChange: (e) => {
                                                            if (e.target.files[0]) {
                                                                setAvatarFile(e.target.files[0]);
                                                            }
                                                        }
                                                    })
                                                ]
                                            })
                                        }),

                                        // SHOW SELECTED FILE NAME
                                        avatarFile
                                            ? _jsx("span", { className: "text-sm text-gray-600", children: avatarFile.name })
                                            : _jsx("span", { className: "text-sm text-gray-400", children: "Chưa chọn ảnh" })
                                    ]
                                })
                            ]
                        }),

                        // FORM START
                        _jsxs("form", {
                            onSubmit: handleSubmit,
                            className: "flex flex-col gap-4",
                            children: [

                                _jsxs("label", {
                                    className: "flex flex-col text-sm",
                                    children: [
                                        "Họ và tên",
                                        _jsx("input", {
                                            type: "text",
                                            value: fullname,
                                            onChange: e => setFullname(e.target.value),
                                            className: "border px-3 py-2 rounded-lg mt-1"
                                        })
                                    ]
                                }),

                                _jsxs("label", {
                                    className: "flex flex-col text-sm",
                                    children: [
                                        "Ngày sinh",
                                        _jsx("input", {
                                            type: "date",
                                            value: dob,
                                            onChange: e => setDob(e.target.value),
                                            className: "border px-3 py-2 rounded-lg mt-1"
                                        })
                                    ]
                                }),

                                _jsxs("div", {
                                    className: "flex gap-4",
                                    children: [
                                        _jsxs("label", {
                                            className: "flex flex-col text-sm w-1/2",
                                            children: [
                                                "Chiều cao (cm)",
                                                _jsx("input", {
                                                    type: "number",
                                                    value: height,
                                                    onChange: e => setHeight(e.target.value),
                                                    className: "border px-3 py-2 rounded-lg mt-1"
                                                })
                                            ]
                                        }),
                                        _jsxs("label", {
                                            className: "flex flex-col text-sm w-1/2",
                                            children: [
                                                "Cân nặng (kg)",
                                                _jsx("input", {
                                                    type: "number",
                                                    value: weight,
                                                    onChange: e => setWeight(e.target.value),
                                                    className: "border px-3 py-2 rounded-lg mt-1"
                                                })
                                            ]
                                        })
                                    ]
                                }),

                                _jsxs("label", {
                                    className: "flex flex-col text-sm",
                                    children: [
                                        "Mức độ hoạt động",
                                        _jsx("input", {
                                            type: "text",
                                            value: activityLevel,
                                            onChange: e => setActivityLevel(e.target.value),
                                            className: "border px-3 py-2 rounded-lg mt-1"
                                        })
                                    ]
                                }),

                                _jsxs("label", {
                                    className: "flex flex-col text-sm",
                                    children: [
                                        "Bệnh lý",
                                        _jsx("input", {
                                            type: "text",
                                            value: disease,
                                            onChange: e => setDisease(e.target.value),
                                            className: "border px-3 py-2 rounded-lg mt-1"
                                        })
                                    ]
                                }),

                                _jsxs("label", {
                                    className: "flex flex-col text-sm",
                                    children: [
                                        "Dị ứng",
                                        _jsx("input", {
                                            type: "text",
                                            value: allergen,
                                            onChange: e => setAllergen(e.target.value),
                                            className: "border px-3 py-2 rounded-lg mt-1"
                                        })
                                    ]
                                }),

                                _jsx("button", {
                                    type: "submit",
                                    className: "bg-blue-600 text-white py-2 rounded-lg mt-2 hover:bg-blue-700 transition cursor-pointer",
                                    children: "Cập nhật"
                                }),

                                _jsx("p", {
                                    className: "text-center text-sm text-red-500 mt-2",
                                    children: statusMsg
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });

}
