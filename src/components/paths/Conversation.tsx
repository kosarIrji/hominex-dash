import React from "react";
import { BiSend } from "react-icons/bi";
import { LuCircleDashed } from "react-icons/lu";
import { LuCircleCheckBig } from "react-icons/lu";
export default function Conversation() {
  return (
    <div className="flex flex-row w-full h-full">
      {/* chat box */}
      <div className="relative w-full sm:w-3/4 sm:p-5">
        <ul className="flex flex-col gap-8 ">
          <li className="bg-blue-400 p-2 relative rounded-md text-white w-fit self-end">
            سلام خوبی؟ قیمت دقیق این ملک چنده ؟
            <span className="absolute text-sm left-0 bottom-[-1.5rem] text-gray-500">
              8:20
            </span>
          </li>
          <li className="bg-gray-600 p-2 relative rounded-md text-white w-fit self-start">
            سلام قیمت رو میتونین تو بخش اطلاعات ملک مشاهده کنین
            <span className="absolute text-sm right-0 bottom-[-1.5rem] text-gray-500">
              9:12
            </span>
          </li>
        </ul>
        <div className="w-full absolute bottom-0 left-0  flex flex-row justify-end items-center gap-3  px-5">
          <input
            type="text"
            className="outline-none shadow p-2 bg-white rounded-md w-full"
            placeholder="پیام خود را بنویسید"
            dir="rtl"
          />
          <BiSend className="text-white bg-blue-400 p-3 rounded-md max-w-5 max-h-5 box-content cursor-pointer hover:bg-blue-600 transition-colors" />
        </div>
      </div>

      {/* list of people */}
      <div className=" sm:w-1/4 w-full z-10 min-w-[15rem] h-[50%] sm:h-auto bottom-0 fixed sm:relative left-0 bg-white rounded-2xl shadow overflow-y-auto py-3">
        <span className="absolute top-[-2rem] left-5 z-10 bg-red-500 text-white p-3 rounded-md">
          X
        </span>
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
