export type Notification = {
  id: number;
  user_id: number;
  message: string;
  slug: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};
