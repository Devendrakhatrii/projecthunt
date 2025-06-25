"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getBookmarks, createBookmark } from "@/services/bookmarkService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Bookmark = {
  id: number;
  title: string;
};

type BookmarkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
};

export function BookmarkModal({
  open,
  onOpenChange,
  projectId,
}: BookmarkModalProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const fetchBookmarks = async () => {
        try {
          const res = await getBookmarks();
          setBookmarks(res);
        } catch {
          setBookmarks([]);
        }
      };
      fetchBookmarks();
      setSelectedBookmarkId("");
      setNewTitle("");
      setFieldErrors({});
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!projectId) {
      toast.error("No project specified.");
      return;
    }
    setLoading(true);
    try {
      if (selectedBookmarkId) {
        await createBookmark({
          bookmark_id: Number(selectedBookmarkId),
          project_id: Number(projectId),
        });
        toast.success("Project added to bookmark!");
      } else if (newTitle.trim()) {
        await createBookmark({
          title: newTitle.trim(),
          project_id: Number(projectId),
        });
        toast.success("New bookmark created!");
      } else {
        toast.error("Please select a bookmark or enter a new title.");
        setLoading(false);
        return;
      }
      onOpenChange(false);
      router.refresh?.();
    } catch (err: any) {
      // Handle validation error
      if (
        err?.response?.data?.errors &&
        typeof err.response.data.errors === "object"
      ) {
        setFieldErrors(err.response.data.errors);
        if (err.response.data.message) {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error(
          err?.response?.data?.message || "Failed to create bookmark"
        );
      }
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle className="mb-1">Add Project to Bookmark</DialogTitle>
          <DialogDescription className="mb-4">
            Choose an existing bookmark or create a new one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="bookmark">Select Existing Bookmark</Label>
            <Select
              value={selectedBookmarkId}
              onValueChange={(val) => {
                setSelectedBookmarkId(val);
                setNewTitle("");
                setFieldErrors({});
              }}
            >
              <SelectTrigger id="bookmark" className="w-full">
                <SelectValue placeholder="Choose a bookmark" />
              </SelectTrigger>
              <SelectContent>
                {bookmarks.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.title || "Untitled"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-center text-muted-foreground my-2">or</div>
          <div className="space-y-2">
            <Label htmlFor="newTitle">Create New Bookmark</Label>
            <Input
              id="newTitle"
              placeholder="Enter new bookmark title"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                setSelectedBookmarkId("");
                setFieldErrors({});
              }}
              className="w-full"
            />
            {fieldErrors.title && (
              <div className="text-destructive text-sm mt-1">
                {fieldErrors.title.join(", ")}
              </div>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
