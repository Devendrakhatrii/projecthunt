"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Zap,
  BookOpen,
  Settings,
  BookMarkedIcon as MarkAsUnreadIcon,
  Bell,
} from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/services/notificaitonService";
import Link from "next/link";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "product":
      return <Zap className="h-4 w-4 text-orange-500" />;
    case "story":
      return <BookOpen className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      } catch {
        setNotifications([]);
        setUnreadCount(0);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const isUnread = (n: any) => !n.read_at;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activity
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications.
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-colors ${
                  isUnread(notification) ? "bg-muted/50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          notification.from_user?.picture ||
                          "/placeholder-user.jpg"
                        }
                      />
                      <AvatarFallback>
                        {notification.from_user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <p className="text-sm">
                          {notification.from_user ? (
                            <Link
                              href={`/profile/${notification.from_user.user_name}`}
                            >
                              <span className="font-medium hover:underline">
                                {notification.from_user.name}
                              </span>
                            </Link>
                          ) : (
                            <span className="font-medium">System</span>
                          )}{" "}
                          {notification.message}
                        </p>
                        {isUnread(notification) && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.time || notification.created_at}
                      </p>
                    </div>
                    {isUnread(notification) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <MarkAsUnreadIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : notifications.filter(isUnread).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No unread notifications.
            </div>
          ) : (
            notifications.filter(isUnread).map((notification) => (
              <Card key={notification.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={notification.avatar || "/placeholder-user.jpg"}
                      />
                      <AvatarFallback>
                        {notification.user?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <p className="text-sm">
                          <span className="font-medium">
                            {notification.user || "Someone"}
                          </span>{" "}
                          {notification.content}
                        </p>
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.time || notification.created_at}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <MarkAsUnreadIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
