import React from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import AccountInfo from "../UI/AccountInfo";

export default function Account() {
  return (
    <div dir="rtl" className="m-3">
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold text-xl text-gray-600 flex flex-row-reverse justify-center items-center">
          حساب کاربری
          <RiAccountCircleLine className="w-5 h-5 mx-2" />
        </span>
      </div>
      <AccountInfo />
    </div>
  );
}
