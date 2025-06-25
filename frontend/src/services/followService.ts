import axiosInstance from "@/lib/axiosInstance";

export async function followUser(userId: number) {
  return axiosInstance.post(`/follow/${userId}`);
}

export async function unfollowUser(userId: number) {
  return axiosInstance.delete(`/unfollow/${userId}`);
}
