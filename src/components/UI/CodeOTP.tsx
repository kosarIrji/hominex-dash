"use client";

import { useState, useRef, useEffect } from "react";
import { errorToast, successToast } from "@/config/Toasts";
import { url } from "@/config/urls";

interface Client {
  phone: string;
  setShowOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOtp: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CodeOTP({ phone, setShowOTP, setIsOtp }: Client) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!/[0-9BackspaceArrowLeftArrowRight]/.test(e.key)) {
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      errorToast("لطفاً کد ۶ رقمی معتبر وارد کنید");
      return;
    }
    if (!phone) {
      errorToast("شماره تلفن موجود نیست");
      return;
    }

    try {
      const response = await fetch(url("/auth/verify-registration"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json();
      if (response.ok) {
        successToast(data.message);
        setShowOTP(false);
        setIsOtp(true);
      } else {
        errorToast(data.message || "خطا در تأیید کد");
      }
    } catch {
      errorToast("خطای سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  const handleCancel = () => {
    setShowOTP(false);
  };

  const handleResend = async () => {
    if (!phone) {
      setError("شماره تلفن موجود نیست");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phone }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setError("");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        const data = await response.json();
        setError(data.error || "خطا در ارسال مجدد کد");
      }
    } catch {
      setError("خطای سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div
      className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center bg-gray-900/20 backdrop-blur-2xl"
      dir="rtl">
      <div className="max-w-full mx-auto text-center bg-gray-800/60 px-4 sm:px-8 py-10 rounded-xl shadow border border-gray-700">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1 text-gray-100">
            تأیید شماره تلفن
          </h1>
          <p className="text-[15px] text-gray-400">
            کد ۶ رقمی ارسال شده به شماره تلفن را وارد کنید.
          </p>
        </header>

        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3" dir="ltr">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                className="sm:w-14 sm:h-14 w-10 h-10 text-center font-bold text-2xl  text-gray-100 bg-gray-700 border border-gray-600 hover:border-gray-500 rounded p-2 outline-none focus:bg-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                maxLength={1}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-right mt-4">{error}</p>
          )}

          <div className="max-w-[260px] mx-auto mt-4 flex gap-2 justify-center items-center">
            <button
              type="button"
              onClick={handleCancel}
              className="w-fit h-fit cursor-pointer inline-flex justify-center whitespace-nowrap rounded-lg text-red-500 hover:text-white border border-red-500 px-5 py-2.5 text-sm font-medium shadow-sm shadow-gray-900/10 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 transition-colors duration-150">
              انصراف
            </button>
            <button
              type="submit"
              className="w-full cursor-pointer inline-flex justify-center whitespace-nowrap rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-gray-900/10 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-150">
              تأیید حساب کاربری
            </button>
          </div>
        </form>

        <div className="text-sm text-gray-400 mt-4">
          کد را دریافت نکردید؟{" "}
          <button
            onClick={handleResend}
            className="font-medium text-blue-500 hover:text-blue-600">
            ارسال مجدد
          </button>
        </div>
      </div>
    </div>
  );
}
