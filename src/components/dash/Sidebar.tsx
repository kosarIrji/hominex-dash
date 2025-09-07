"use client";
import React from "react";
import Image from "next/image";
import { RiHome6Line } from "react-icons/ri";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { FaRegListAlt } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { Routes } from "@/config/Routes";
import { useDispatch } from "react-redux";
import { switchRoute } from "@/redux/Slices/routeSwitch";
import { toggleSidebar } from "@/redux/Slices/sidebar";
import { MdOutlineSupportAgent } from "react-icons/md";
import { TbLockAccess } from "react-icons/tb";
import { LiaClipboardListSolid } from "react-icons/lia";
import { useSession } from "next-auth/react";
import { MdOutlineSwitchAccessShortcut } from "react-icons/md";
import Link from "next/link";

export default function Sidebar() {
  const Sidebar = useSelector((state: RootState) => state.sidebarSlice.value);
  const route = useSelector((state: RootState) => state.routeSwitch.route);
  const session = useSession();
  const role = session.data?.user?.user_type;

  const dispatch = useDispatch<AppDispatch>();
  return (
    <div
      className={`fixed ${
        Sidebar ? "right-0" : "right-[-100%]"
      } top-0 h-screen w-[15rem] bg-[var(--background)]/70 backdrop-blur-md shadow-2xl transition-all z-20`}>
      <div className="flex flex-row items-center py-1 px-3">
        <Link href={"https://hominex.ir"}>
          <Image
            alt="hominex logo"
            width={50}
            height={50}
            src={"/assets/img/logo.png"}
          />
          <span className="font-bold">هومینکس</span>
        </Link>
      </div>
      <ul className="flex flex-col overflow-y-auto gap-4 pt-10 pl-5 | [&>*]:flex [&>*]:items-center [&>*]:gap-2 [&>*]:px-2 [&>*]:py-2 [&>*]:cursor-pointer">
        {Routes.filter((item) => {
          // if route has no access restriction, always show
          if (!item.access) return true;

          // only show items restricted to admin if user role is admin
          if (item.access === "admin" && role === "admin") return true;

          // hide otherwise
          return false;
        }).map((item, i) => (
          <li
            key={i}
            onClick={() => {
              dispatch(toggleSidebar(false));
              dispatch(switchRoute(item.path));
            }}
            className={`${
              item.path === route &&
              "bg-gray-800 text-white rounded-md ring-4 outline-none ring-gray-400"
            } mx-5 `}>
            {i === 0 && <RiHome6Line className="w-5 h-5 mx-2" />}
            {i === 1 && <RiAccountPinCircleLine className="w-5 h-5 mx-2" />}
            {i === 2 && <FaRegListAlt className="w-5 h-5 mx-2" />}
            {i === 3 && <BiLike className="w-5 h-5 mx-2" />}
            {i === 4 && <TbLockAccess className="w-5 h-5 mx-2" />}
            {i === 5 && <MdOutlineSupportAgent className="w-5 h-5 mx-2" />}
            {i === 6 && <LiaClipboardListSolid className="w-5 h-5 mx-2" />}
            {i === 7 && (
              <MdOutlineSwitchAccessShortcut className="w-5 h-5 mx-2" />
            )}
            {item.title}
          </li>
        ))}
      </ul>
      {/* <Ticket /> */}
    </div>
  );
}
