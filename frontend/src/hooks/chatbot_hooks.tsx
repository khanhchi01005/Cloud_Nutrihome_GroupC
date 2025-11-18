import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// --------- Types ---------
export interface ChatHistoryItem {
  user: string;
  bot: string;
}

export interface ChatResponse {
  question: string;
  normalized: string;
  filters: {
    type: string;
    city: string;
  };
  results: any[];
  answer: string;
}

// --------- API Call ---------
const askChat = async (question: string, history: ChatHistoryItem[] = []) => {
  const { data } = await axiosInstance.post<ChatResponse>("/chat/ask", {
    question,
    history,
  });
  return data;
};

// --------- Hook ---------
export const useChatAsk = () => {
  return useMutation({
    mutationFn: ({ question, history }: { question: string; history: ChatHistoryItem[] }) =>
      askChat(question, history),
  });
};
