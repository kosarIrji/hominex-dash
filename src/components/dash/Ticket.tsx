import { AppDispatch } from "@/redux/store";
import React from "react";
import { LuTickets } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { switchRoute } from "@/redux/Slices/routeSwitch";
import { toggleSidebar } from "@/redux/Slices/sidebar";

export default function Ticket() {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div
      className="rounded-2xl p-3 bg-cover absolute bottom-10 mx-5 py-5 text-white font-bold flex flex-col gap-10 justify-center"
      style={{ backgroundImage: "url('/assets/svg/ticket_background.svg')" }}>
      <span className="text-shadow-lg">
        جهت ارتباط با پشتیبانی تیکت خود را ثبت نمایید.
      </span>
      <button
        onClick={() => {
          dispatch(toggleSidebar(false));
          dispatch(switchRoute("ticket"));
        }}
        className=" transition-all hover:bg-gray-700 py-2 text-[15px] font-medium px-3 bg-gray-800 rounded-md shadow-2xl cursor-pointer flex flex-row items-center gap-2 justify-center">
        ارسال تیکت
        <LuTickets />
      </button>
    </div>
  );
}
