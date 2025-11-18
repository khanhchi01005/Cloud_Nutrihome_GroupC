import { useMutation } from "@tanstack/react-query";
import axios from "axios";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});
// --------- API Call ---------
const askChat = async (question, history = []) => {
    const { data } = await axiosInstance.post("/chat/ask", {
        question,
        history,
    });
    return data;
};
// --------- Hook ---------
export const useChatAsk = () => {
    return useMutation({
        mutationFn: ({ question, history }) => askChat(question, history),
    });
};
