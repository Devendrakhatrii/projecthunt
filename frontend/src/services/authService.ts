import axiosInstance from "@/lib/axiosInstance";

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  user_name: string;
  role: string;
  bio?: string;
  picture?: string;
};

export async function signIn(payload: SignInPayload) {
  const res = await axiosInstance.post("/signin", payload);
  return res.data.data; // { user, token }
}

export async function signUp(payload: SignUpPayload) {
  const res = await axiosInstance.post("/signup", payload);
  return res.data.data; // { user,token}
}
