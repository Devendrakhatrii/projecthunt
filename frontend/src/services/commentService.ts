import axiosInstance from "@/lib/axiosInstance";
import { Comment } from "@/types/Comment";

// export async function fetchComments(
//   type: "project" | "story",
//   id: number
// ): Promise<Comment[]> {
//   const res = await axiosInstance.get(`/comments/${type}/${id}`);
//   // Map API response to frontend structure if needed
//   return res.data.data.data.map(mapApiCommentToComment);
// }

// commentService.ts
export async function fetchComments(type: string, id: number) {
  const res = await axiosInstance.get(`/comments/${type}/${id}`);
  return res.data.data; // <-- Only return the array of comments
}
export async function postComment(
  type: "project" | "story",
  id: number,
  body: string,
  parent_id?: number
): Promise<Comment> {
  const res = await axiosInstance.post("/comments", {
    type,
    id,
    body,
    parent_id,
  });
  return mapApiCommentToComment(res.data.data);
}

// Helper to map API comment to frontend structure
function mapApiCommentToComment(apiComment: any): Comment {
  return {
    id: apiComment.id,
    body: apiComment.body,
    created_at: apiComment.created_at,
    user: {
      id: apiComment.user.id,
      name: apiComment.user.name,
      picture: apiComment.user.picture,
    },
    replies: (apiComment.replies || []).map((reply: any) => ({
      id: reply.id,
      body: reply.body,
      created_at: reply.created_at,
      user: {
        id: reply.user.id,
        name: reply.user.name,
        picture: reply.user.picture,
      },
    })),
  };
}
