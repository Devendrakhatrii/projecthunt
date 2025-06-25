"use client";

import React, { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

interface RequireAuthActionProps {
  children: ReactNode;
  onConfirm: () => void; // action to perform if authenticated
}

export function RequireAuthAction({
  children,
  onConfirm,
}: RequireAuthActionProps) {
  const { user } = useAuth(); // user from auth context
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      setOpen(true); // show login prompt
    } else {
      onConfirm(); // user is logged in, run action
    }
  };

  return (
    <>
      <span onClick={handleClick} style={{ cursor: "pointer" }}>
        {children}
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            You need to be logged in to perform this action.
          </p>
          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
