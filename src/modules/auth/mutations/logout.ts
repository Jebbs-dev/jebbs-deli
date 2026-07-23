import api from "@/utils/api";
import useAuthStore from "@/store/auth";

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Clear local session even if the request fails
  }
  useAuthStore.getState().logout();
};
