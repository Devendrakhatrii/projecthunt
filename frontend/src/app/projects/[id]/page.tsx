"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  ChevronUp,
  Bookmark,
  ExternalLink,
  ArrowLeft,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment } from "@/components/comment";
import { getProject } from "@/services/projectService";
import type { Project } from "@/types/Project";
import { format } from "date-fns";
import { toast } from "sonner";
import { ShareButton } from "@/components/share-button";
import { RequireAuthAction } from "@/components/requireAuthAction";
import { toggleUpvote } from "@/services/upvoteService";
import { createBookmark } from "@/services/bookmarkService";
import { useAuth } from "@/context/authContext";
import { BookmarkModal } from "@/components/bookmark";

export default function ProjectDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);

  // Upvote handler
  const handleUpvote = async () => {
    if (!project) return;
    try {
      await toggleUpvote("project", project?.id);
      setUpvoted((prev) => !prev);
      setUpvotes((prev) => (upvoted ? prev - 1 : prev + 1));
      toast.success(upvoted ? "Upvote removed" : "Upvoted!");
    } catch (error) {
      toast.error("Failed to upvote. Please try again.");
      // Optionally revert UI
      setUpvoted(false);
      setUpvotes((prev) => (upvoted ? prev + 1 : prev - 1));
    }
  };

  // Bookmark handler
  const handleBookmark = async () => {
    if (!project) return;
    try {
      await createBookmark({ title: "project", project_id: project.id });
      setBookmarked(true);
      toast.success("Bookmarked!");
    } catch (error) {
      toast.error("Failed to bookmark. Please try again.");
      setBookmarked(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const data = await getProject(String(params.id));
      setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [params.id]);

  useEffect(() => {
    if (project) {
      setUpvotes(project.upvotes_count || 0);
      setUpvoted(project?.is_upvoted || false);
      setBookmarked(project?.is_bookmarked || false);
    }
  }, [project]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!project || !user) return notFound();

  // if (project.user_id !== user.id) return notFound();

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">{project.title}</h1>
                        <Badge>{project.project_type}</Badge>
                      </div>
                      <p className="text-muted-foreground text-lg">
                        {project.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {user?.id == project.user_id && (
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={project.user?.picture || "/placeholder-user.jpg"}
                      />
                      <AvatarFallback>
                        {project.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/profile/${project.user?.user_name}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      @{project.user?.user_name || "unknown"}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      •{" "}
                      {project.created_at
                        ? format(new Date(project.created_at), "MMM d, yyyy")
                        : ""}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.tech_stack)
                      ? project.tech_stack.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))
                      : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Comment type="project" id={project?.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <RequireAuthAction onConfirm={handleUpvote}>
                    <Button
                      className={`w-full gap-2 transition-all ${
                        upvoted ? "bg-primary text-white" : ""
                      }`}
                      variant={upvoted ? "default" : "outline"}
                    >
                      <ChevronUp
                        className={`h-4 w-4 transition-all ${
                          upvoted ? "text-white" : "text-muted-foreground"
                        }`}
                      />
                      {upvoted ? `Upvoted (${upvotes})` : `Upvote (${upvotes})`}
                    </Button>
                  </RequireAuthAction>
                </div>

                <div>
                  <RequireAuthAction
                    onConfirm={() => setBookmarkModalOpen(true)}
                  >
                    <Button className="w-full gap-2" variant="outline">
                      <Bookmark className="h-4 w-4" />
                      Add to Bookmark
                    </Button>
                  </RequireAuthAction>
                </div>

                <div>
                  <ShareButton />
                </div>

                {project.live_url && (
                  <div>
                    <Button asChild className="w-full gap-2">
                      <Link
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Website
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Project Stats</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="font-medium">
                    {project.status ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium">{project.project_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {project.created_at
                      ? format(new Date(project.created_at), "MMM d, yyyy")
                      : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookmarkModal
        open={bookmarkModalOpen}
        onOpenChange={setBookmarkModalOpen}
        projectId={project.id}
      />
    </>
  );
}
