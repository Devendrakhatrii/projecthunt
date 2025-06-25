"use client";

import { useEffect, useState } from "react";
import { fetchComments, postComment } from "@/services/commentService";
import { Comment as CommentType } from "@/types/Comment";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { RequireAuthAction } from "./requireAuthAction";

type Props = {
  type: "project" | "story";
  id: number;
};

export function Comment({ type, id }: Props) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyBody, setReplyBody] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchComments(type, id);
      console.log(data);

      setComments(data);
      setLoading(false);
    };
    load();
  }, [type, id]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    await postComment(type, id, body);
    setBody("");
    const data = await fetchComments(type, id);
    setComments(data);
  };

  const handleReply = async (parent_id: number) => {
    if (!replyBody.trim()) return;
    await postComment(type, id, replyBody, parent_id);
    setReplyBody("");
    setReplyTo(null);
    const data = await fetchComments(type, id);
    setComments(data);
  };

  return (
    <div>
      <form onSubmit={handlePost} className="mb-6">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <RequireAuthAction onConfirm={() => handlePost}>
          <Button type="submit" className="mt-2">
            Post Comment
          </Button>
        </RequireAuthAction>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user.picture || "/placeholder.svg"}
                  />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.body}</p>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => setReplyTo(comment.id)}
                  >
                    Reply
                  </Button>
                  {replyTo === comment.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReply(comment.id);
                      }}
                      className="mt-2"
                    >
                      <Textarea
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder="Write a reply..."
                        required
                      />
                      <RequireAuthAction
                        onConfirm={() => handleReply(comment.id)}
                      >
                        <Button type="submit" size="sm" className="mt-1">
                          Post Reply
                        </Button>
                      </RequireAuthAction>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="mt-1 ml-2"
                        onClick={() => setReplyTo(null)}
                      >
                        Cancel
                      </Button>
                    </form>
                  )}
                </div>
              </div>
              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-11 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={reply.user.picture || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-xs">
                          {reply.user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">
                            {reply.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-xs">{reply.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
