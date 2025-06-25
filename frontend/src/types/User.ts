export type User = {
  id: number;
  name: string;
  email: string;
  user_name: string;
  role: "user" | "admin";
  bio: string | null;
  picture: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: number;
  name: string;
  user_name: string;
  role: string;
  bio: string;
  picture?: string;
  created_at: string;
  projects: any[];
  followers: {
    id: number;
    name: string;
    user_name: string;
    picture?: string;
  }[];
  following: {
    id: number;
    name: string;
    user_name: string;
    picture?: string;
  }[];
  followers_count?: number;
  following_count?: number;
  is_followed?: boolean;
};
