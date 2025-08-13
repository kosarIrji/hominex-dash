"use client";
import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText";
import OTP from "@/components/UI/OTP";
import { MdOutlineTextsms } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleAuth } from "@/redux/Slices/authSlice";
import { useState } from "react";
import { loginFormSchema } from "@/config/JoiSchema";
import { errorToast, successToast } from "@/config/Toasts";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useRef } from "react";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const [phone, setPhone] = useState<string>("");
  const [password, SetPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<string>("password");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // handle form submition
  const handleFormSubmit = async () => {
    try {
      // validate the inputs
      const formData = { phone, password };
      const { error, value } = loginFormSchema.validate(formData);
      if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        return errorToast(errorMessage);
      }

      // sending validated request to back-end
      const res = await signIn("credentials", {
        phone: value.phone,
        password: value.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.ok) {
        successToast("ورود موفق");
        console.log(res);
      }
      setTimeout(() => {
        router.push(res.url || "/");
        console.log("now redirect to /");
      }, 2000);
    } catch (e) {
      errorToast(e);
    }
  };

  return (
    <div className="flex mt-10 bg-white/40 backdrop-blur-2xl rounded-lg shadow-lg overflow-hidden w-4xl mx-auto max-w-sm lg:max-w-4xl">
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
        {/* phone number */}
        <div className="mt-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            شماره تلفن{" "}
          </label>
          <div className="flex justify-center items-center">
            <input
              className="bg-gray-200 pl-15 text-gray-700  focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              dir="ltr"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
            <span className="absolute left-3 border-r-2 pr-3 font-bold text-gray-700">
              98+
            </span>
          </div>
        </div>

        {/* password */}
        <div className="mt-4">
          <div className="flex justify-between">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              رمز ورود
            </label>
            <Link href="#" className="text-xs text-gray-500">
              رمز را فراموش کرده اید ؟
            </Link>
          </div>
          <div className="relative">
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type={passwordType}
              name="password"
              value={password}
              onChange={(e) => SetPassword(e.target.value)}
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
        {/* enter button */}
        <div className="mt-8 flex gap-2 [&>*]:h-13">
          <button
            onClick={() => handleFormSubmit()}
            type="submit"
            className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600 flex justify-center items-center gap-1 hover:gap-5 transition-all cursor-pointer">
            ورود
            <IoIosArrowRoundBack className="" />
          </button>
          <button
            type="button"
            className="text-white w-[14rem] justify-center gap-2 cursor-pointer bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded text-sm py-2 px-4 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2">
            رمز یکبار مصرف
            <MdOutlineTextsms />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 md:w-1/4"></span>
          <span
            onClick={() => dispatch(toggleAuth())}
            className="text-xs text-gray-500 cursor-pointer hover:text-black transition-colors">
            عضویت در سایت
          </span>
          <span className="border-b w-1/5 md:w-1/4"></span>
        </div>
      </div>
      {/* <OTP /> */}
    </div>
  );
}
