"use client";
import React from "react";
import Form from "../UI/Form";
import { useState } from "react";
import { FaRegListAlt } from "react-icons/fa";
import CreatedProperties from "../UI/CreatedProperties";
export default function Management() {
  const [mapSelection, setMapSelection] = useState<string[]>([]);
  const [_switch, _setSwitch] = useState<boolean>(false);
  const vals = [mapSelection, setMapSelection];

  return (
    <div dir="rtl" className="m-3">
      <div className="flex flex-row">
        <span className="text-xl font-bold text-gray-600 mb-6 flex flex-row-reverse w-full items-center justify-end">
          {!_switch ? " فرم ثبت آگهی ملک " : "آگهی های ثبت شده"}
          <FaRegListAlt className="w-7 h-7 mx-2" />
        </span>
        <div className="flex flex-row">
          <button
            onClick={() => _setSwitch(false)}
            className={`${
              !_switch ? "bg-blue-600 font-bold" : "bg-blue-400"
            } shadow-2xl cursor-pointer hover:font-bold transition-all text-white p-3 rounded-tr-xl rounded-br-xl`}>
            ثبت
          </button>
          <button
            onClick={() => _setSwitch(true)}
            className={`${
              _switch ? "bg-blue-600 font-bold" : "bg-blue-400"
            } text-white cursor-pointer hover:font-bold transition-all p-3 rounded-tl-xl rounded-bl-xl`}>
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
