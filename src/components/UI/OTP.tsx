import React from "react";

export default function OTP() {
  return (
    <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center bg-white/20 backdrop-blur-2xl">
      <div className="max-w-full mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">تایید شماره تلفن</h1>
          <p className="text-[15px] text-slate-500">
            کد 6 رقمی ارسال شده به شماره تلفن را وارد کنید .
          </p>
        </header>
        <form id="otp-form">
          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              className="sm:w-14 sm:h-14 w-10 h-10 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              pattern="\d*"
              maxLength={1}
            />
            <input
              type="text"
              className="sm:w-14 sm:h-14 w-10 h-10 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength={1}
            />
            <input
              type="text"
              className="sm:w-14 sm:h-14 w-10 h-10 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength={1}
            />
            <input
              type="text"
              className="sm:w-14 sm:h-14 w-10 h-10 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength={1}
            />
            <input
              type="text"
              className="sm:w-14 sm:h-14 w-10 h-10 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength={1}
            />
            <input
              type="text"
              className="sm:w-14 sm:h-14 w-10 h-10 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength={1}
            />
          </div>
          <div className="max-w-[260px] mx-auto mt-4 flex gap-2 justify-center items-center">
            <button
              type="submit"
              className="w-fit h-fit cursor-pointer inline-flex justify-center whitespace-nowrap rounded-lg text-red-500 hover:text-white border border-red-500 px-5 py-2.5 text-sm font-medium  shadow-sm shadow-indigo-950/10 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-red-300 transition-colors duration-150">
              انصراف
            </button>
            <button
              type="submit"
              className="w-full cursor-pointer inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">
              تایید حساب کاربری
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          کد را دریافت نکردید ؟{" "}
          <a
            className="font-medium text-indigo-500 hover:text-indigo-600"
            href="#0">
            ارسال مجدد
          </a>
        </div>
      </div>
    </div>
  );
}
