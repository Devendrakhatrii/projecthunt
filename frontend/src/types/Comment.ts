export type User = {
  id: number;
  name: string;
  picture: string | null;
};

export type Reply = {
  id: number;
  body: string;
  created_at: string;
  user: User;
};

export type Comment = {
  id: number;
  body: string;
  created_at: string;
  user: User;
  replies: Reply[];
};
