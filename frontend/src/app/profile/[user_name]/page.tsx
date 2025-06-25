"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { getUserByUserName } from "@/services/userService";
import { followUser, unfollowUser } from "@/services/followService";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { RequireAuthAction } from "@/components/requireAuthAction";
import { UserProfile } from "@/types/User";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { user_name } = useParams() as { user_name: string };
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserByUserName(user_name);
        const projects = (res.data.projects || []).map((project: any) => ({
          ...project,
          tech_stack: Array.isArray(project.tech_stack)
            ? project.tech_stack
            : typeof project.tech_stack === "string"
            ? project.tech_stack.split(",").map((t: string) => t.trim())
            : [],
          user: {
            name: res.data.name,
            user_name: res.data.user_name,
            picture: res.data.picture,
          }, // <-- Attach user here
        }));
        setUser({ ...res.data, projects });
        setIsFollowing(res.data.is_followed ?? false);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [user_name]);

  const handleFollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    try {
      await followUser(user.id);
      setIsFollowing(true);
      toast.success("Followed!");
    } catch {
      toast.error("Failed to follow");
    }
    setFollowLoading(false);
  };

  const handleUnfollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    try {
      await unfollowUser(user.id);
      setIsFollowing(false);
      toast.success("Unfollowed!");
    } catch {
      toast.error("Failed to unfollow");
    }
    setFollowLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">User not found.</div>;
  }

  const isOwnProfile = authUser && authUser.id === user.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.picture || "/placeholder-user.jpg"} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>
              <span className="text-muted-foreground">@{user.user_name}</span>
              <Badge variant="secondary" className="ml-2">
                {user.role}
              </Badge>
            </CardDescription>
            <div className="mt-2 text-sm text-muted-foreground">
              Joined{" "}
              {user.created_at
                ? format(new Date(user.created_at), "MMM d, yyyy")
                : ""}
            </div>
            <div className="flex gap-6 mt-3">
              {/* Followers */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="py-2 cursor-pointer h-auto text-base font-medium"
                  >
                    Followers{" "}
                    <span className="font-bold ml-1">
                      {user.followers_count ?? user.followers.length}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Followers</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.followers?.length > 0 ? (
                    user.followers.map((f) => (
                      <DropdownMenuItem asChild key={f.id}>
                        <Link
                          href={`/profile/${f.user_name}`}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={f.picture || "/placeholder-user.jpg"}
                            />
                            <AvatarFallback>{f.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{f.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      <span className="text-xs text-muted-foreground">
                        No followers
                      </span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Following */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="py-2 h-auto text-base font-medium cursor-pointer"
                  >
                    Following{" "}
                    <span className="font-bold ml-1">
                      {user.following_count ?? user.following.length}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Following</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.following?.length > 0 ? (
                    user.following.map((f) => (
                      <DropdownMenuItem asChild key={f.id}>
                        <Link
                          href={`/profile/${f.user_name}`}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={f.picture || "/placeholder-user.jpg"}
                            />
                            <AvatarFallback>{f.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{f.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      <span className="text-xs text-muted-foreground">
                        Not following anyone
                      </span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {!isOwnProfile &&
            (isFollowing ? (
              <Button
                variant="outline"
                onClick={handleUnfollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : "Unfollow"}
              </Button>
            ) : (
              <RequireAuthAction onConfirm={handleFollow}>
                <Button disabled={followLoading}>
                  {followLoading ? "..." : "Follow"}
                </Button>
              </RequireAuthAction>
            ))}
        </CardHeader>
        <CardContent>
          <div className="text-base mb-4">{user.bio}</div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Projects</h2>
        {user.projects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No projects yet.</div>
        )}
      </div>
    </div>
  );
}
