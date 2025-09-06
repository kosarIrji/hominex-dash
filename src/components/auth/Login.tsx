"use client";

import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText";
import { MdOutlineTextsms } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleAuth } from "@/redux/Slices/authSlice";
import { loginFormSchema } from "@/config/JoiSchema";
import { errorToast, successToast } from "@/config/Toasts";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<string>("password");
  const [isLoading, setIsLoading] = useState<boolean>(false); // New loading state
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      setIsLoading(true); // Show spinner
      // Validate the inputs
      const formData = { phone, password };
      const { error, value } = loginFormSchema.validate(formData);
      if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        errorToast(errorMessage);
        setIsLoading(false); // Hide spinner on validation error
        return;
      }

      // Send validated request to NextAuth
      const res = await signIn("credentials", {
        phone: value.phone,
        password: value.password,
        redirect: false,
        callbackUrl: `${process.env.NEXTAUTH_URL || ""}/`,
      });

      if (res?.error) {
        errorToast(`خطا در ورود: شماره / رمز اشتباه میباشد.`);
        setIsLoading(false); // Hide spinner on error
        return;
      }

      if (res?.ok) {
        successToast("ورود موفق");
        // Wait for session to update before redirecting
        setTimeout(() => {
          if (status === "authenticated" || session) {
            router.push(res.url || "/");
          }
          setIsLoading(false); // Hide spinner after redirect
        }, 1000);
      } else {
        errorToast("خطا در ورود. لطفاً دوباره تلاش کنید.");
        setIsLoading(false); // Hide spinner on failure
      }
    } catch (e) {
      console.error("Login Error:", e);
      errorToast("خطای غیرمنتظره رخ داده است.");
      setIsLoading(false); // Hide spinner on unexpected error
    }
  };

  return (
    <div className="flex h-screen pt-16 md:pt-0 w-full md:h-auto md:mt-10 bg-white/40 backdrop-blur-2xl md:rounded-lg shadow-lg overflow-hidden md:w-4xl md:mx-auto md:max-w-sm lg:max-w-4xl">
      <div
        className="hidden lg:block lg:w-1/2 bg-cover"
        style={{
          backgroundImage: "url('assets/svg/login_banner.svg')",
        }}></div>
      <div className="w-full p-8 lg:w-1/2">
        <div className="w-full flex justify-center items-center">
          <BlurText
            text="هومینکس"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-2xl mb-2 font-semibold text-gray-700 text-center"
          />
        </div>
        <p className="text-xl text-gray-600 text-center">ورود به سایت</p>
        {/* Note: Google provider is not configured in [...nextauth]/route.ts. Remove or configure it */}
        <span
          onClick={() => signIn("google", { redirectTo: "/" })}
          className="flex cursor-pointer items-center justify-center mt-4 text-white rounded-lg shadow-md transition-colors bg-gray-100 hover:bg-gray-100/60">
          <div className="px-4 py-3">
            <svg className="h-6 w-6" viewBox="0 0 40 40">
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#FFC107"
              />
              <path
                d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                fill="#FF3D00"
              />
              <path
                d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                fill="#4CAF50"
              />
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#1976D2"
              />
            </svg>
          </div>
          <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-medium">
            از طریق گوگل
          </h1>
        </span>
        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">
            یا از طریق شماره تلفن
          </span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>
        {/* Phone number */}
        <div className="mt-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            شماره تلفن
          </label>
          <div className="flex justify-center items-center">
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              dir="ltr"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
              placeholder="09..."
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              رمز ورود
            </label>
            <Link href="#" className="text-xs text-gray-500">
              رمز را فراموش کرده اید؟
            </Link>
          </div>
          <div className="relative">
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type={passwordType}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFormSubmit();
              }}
            />
            {passwordType === "text" ? (
              <IoEyeOffOutline
                onClick={() => setPasswordType("password")}
                className="absolute left-3 w-5 h-5 bottom-[0.7rem] cursor-pointer"
              />
            ) : (
              <IoEyeOutline
                onClick={() => setPasswordType("text")}
                className="absolute left-3 w-5 h-5 bottom-[0.7rem] cursor-pointer"
              />
            )}
          </div>
        </div>
        {/* Enter button */}
        <div className="mt-8 flex gap-2 [&>*]:h-13">
          <button
            onClick={() => handleFormSubmit()}
            disabled={isLoading}
            className={`relative bg-gray-700 text-white font-bold py-2 px-4 w-full rounded flex justify-center items-center gap-1 hover:gap-5 transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ورود...
              </>
            ) : (
              <>
                ورود
                <IoIosArrowRoundBack className="" />
              </>
            )}
          </button>
          <button
            type="button"
            className="text-white relative overflow-hidden w-[14rem] justify-center gap-2 cursor-pointer bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded text-sm py-2 px-4 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2">
            کد یکبار مصرف
            <MdOutlineTextsms className="absolute right-[-5px] rotate-45 top-[-10px] w-10 h-10 opacity-20" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 md:w-1/4"></span>
          <span
            onClick={() => dispatch(toggleAuth())}
            className="text-xs cursor-pointer text-black transition-colors">
            عضویت در سایت
          </span>
          <span className="border-b w-1/5 md:w-1/4"></span>
        </div>
      </div>
    </div>
  );
}
