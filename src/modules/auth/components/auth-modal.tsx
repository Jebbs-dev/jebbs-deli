import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AuthForm from "./forms/auth-form";
import { useAuthFormModal } from "@/store/auth-form-modal";

const AuthModal = () => {
  const [variant, setVariant] = useState("login");

  const { isAuthFormOpen, onAuthFormClose } = useAuthFormModal();

  const router = useRouter();

  const toggleVariant = () => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  };

  const onChange = (open: boolean) => {
    if (!open) {
      onAuthFormClose();
    }
  };

  return (
    <Dialog open={isAuthFormOpen} onOpenChange={onChange}>
      <DialogContent className="w-[90%] mx-auto flex flex-col space-y-2 lg:w-[70%] shad  md:rounded-md p-6 lg:p-10 mt-10 sm:mt-0 rounded-lg z-50">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-3xl text-left font-semibold text-orange-400">
            {variant === "login"
              ? "Sign in to your account"
              : "Create an Account"}
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base text-left font-light">
            {variant === "login"
              ? "Enter your email and password below to sign in to your account"
              : "Enter your name, email and password below to create an account"}

            <div className="flex flex-col text-orange-400 py-3 gap-5">
              <AuthForm variant={variant} />

              <div className="flex justify-center items-center">
                <p className="text-black">
                  {variant === "login"
                    ? "Don't have an account?"
                    : "Have an account?"}{" "}
                  <span
                    onClick={toggleVariant}
                    className="underline text-orange-400 hover:text-neutral-600 hover:cursor-pointer"
                  >
                    {variant === "login"
                      ? "Click to create an account."
                      : "Click to sign in"}
                  </span>
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
