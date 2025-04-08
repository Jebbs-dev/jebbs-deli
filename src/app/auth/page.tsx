"use client";

import { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import AuthForm from "@/modules/auth/components/forms/auth-form";

const AuthPage = () => {
  const [variant, setVariant] = useState("login");

  const router = useRouter();

  const toggleVariant = () => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  };

  return (
    <div className="w-full h-full md:h-screen bg-orange-50 flex flex-col bg-cover md:grid md:grid-cols-2">
      <div className="sm:h-[100vh] min-h-screen md:bg-opacity-70 text-sm flex items-center">
        <h1 className="absolute top-3 left-[45%] mx-auto md:top-10 md:left-10 text-black text-2xl md:text-3xl">deli<span className="text-orange-400">.</span></h1>
        <div className="w-[80%] mx-auto flex flex-col space-y-2 xl:w-[60%] md:border-2 md:border-orange-400 md:rounded-md p-4 lg:p-10 mt-10 sm:mt-0">
          <h1 className="text-3xl font-semibold text-orange-400 text-center mb-3">
            {variant === "login"
              ? "Sign in to your account"
              : "Create an Account"}
          </h1>
          <p className="text-center text-neutral-600 font-light">
            {variant === "login"
              ? "Enter your email and password below to sign in to your account"
              : "Enter your name, email and password below to create an account"}
          </p>
          <div className="flex flex-col text-orange-400 py-3">
            <AuthForm variant={variant} />

            <div className="flex h-5 justify-center items-center text-sm my-7">
              <div className="w-[25%] lg:w-[31%]">
                <Separator orientation="horizontal" className="bg-orange-300" />
              </div>
              <div className="w-1/2">
                <div className="text-xs text-center">OR CONTINUE WITH</div>
              </div>
              <div className="w-[25%] lg:w-[31%]">
                <Separator orientation="horizontal" className="bg-orange-300" />
              </div>
            </div>

            <div className="flex space-x-10 justify-center mb-7">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition border border-orange-400">
                <FcGoogle size={32} />
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition border border-orange-400">
                <FaTwitter size={27} color="#0ea5e9" />
              </div>
            </div>

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
        </div>
      </div>
      <div className="md:h-screen md:w-full md:bg-[url('/images/auth-bg.jpg')] bg-cover">
        {/* <Image
          src={"/images/auth-bg.jpg"}
          alt="logo"
          width={200}
          height={200}
          className="h-full w-full"
        /> */}
      </div>
    </div>
  );
};

export default AuthPage;
