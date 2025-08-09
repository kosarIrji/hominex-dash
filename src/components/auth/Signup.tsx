import React, { SetStateAction, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText";
import OTP from "@/components/UI/OTP";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleAuth } from "@/redux/Slices/authSlice";
import { signupFormSchema } from "@/config/JoiSchema";
import { errorToast, infoToast, successToast } from "@/config/Toasts";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { updateCLientData } from "@/redux/Slices/authSlice";
import { Dispatch } from "react";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();

  const [full_name, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, SetPassword] = useState<string>("");
  const [OTP, setOTP] = useState<string>("");
  //-----------

  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  // handle form submition
  const [otpCode, setOtpCode] = useState<string>("");

  const handleFormSubmition = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const formData = {
        full_name,
        phone: "0" + phone,
        password,
        email,
      };
      const { error: validationError, value } =
        signupFormSchema.validate(formData);
      if (validationError) {
        const errorMessage = validationError.details
          .map((err) => err.message)
          .join(", ");
        return errorToast(errorMessage);
      }

      const response = await fetch(`/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        return errorToast(data.message || "ثبت‌ نام ناموفق بود.");
      }
      console.log(data);
      setShowOTP(true);
      infoToast(data.message);
      dispatch(updateCLientData({ full_name, phone, password, email }));
    } catch (err) {
      errorToast("خطایی رخ داد ، مجدد تلاش نمایید .");
      console.error(err);
    }
  };

  useEffect(() => {
    if (otpCode.length !== 6) return; // only send if complete
    const sendOTP = async () => {
      try {
        const res = await fetch(`/api/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, code: otpCode }),
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setShowOTP(false);
          dispatch(toggleAuth());
        } else {
          errorToast(data.message || "OTP verification failed.");
        }
      } catch (err) {
        console.error(err);
      }
    };
    sendOTP();
  }, [otpCode]);

  return (
    <>
      <div className="flex mt-10 bg-white/40 backdrop-blur-2xl rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
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
          <p className="text-xl text-gray-600 text-center">ثبت نام در سایت</p>
          <span
            onClick={() => signIn("google", { redirectTo: "/" })}
            className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md transition-colors bg-gray-100 hover:bg-gray-100/60">
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
            <h1 className="px-4 py-3 w-5/6 cursor-pointer text-center text-gray-600 font-medium">
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
          <div className="flex justify-center gap-2">
            {/* full name */}
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  نام کامل{" "}
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="fullname"
                value={full_name}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            {/* email */}
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ایمیل
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@gmail.com"
                dir="ltr"
              />
            </div>
          </div>
          {/* phone number */}
          <div className="mt-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              شماره تلفن{" "}
            </label>
            <div className="flex justify-center items-center">
              <input
                className="bg-gray-200 pl-15 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                maxLength={10}
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
              {/* <a href="#" className="text-xs text-gray-500">
                رمز را فراموش کرده اید ؟
              </a> */}
            </div>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="password"
              name="password"
              value={password}
              onChange={(e) => SetPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {/* enter button */}
          <div className="mt-8 [&>*]:h-13">
            <button
              onClick={(e) => handleFormSubmition(e)}
              className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600 flex justify-center items-center gap-1 hover:gap-5 transition-all cursor-pointer">
              ثبت نام <IoIosArrowRoundBack className="" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <span
              onClick={() => dispatch(toggleAuth())}
              className="text-xs text-gray-500 cursor-pointer hover:text-black transition-colors">
              ورود به سایت
            </span>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
      {showOTP && <OTP setShowOTP={setShowOTP} />}
    </>
  );
}
