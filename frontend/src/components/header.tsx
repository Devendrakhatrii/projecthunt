"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Home,
  Search,
  User,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Bookmark,
  AppWindow,
  CirclePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/authContext";
import { SearchBar } from "./search";
import { ModeToggle } from "./mode-toggle";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  // { name: "Project", href: "/projects", icon: AppWindow },
  { name: "Stories", href: "/stories", icon: BookOpen },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
];

export function Header() {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/auth");
  const { user, logout } = useAuth();

  return (
    <>
      {!hideHeader && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-6">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Project Hunt</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <Link href="/projects/create">
                    <Button>
                      <CirclePlus />
                      Submit
                    </Button>
                  </Link>
                  <Link href={"/notifications"}>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                        {/* 3 */}
                      </Badge>
                    </Button>
                  </Link>
                </>
              )}
              <ModeToggle />

              {!user ? (
                <>
                  <Button asChild variant="outline">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.picture || "/placeholder-user.jpg"}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user.user_name}`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
