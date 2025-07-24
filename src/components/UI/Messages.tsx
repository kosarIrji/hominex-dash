import React from "react";
import { MdOutlineInfo } from "react-icons/md";

export default function Messages() {
  return (
    <ul className=" bg-white/30 backdrop-blur-2xl absolute bottom-[-11rem] left-[0rem] border-1 border-gray-500 z-10 shadow-gray-500 shadow-lg rounded-lg max-w-3xl gap-3 flex flex-col  w-[13rem] h-[10rem] overflow-y-scroll px-2 py-4">
      <span className="w-full text-center text-gray-400">پیامی یافت نشد</span>
      {/* <li className="flex flex-row-reverse justify-end items-center gap-2 text-[13px]">
        <span>تیکت شما بررسی شد</span>
        <MdOutlineInfo />
      </li> */}
    </ul>
  );
}
