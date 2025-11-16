import { useAuthStore } from "@/stores/authStore";
import { redirect } from "@tanstack/react-router";

export const requireAuth = () => {
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || !user) {
    throw redirect({
      to: "/",
    });
  }
};
