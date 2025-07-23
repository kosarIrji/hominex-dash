import React from "react";
import { GoPlusCircle } from "react-icons/go";
import Table from "../UI/Table";
import { LuTickets } from "react-icons/lu";

export default function Tickets() {
  return (
    <div dir="rtl">
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold text-xl text-gray-600 flex flex-row-reverse justify-center items-center">
          تیکت ها <LuTickets className="w-5 h-5 mx-2" />
        </span>
        <button
          type="button"
          className="inline-fle cursor-pointer gap-3 flex flex-row justify-center items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          افزودن
          <GoPlusCircle />
        </button>
      </div>
      <Table />
    </div>
  );
}
