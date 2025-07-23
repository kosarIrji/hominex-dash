"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleSidebar } from "@/redux/Slices/sidebar";
export default function Nav() {
  //   const [toggleSidebar, setToggleSidebar] = useState(false);
  const Sidebar = useSelector((state: RootState) => state.sidebarSlice.value);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <header className="flex flex-row-reverse justify-between items-center w-screen px-3 py-2  bg-[var(--background)] ">
      <div className="[&>*]:cursor-pointer flex flex-row-reverse items-center gap-4 ">
        <div className="relative">
          <Image
            alt="تصویر پروفایل"
            width={40}
            height={40}
            src={"/assets/img/profile.png"}
            className="rounded-full "
          />
          <svg
            className="w-4 h-4 absolute bottom-[-0.2rem] text-blue-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"
            />
            <path
              fill="#fff"
              d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"
            />
          </svg>
        </div>

        <button
          type="button"
          className="relative inline-flex items-center p-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 16">
            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
          </svg>
          <div className="absolute text-[10px] inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
            20
          </div>
        </button>

        {/* bell icon */}
        {/* <IoMdNotificationsOutline className="w-5 h-5" /> */}
        <IoSettingsOutline className="w-5 h-5" />
      </div>

      <div className={`${Sidebar ? "mr-[15rem]" : ""} z-10 transition-all`}>
        {Sidebar ? (
          <SlArrowRight
            onClick={() => dispatch(toggleSidebar(false))}
            className="w-8 h-8 cursor-pointer  border border-gray-500 rounded-md p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          />
        ) : (
          <SlArrowLeft
            onClick={() => dispatch(toggleSidebar(true))}
            className="w-8 h-8 cursor-pointer border border-gray-500 rounded-md p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          />
        )}
      </div>
    </header>
  );
}
