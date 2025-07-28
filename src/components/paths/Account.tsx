import React from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import AccountInfo from "../UI/AccountInfo";
import Image from "next/image";
import { RiEditBoxLine } from "react-icons/ri";

export default function Account() {
  return (
    <div dir="rtl" className="m-3">
      <div className="relative bg-[url('/assets/img/propertyBG.jpg')] bg-cover w-full h-[10rem] rounded-xl mb-10">
        <div className="absolute w-fit h-fit left-10 bottom-[-2rem] flex justify-center items-center overflow-hidden">
          <RiEditBoxLine className="absolute w-full h-full p-10 text-white bg-black/30 rounded-full cursor-pointer" />
          <Image
            src={"/assets/img/profile.png"}
            width={100}
            height={100}
            alt="profile picture"
            className="  rounded-full border-4 border-blue-600"
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold text-xl text-gray-600 flex flex-row-reverse justify-center items-center">
          حساب کاربری
          <RiAccountCircleLine className="w-7 h-7 mx-2" />
        </span>
      </div>
      <AccountInfo />
    </div>
  );
}
