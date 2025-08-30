import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed top-0 z-50 left-0 w-full h-full bg-white/50 backdrop-blur-2xl flex justify-center items-center flex-col">
      <span className="font-bold">درحال دریافت اطلاعات کاربر</span>
      <span className="text-gray-500">منتظر بمانید</span>
    </div>
  );
}
