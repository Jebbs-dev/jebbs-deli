import { User } from "@/types/types";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const response = await api.patch(`/users/${userId}`, user);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });
};
