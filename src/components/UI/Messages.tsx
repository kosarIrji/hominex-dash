"use client";
import React from "react";
import { MdOutlineInfo } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Messages() {
  const { notifications, loading } = useSelector(
    (state: RootState) => state.Notification
  );

  return (
    <ul className="bg-white/30 backdrop-blur-2xl absolute bottom-[-11rem] left-[-5.5rem] sm:left-0 border-1 border-gray-500 z-10 shadow-gray-500 shadow-lg rounded-lg max-w-3xl gap-5 flex flex-col w-[13rem] h-[10rem] overflow-y-scroll px-2 py-7">
      {loading ? (
        <span className="w-full text-center text-gray-400">
          در حال بارگذاری...
        </span>
      ) : notifications.length === 0 ? (
        <span className="w-full text-center text-gray-400">پیامی یافت نشد</span>
      ) : (
        notifications.map((n) => (
          <li
            key={n.id}
            className="flex flex-row-reverse relative items-start text-black text-right justify-end gap-2 text-[12px]">
            <span className="border-r border-blue-800 pr-2">{n.message}</span>
            <MdOutlineInfo className="min-w-3 min-h-3 absolute top-[-0.7rem] right-[-0.35rem] text-blue-800" />
          </li>
        ))
      )}
    </ul>
  );
}
