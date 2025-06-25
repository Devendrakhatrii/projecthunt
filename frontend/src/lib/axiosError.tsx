import axios from "axios";
import { toast } from "sonner";

// Helper function for error handling
export function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || error.message || "API Error");
  } else {
    toast.error("Unexpected Error");
  }
}
