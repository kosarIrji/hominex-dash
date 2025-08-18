"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleSidebar } from "@/redux/Slices/sidebar";
import Messages from "../UI/Messages";
import { signOut } from "next-auth/react";
import { successToast } from "@/config/Toasts";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { concatWithPlus } from "@/lib/concatWithPlus";
import { url } from "@/config/urls";
export default function Nav() {
  //   const [toggleSidebar, setToggleSidebar] = useState(false);
  const Sidebar = useSelector((state: RootState) => state.sidebarSlice.value);
  const client = useSelector((state: RootState) => state.authSlice.client);
  const session = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [toggleMessages, setToggleMessages] = useState<boolean>(false);
  const { notifications } = useSelector(
    (state: RootState) => state.Notification
  );

  //signout the user
  const handleLogout = async () => {
    try {
      successToast("درحال خروج از حساب");
      setTimeout(async () => {
        const res = await fetch(url("/auth/logout"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user?.access_token}`,
          },
        });
        console.log(res);
        signOut();
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <header className="flex flex-row-reverse justify-between items-center w-screen px-3 py-2  bg-[var(--background)] ">
      <div
        className={`${
          Sidebar ? "opacity-0" : "opacity-100"
        } [&>*]:cursor-pointer flex flex-row-reverse transition-all items-center gap-3 `}>
        <RiLogoutCircleLine
          onClick={() => handleLogout()}
          className="w-5 h-5  text text-red-500 transition-colors rounded-md"
        />
        <div className="relative">
          <Image
            alt="تصویر پروفایل"
            width={40}
            height={40}
            src={client.profile_picture + concatWithPlus(client.full_name)}
            className="rounded-full border-3 w-10 h-10 border-blue-500"
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
          onClick={() => setToggleMessages((prev) => !prev)}
          className="relative inline-flex items-center p-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg
            className=" w-3 h-3 md:w-5 md:h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 16">
            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
          </svg>
          {/* messages box */}
          {toggleMessages && <Messages />}

          <div className="absolute text-[10px] inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 ">
            {notifications.length ? notifications.length : 0}
          </div>
        </button>

        {/* setting icon */}
        {/* <IoSettingsOutline className="w-5 h-5" /> */}
      </div>

      <div className={`${Sidebar ? "mr-[15rem]" : ""} z-10 transition-all`}>
        {Sidebar ? (
          <IoIosArrowForward
            onClick={() => dispatch(toggleSidebar(false))}
            className="w-8 h-8 cursor-pointer  border border-gray-500 rounded-md p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          />
        ) : (
          <IoIosArrowBack
            onClick={() => dispatch(toggleSidebar(true))}
            className="w-8 h-8 cursor-pointer border border-white bg-blue-500 rounded-md p-2 text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-300 transition-colors"
          />
        )}
      </div>
    </header>
  );
}
