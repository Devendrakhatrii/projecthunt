import axiosInstance from "@/lib/axiosInstance";

export async function getNotifications(page = 1) {
  const res = await axiosInstance.get(`/notifications?page=${page}`);
  return res.data.data;
}

export async function markNotificationAsRead(id: number) {
  const res = await axiosInstance.post(`/notifications/${id}/read`);
  return res.data.data;
}
