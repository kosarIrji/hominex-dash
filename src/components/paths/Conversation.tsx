import React from "react";
import { BiSend } from "react-icons/bi";
import { LuCircleDashed } from "react-icons/lu";
import { LuCircleCheckBig } from "react-icons/lu";
import { MdOutlineArrowCircleDown } from "react-icons/md";
import { useState } from "react";
import { TbUsers } from "react-icons/tb";
import { BsPatchExclamation } from "react-icons/bs";
export default function Conversation() {
  const [switchContacts, setSwitchContacts] = useState(true);
  const [messages, setMessages] = useState([
    {
      type: "notification",
      message: "درصورت مشاهده تخلف به پشتیبانی گزارش دهید",
      time: "20:20",
    },
    {
      type: "reciever",
      message: "سلام حال شما ؟",
      time: "20:20",
    },
    {
      type: "sender",
      message: "ممنون درخدمت هستم چطور میتونم کمکتون کنم ؟",
      time: "20:59",
    },
    {
      type: "sender",
      message: "ممنون درخدمت هستم چطور میتونم کمکتون کنم ؟",
      time: "20:59",
    },

    {
      type: "reciever",
      message: "سلام حال شما ؟",
      time: "20:20",
    },
    {
      type: "reciever",
      message: "سلام حال شما ؟",
      time: "20:20",
    },
    {
      type: "reciever",
      message: "سلام حال شما ؟",
      time: "20:20",
    },
    {
      type: "reciever",
      message: "سلام حال شما ؟",
      time: "20:20",
    },
    {
      type: "reciever",
      message: "سلام حال شما ؟",
      time: "20:20",
    },
  ]);
  return (
    <div className="relative flex flex-row w-full h-full overflow-hidden">
      {/* chat box */}
      <div className="relative w-full sm:w-3/4 sm:p-5">
        <ul className="flex flex-col gap-8 h-[93%] overflow-auto ">
          {messages.map((msg, i) => {
            if (msg.type === "notification") {
              return (
                <li
                  key={i}
                  className="bg-yellow-400/50  p-2 relative rounded-md text-yellow-700  text-center w-fit max-w-[15rem] self-center">
                  <p>{msg.message}</p>
                  <BsPatchExclamation className="text-yellow-700/50 absolute bottom-[-0.5rem] right-[-0.5rem] text-xl" />
                </li>
              );
            } else if (msg.type === "sender") {
              return (
                <li
                  key={i}
                  className="bg-gray-600 p-2 relative rounded-md text-white w-fit max-w-[15rem] self-start">
                  {msg.message}
                  <span className="absolute text-sm left-0 bottom-[-1.5rem] text-gray-500">
                    {msg.time}
                  </span>
                </li>
              );
            } else {
              return (
                <li
                  key={i}
                  className="bg-blue-400 p-2 relative rounded-md text-white w-fit max-w-[15rem] self-end">
                  {msg.message}
                  <span className="absolute text-sm right-0 bottom-[-1.5rem] text-gray-500">
                    {msg.time}
                  </span>
                </li>
              );
            }
          })}
        </ul>

        {/* inputs */}
        <div className="w-full absolute bottom-0 left-0  flex flex-row justify-end items-center gap-2  px-5">
          <input
            type="text"
            className="outline-none shadow px-2 py-3 bg-white rounded-md w-full"
            placeholder="پیام خود را بنویسید"
            dir="rtl"
          />
          <BiSend className="text-white bg-blue-400 p-3 rounded-md min-w-5 min-h-5 box-content cursor-pointer hover:bg-blue-600 transition-colors" />
          <TbUsers
            onClick={() => setSwitchContacts((prev) => !prev)}
            className={` ${
              switchContacts ? "bottom-0" : "bottom-[-100%]"
            } text-white sm:hidden block z-20 bg-orange-400 p-3 rounded-md min-w-5 min-h-5 box-content cursor-pointer hover:bg-orange-600 transition-colors"`}
          />
        </div>
      </div>

      {/* list of people */}
      <div
        className={`sm:w-1/4 w-full z-10 min-w-[15rem] h-[100%] sm:h-auto ${
          switchContacts ? "left-0" : "left-[-100%]"
        } fixed sm:relative transition-all left-0 bg-white rounded-2xl shadow overflow-y-auto py-3`}>
        <ul className="flex flex-col">
          <li className="flex  rounded-2xl items-center justify-between p-4 mx-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleCheckBig className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
          <li className="flex  rounded-2xl items-center justify-between p-4 m-2 shadow cursor-pointer hover:shadow-2xs transition-shadow">
            <LuCircleDashed className="text-orange-400" />
            <span className="text-sm font-medium text-gray-700">جواد فلاح</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
