"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { getBookmarks } from "@/services/bookmarkService";
import { ProjectCard } from "@/components/project-card";

type Bookmark = {
  id: number;
  title: string;
  bookmark_items: {
    id: number;
    project: any;
  }[];
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await getBookmarks();
        setBookmarks(res);
      } catch {
        setBookmarks([]);
      }
      setLoading(false);
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Bookmarks</h1>
        <Button asChild>
          <Link href="/">Browse Projects</Link>
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No bookmarks found.
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">
                  {bookmark.title || "Untitled"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {bookmark.bookmark_items.length} project
                  {bookmark.bookmark_items.length !== 1 && "s"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookmark.bookmark_items.length === 0 ? (
                <div className="text-muted-foreground">
                  No projects in this bookmark.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmark.bookmark_items.map((item) =>
                    item.project ? (
                      <ProjectCard key={item.id} project={item.project} />
                    ) : null
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
