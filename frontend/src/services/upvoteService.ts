import axiosInstance from "@/lib/axiosInstance";

export async function toggleUpvote(
  type: "project" | "story",
  id: number | undefined
) {
  const res = await axiosInstance.post("/upvote", { type, id });
  return res.data;
}

export async function getUpvoteCount(type: "project" | "story", id: number) {
  const res = await axiosInstance.get(`/upvotes/${type}/${id}`);
  return res.data.data.count;
}
