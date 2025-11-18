import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FiPhone, FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
const parseContact = (contactStr) => {
    if (!contactStr)
        return {};
    const result = {};
    contactStr.split(",").forEach((part) => {
        const idx = part.indexOf(":");
        if (idx === -1)
            return;
        const key = part.slice(0, idx).trim();
        const value = part.slice(idx + 1).trim(); // giữ nguyên phần sau
        if (key && value) {
            result[key.toLowerCase()] = value;
        }
    });
    return result;
};
export default function ContactInfo({ contact }) {
    const info = parseContact(contact);
    //   console.log("Contact string:", contact);
    //   console.log("Parsed contact info:", info);
    // nếu rỗng thì không render gì
    if (!Object.keys(info).length)
        return null;
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [info.tel && (_jsxs("a", { href: `tel:${info.tel}`, className: "flex items-center gap-1 text-blue-500 hover:underline", children: [_jsx(FiPhone, {}), " ", info.tel] })), info.facebook && (_jsx("a", { href: info.facebook, target: "_blank", rel: "noreferrer", className: "text-blue-500", children: _jsx(FiFacebook, { size: 20 }) })), info.tiktok && (_jsx("a", { href: info.tiktok, target: "_blank", rel: "noreferrer", className: "text-blue-500", children: _jsx(SiTiktok, { size: 20 }) })), info.youtube && (_jsx("a", { href: info.youtube, target: "_blank", rel: "noreferrer", className: "text-blue-500", children: _jsx(FiYoutube, { size: 20 }) })), info.instagram && (_jsx("a", { href: info.instagram, target: "_blank", rel: "noreferrer", className: "text-blue-500", children: _jsx(FiInstagram, { size: 20 }) }))] }));
}
