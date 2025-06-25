"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full gap-2 cursor-copy"
      onClick={handleCopy}
    >
      <Share2 className="h-4 w-4" />
      Copy Link
    </Button>
  );
}
