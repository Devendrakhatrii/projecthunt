export type Bookmark = {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};


export type BookmarkItem = {
  id: number;
  bookmark_id: number;
  project_id: number;
  created_at: string;
  updated_at: string;
};