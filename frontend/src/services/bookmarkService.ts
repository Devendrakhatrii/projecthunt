import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

type CreateBookmarkPayload = {
  project_id: number;
  bookmark_id?: number; // optional, if you want to specify a collection
};

export async function createBookmark(payload: CreateBookmarkPayload) {
  const res = await axiosInstance.post("/bookmarks", payload);
  return res.data;
}

export async function deleteBookmark(bookmarkItemId: number) {
  const res = await axiosInstance.delete(`/bookmarks/${bookmarkItemId}`);
  return res.data;
}

export async function getBookmarks() {
  const res = await axiosInstance.get("/bookmarks");
  return res.data.data;
}


