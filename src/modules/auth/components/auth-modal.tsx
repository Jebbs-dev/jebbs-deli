import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState, type CSSProperties } from "react";
import AuthForm from "./forms/auth-form";
import { useAuthFormModal } from "@/store/auth-form-modal";

const AuthModal = () => {
  const [variant, setVariant] = useState("login");

  const { isAuthFormOpen, onAuthFormClose } = useAuthFormModal();

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
      <DialogContent
        className="z-50 mx-auto mt-10 flex w-[90%] flex-col space-y-2 rounded-lg border-black/10 bg-white p-6 text-ash sm:mt-0 md:rounded-md lg:w-[70%] lg:p-10 [&>button]:text-ash [&>button]:hover:bg-black/5"
        style={
          {
            "--background": "0 0% 100%",
            "--foreground": "30 10% 10%",
            "--muted-foreground": "30 8% 40%",
            "--border": "30 10% 88%",
            "--input": "30 10% 88%",
            "--accent": "30 10% 96%",
            "--ring": "11 82% 51%",
          } as CSSProperties
        }
      >
        <DialogHeader>
          <DialogTitle className="text-left text-xl font-semibold text-orange-400 md:text-3xl">
            {variant === "login"
              ? "Sign in to your account"
              : "Create an Account"}
          </DialogTitle>
          <DialogDescription className="text-left text-sm font-light text-ash/70 md:text-base">
            {variant === "login"
              ? "Enter your email and password below to sign in to your account"
              : "Enter your name, email and password below to create an account"}

            <div className="flex flex-col gap-5 py-3 text-orange-400">
              <AuthForm variant={variant} />

              <div className="flex items-center justify-center">
                <p className="text-ash">
                  {variant === "login"
                    ? "Don't have an account?"
                    : "Have an account?"}{" "}
                  <span
                    onClick={toggleVariant}
                    className="cursor-pointer text-orange-400 underline hover:text-neutral-600"
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
