import type { Idea } from "@/types";
import api from "./axios";

const fetchIdea = async (limit?: number): Promise<Idea[]> => {
  const res = await api.get("/ideas", {
    params: limit ? { _limit: limit } : {},
  });
  return res.data;
};
export default fetchIdea;

export const createIdea = async (newIdea: {
  title: string;
  summary: string;
  description: string;
  tags: string[];
}): Promise<Idea> => {
  const res = await api.post("/ideas", {
    ...newIdea,
  });
  return res.data;
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
  await api.delete(`/ideas/${ideaId}`);
};

export const updateIdea = async (
  ideaId: string,
  updatedIdea: {
    title: string;
    summary: string;
    description: string;
    tags: string[];
  }
): Promise<Idea> => {
  const res = await api.put(`/ideas/${ideaId}`, {
    ...updatedIdea,
  });
  return res.data;
};
