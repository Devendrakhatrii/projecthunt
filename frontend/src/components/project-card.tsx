"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types/Project";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group h-full min-h-[110px]">
        <div className="relative">
          <Badge className="absolute top-3 left-3" variant="secondary">
            {project.project_type}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="space-y-1">
            <div className="flex gap-4">
              <h3 className="text-lg flex gap-4 font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {project.title}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()} // Prevents card click from triggering
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-xs">Live</span>
                  </a>
                )}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-xs">
                {project?.user?.name}
              </AvatarFallback>
            </Avatar>
            <Link
              href={`/profile/${project.user?.user_name}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              @{project.user?.user_name || "unknown"}
            </Link>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8 px-2 hover:bg-red-50 hover:text-red-200"
              onClick={(e) => {
                e.preventDefault();
                // Handle upvote
              }}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="text-sm font-medium">
                {project.upvotes_count}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8 px-2 hover:bg-blue-50 hover:text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                // Handle comment
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {project.comments_count}
              </span>
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            {project.created_at
              ? format(new Date(project.created_at), "MMM d, yyyy")
              : ""}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
