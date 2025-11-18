import { useState } from "react";
import { apiGet, apiPost } from "../api"; // đổi path tùy dự án của bạn

export function useGetFamilyMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFamilyMembers = async (family_id: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<{ members?: any[] }>(
        `/api/family/get_family_members?family_id=${family_id}`
      );
      setMembers(res.members || []); // <-- dùng res.members
      console.log("Family members:", res.members);
    } catch (err: any) {
      setError(err.message || "Error loading family members");
    } finally {
      setLoading(false);
    }
  };

  return { members, loading, error, getFamilyMembers };
}

export function useLookupUserByUsername() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupUser = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<{ user?: any }>(
        `/api/family/lookup_user_by_username?username=${username}`
      );
      setUser(res.user || null); // <-- đảm bảo luôn là object hoặc null
    } catch (err: any) {
      setError(err.message || "Error finding user");
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, lookupUser };
}

export function useAddUserToFamily() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addUserToFamily = async (family_id: number, user_id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiPost<{ message?: string }>(
        "/api/family/add_user_to_family",
        {
          family_id,
          user_id,
        }
      );

      setSuccess(res.message || "User added to family successfully");
    } catch (err: any) {
      setError(err.message || "Error adding user to family");
    } finally {
      setLoading(false);
    }
  };

  return { addUserToFamily, loading, error, success };
}
