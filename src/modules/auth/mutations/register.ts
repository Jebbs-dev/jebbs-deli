import { User } from "@/types/types";
import api from "@/utils/api";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export const useCreateUser = () => {
  const router = useRouter();

  const { toast } = useToast();

  return useMutation({
    mutationFn: async (user: Omit<User, "id" | "role" >) => {
      const response = await api.post("/users/register", user);
      return response.data;
    },
    onSuccess: (data) => {
      setTimeout(() => {
        router.refresh();
      }, 300);
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
