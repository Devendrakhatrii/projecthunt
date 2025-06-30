import { Upvote } from "./Upvote";
import { User } from "./User";

export type Project = {
  id?: number;
  user_id?: number;
  title: string;
  tech_stack: string[]; // parse from comma-separated string if needed
  description: string;
  repo_url: string | null;
  live_url: string | null;
  status: boolean;
  project_type?: "personal" | "client" | "open-source";
  created_at?: string;
  updated_at?: string;
  user?: User;
  comments_count?: number;
  upvotes_count?: number;
  is_upvoted?: boolean;
  is_bookmarked?: boolean;
};
