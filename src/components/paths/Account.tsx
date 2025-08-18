import React from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import AccountInfo from "../UI/AccountInfo";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Yellow, Green, Red } from "../UI/Badges";
import { concatWithPlus } from "@/lib/concatWithPlus";
export default function Account() {
  const client = useSelector((state: RootState) => state.authSlice.client);
  return (
    <div dir="rtl" className="max-w-7xl mx-auto md:p-6 py-3 space-y-10">
      <div className="relative bg-[url('/assets/img/propertyBG.jpg')] bg-cover w-full h-[10rem] rounded-xl mb-10">
        <div className="pt-5 pr-5">
          <Yellow
            value={`دسترسی ${
              client.user_type === "regular"
                ? "کاربر"
                : client.user_type === "admin"
                ? "ادمین"
                : "ویراستار"
            }`}
          />
          {client.is_active ? (
            <Green value="وضعیت فعال" />
          ) : (
            <Red value="وضعیت غیرفعال" />
          )}
        </div>
        <div className="absolute w-fit h-fit md:left-10 left-5 bottom-[-2rem] flex justify-center items-center ">
          {/* <RiEditBoxLine className="absolute w-full h-full p-10 text-white bg-black/30 rounded-full cursor-pointer" /> */}
          <Image
            src={client.profile_picture + concatWithPlus(client.full_name)}
            width={100}
            height={100}
            alt="profile picture"
            className="rounded-full md:w-20 md:h-20 w-20 h-20  border-4 border-blue-600"
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold md:text-2xl text-lg  text-gray-600 flex flex-row-reverse justify-center items-center">
          حساب کاربری
          <RiAccountCircleLine className="w-7 h-7 mx-2" />
        </span>
      </div>
      <AccountInfo />
    </div>
  );
}
