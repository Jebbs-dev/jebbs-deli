import { User } from "@/types/types";
import api from "@/utils/api";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const useCreateUser = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (user: Omit<User, "id" | "role" >) => {
      const response = await api.post("/users/register", user);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        // toast({
        //   title: "Success",
        //   description: "Successfully Created Vendor Account!",
        // });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message,
      // });
    },
  });
};
