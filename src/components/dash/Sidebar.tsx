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
import Ticket from "./Ticket";
import { Routes } from "@/config/Routes";
import { useDispatch } from "react-redux";
import { switchRoute } from "@/redux/Slices/routeSwitch";
import { toggleSidebar } from "@/redux/Slices/sidebar";

export default function Sidebar() {
  const Sidebar = useSelector((state: RootState) => state.sidebarSlice.value);
  const route = useSelector((state: RootState) => state.routeSwitch.route);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div
      className={`absolute ${
        Sidebar ? "right-0" : "right-[-100%]"
      } top-0 h-screen w-[15rem] bg-[var(--background)]/10 backdrop-blur-md shadow-2xl transition-all z-10`}>
      <div className="flex flex-row items-center py-1 px-3">
        <Image
          alt="hominex logo"
          width={50}
          height={50}
          src={"/assets/img/logo.png"}
          className=""
        />
        <span className="font-bold">هومینکس</span>
      </div>
      <ul className="flex flex-col gap-4 pt-10 pl-5 | [&>*]:flex [&>*]:items-center [&>*]:gap-2 [&>*]:px-2 [&>*]:py-2 [&>*]:cursor-pointer">
        {Routes.map((item, i) => (
          <li
            key={i}
            onClick={() => {
              dispatch(toggleSidebar(false));
              dispatch(switchRoute(item.path));
            }}
            className={`${
              item.path === route &&
              "bg-gray-800 text-white rounded-md ring-4 outline-none ring-gray-300"
            } mx-5 `}>
            {i === 0 && <RiHome6Line className="w-5 h-5 mx-2" />}
            {i === 1 && <RiAccountPinCircleLine className="w-5 h-5 mx-2" />}
            {i === 2 && <FaRegListAlt className="w-5 h-5 mx-2" />}
            {i === 3 && <BiLike className="w-5 h-5 mx-2" />}
            {item.title}
          </li>
        ))}
      </ul>

      <Ticket />
    </div>
  );
}
