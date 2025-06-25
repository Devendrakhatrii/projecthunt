export type Story = {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[]; // parse from JSON if needed
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};
