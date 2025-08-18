"use client";
import React from "react";
import Form from "../UI/Form";
import { useState } from "react";
import { FaRegListAlt } from "react-icons/fa";
import CreatedProperties from "../UI/CreatedProperties";
export default function Management() {
  // const [mapSelection, setMapSelection] = useState<string[]>([]);
  const [_switch, _setSwitch] = useState<boolean>(false);
  // const vals = [mapSelection, setMapSelection];

  return (
    <div dir="rtl" className="max-w-7xl mx-auto md:p-6 py-3 space-y-10">
      <div className="relative flex items-center mb-6 flex-row">
        <span className="md:text-2xl mt-10 text-lg font-bold text-gray-600 flex flex-row-reverse w-full items-center justify-end">
          {!_switch ? " فرم ثبت آگهی ملک " : "آگهی های ثبت شده"}
          <FaRegListAlt className="w-7 h-7 mx-2" />
        </span>
        <div className="absolute md:block top-[-10px] md:top-0 left-0 flex h-fit flex-row">
          <button
            onClick={() => _setSwitch(false)}
            className={`${
              !_switch ? "bg-blue-600 text-[10px] font-bold" : "bg-blue-400"
            } shadow-2xl cursor-pointer hover:font-bold transition-all text-white p-2 md:p-3 rounded-tr-xl rounded-br-xl`}>
            ثبت
          </button>
          <button
            onClick={() => _setSwitch(true)}
            className={`${
              _switch ? "bg-blue-600 text-[10px] font-bold" : "bg-blue-400"
            } text-white cursor-pointer hover:font-bold transition-all p-2 md:p-3 rounded-tl-xl rounded-bl-xl`}>
            مشاهده
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        {!_switch ? <Form /> : <CreatedProperties />}
      </div>
    </div>
  );
}
