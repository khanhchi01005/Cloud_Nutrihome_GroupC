import { FiPhone, FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";

const parseContact = (contactStr?: string) => {
  if (!contactStr) return {};
  const result: Record<string, string> = {};
  contactStr.split(",").forEach((part) => {
    const idx = part.indexOf(":");
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim(); // giữ nguyên phần sau
    if (key && value) {
      result[key.toLowerCase()] = value;
    }
  });
  return result;
};

export default function ContactInfo({ contact }: { contact?: string }) {
  const info = parseContact(contact);

//   console.log("Contact string:", contact);
//   console.log("Parsed contact info:", info);

  // nếu rỗng thì không render gì
  if (!Object.keys(info).length) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {info.tel && (
        <a
          href={`tel:${info.tel}`}
          className="flex items-center gap-1 text-blue-500 hover:underline"
        >
          <FiPhone /> {info.tel}
        </a>
      )}
      {info.facebook && (
        <a
          href={info.facebook}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          <FiFacebook size={20} />
        </a>
      )}
      {info.tiktok && (
        <a
          href={info.tiktok}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          <SiTiktok size={20} />
        </a>
      )}
      {info.youtube && (
        <a
          href={info.youtube}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          <FiYoutube size={20} />
        </a>
      )}
      {info.instagram && (
        <a
          href={info.instagram}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          <FiInstagram size={20} />
        </a>
      )}
    </div>
  );
}
