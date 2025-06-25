import axiosInstance from "@/lib/axiosInstance";

export async function getUserByUserName(userName: string) {
  const res = await axiosInstance.get(`/users/username/${userName}`);
  return res.data;
}
