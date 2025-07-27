"use client";
/* eslint-disable */
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/UI/consultation/map"), {
  ssr: false,
});
import SubmitButton from "./SubmitButton";
import { addCommasToNumber } from "@/utils/digits";

type Form = {
  type: number;
  vals: any[];
};

export default function Form({ type, vals }: Form) {
  const [
    name,
    setName,
    price,
    setPrice,
    length,
    setLength,
    requestType,
    setRequestType,
    rooms,
    setRooms,
    vitals,
    setVitals,
    handleVitalsArr,
    clientPrefer,
    setClientPrefer,
    floorPrefer,
    setFloorPrefer,
    deadline,
    setDeadline,
    visitMethod,
    setVisitMethod,
    description,
    setDescription,
    rent,
    setRent,
    mortgage,
    setMortgage,
    mapSelection,
    setMapSelection,
    typeOfFunctionality,
    setTypeOfFunctionality,
    setEnvTypePrefer,
    landLocation,
    setLandLocation,
    landFunctionality,
    setLandFunctionality,
    sendReq,
    phone,
    setPhone,
  ] = vals;

  // set buy value by default on land section
  useEffect(() => {
    if (type === 4) setRequestType("خرید");
  }, [type]);
  return (
    <>
      {/*full name section */}
      <div className="relative flex flex-col gap-2 mt-4 ">
        <span className="absolute right-[-17px] top-[2px] text-red-400 text-2xl">
          *
        </span>
        <span className="mb-2 text-[var(--blue)] font-bold">نام کامل : </span>
        <input
          className="border-b-2 pb-2 px-1 outline-none sm:w-1/2"
          type="text"
          name="name"
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      {/* type of request section */}
      <div className="flex flex-col gap-2 mt-4 ">
        <span className="mb-2 text-[var(--blue)] font-bold">
          نوع درخواست :{" "}
        </span>
        <div className="flex flex-row gap-5 ">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="requestType"
              value="خرید"
              checked={requestType === "خرید" || type === 4}
              onChange={(e) => setRequestType(e.target.value)}
              className="accent-green-600"
            />
            <span>خرید</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="requestType"
              value="اجاره"
              onChange={(e) => setRequestType(e.target.value)}
              checked={requestType === "اجاره"}
              disabled={type === 4 && true}
              className="accent-blue-600"
            />
            <span>اجاره</span>
          </label>
        </div>
      </div>
      {/* number of rooms section */}
      {(type === 1 || type === 2 || type === 3) && (
        <div className="flex flex-col gap-2 mt-4">
          <span className="mb-2 text-[var(--blue)] font-bold">
            تعداد اتاق :
          </span>
          <div className="flex flex-row gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rooms"
                value="1"
                checked={rooms === "1"}
                onChange={(e) => setRooms(e.target.value)}
                className="accent-green-600"
              />
              <span>1</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rooms"
                value="2"
                checked={rooms === "2"}
                onChange={(e) => setRooms(e.target.value)}
                className="accent-green-600"
              />
              <span>2</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rooms"
                value="3"
                checked={rooms === "3"}
                onChange={(e) => setRooms(e.target.value)}
                className="accent-green-600"
              />
              <span>3</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rooms"
                value="4+"
                checked={rooms === "4+"}
                onChange={(e) => setRooms(e.target.value)}
                className="accent-green-600"
              />
              <span>4 به بالا</span>
            </label>
          </div>
        </div>
      )}
      {/* lendth seciton */}
      <div className="flex flex-col gap-2 mt-4">
        <span className="text-[var(--blue)] font-bold">
          متراژ مورد نظر ( متر ) :{" "}
        </span>
        <input
          className="border-b-2 pb-2 px-1 outline-none sm:w-1/2"
          type="text"
          name="length"
          id="length"
          onChange={(e) => setLength(addCommasToNumber(e.target.value))}
          value={length}
          placeholder="مثلا : 150 متر"
        />
      </div>
      {/* budget seciton */}
      {requestType === "اجاره" ? (
        <div className="w-full  gap-3">
          <div className="flex w-full flex-col gap-2 mt-4">
            <span className="text-[var(--blue)] font-bold">
              اجاره ( تومان ) :{" "}
            </span>
            <input
              className="border-b-2 pb-2 px-1 outline-none sm:w-1/2"
              type="text"
              name="rent"
              id="rent"
              onChange={(e) => setRent(addCommasToNumber(e.target.value))}
              value={rent}
              placeholder="مثلا : 800 میلیون"
            />
          </div>
          <div className="flex w-full flex-col gap-2 mt-4">
            <span className="text-[var(--blue)] font-bold">
              رهن ( تومان ) :{" "}
            </span>
            <input
              className="border-b-2 pb-2 px-1 outline-none sm:w-1/2"
              type="text"
              name="mortgage"
              id="mortgage"
              onChange={(e) => setMortgage(addCommasToNumber(e.target.value))}
              value={mortgage}
              placeholder="مثلا : 800 میلیون"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">
            بودجه مورد نظر ( تومان ) :{" "}
          </span>
          <input
            className="border-b-2 pb-2 px-1 outline-none sm:w-1/2"
            type="text"
            name="budget"
            id="budget"
            onChange={(e) => setPrice(addCommasToNumber(e.target.value))}
            value={price}
            placeholder="مثلا : 800 میلیون"
          />
        </div>
      )}
      {/* phone number section */}
      <div className="relative flex flex-col gap-2 mt-4">
        <span className="absolute right-[-17px] top-[2px] text-red-400 text-2xl">
          *
        </span>
        <span className="text-[var(--blue)] font-bold">شماره تماس : </span>
        <div className="relative">
          <input
            className="border-b-2 pb-2 pl-10 outline-none w-1/2"
            type="text"
            name="budget"
            id="budget"
            dir="ltr"
            maxLength={10}
            onChange={(e) => setPhone(e.currentTarget.value)}
            value={phone}
            placeholder="شماره تماس"
          />
          <span className="opacity-60 absolute md:right-[50%] select-none">
            | 98+
          </span>
        </div>
      </div>
      {/* land functionality section */}
      {type === 4 && (
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">کاربری زمین : </span>
          <div className="flex flex-row gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Land"
                value="بایر"
                checked={landFunctionality === "بایر"}
                onChange={(e) => setLandFunctionality(e.target.value)}
                className="accent-green-600"
              />
              <span>بایر</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Land"
                value="باغ و کشاورزی"
                checked={landFunctionality === "باغ و کشاورزی"}
                onChange={(e) => setLandFunctionality(e.target.value)}
                className="accent-green-600"
              />
              <span>باغ و کشاورزی</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="Land"
                value="سایر"
                checked={landFunctionality === "سایر"}
                onChange={(e) => setLandFunctionality(e.target.value)}
                className="accent-green-600"
              />
              <span>سایر</span>
            </label>
          </div>
        </div>
      )}
      {/* land location */}
      {type === 4 && (
        <div className="relative flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">
            موقعیت مکانی زمین :{" "}
          </span>
          <div className="flex flex-row gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="landLocation"
                value="داخل شهر"
                checked={landLocation === "داخل شهر"}
                onChange={(e) => setLandLocation(e.target.value)}
                className="accent-green-600"
              />
              <span>داخل شهر</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="landLocation"
                value="بیرون شهر"
                checked={landLocation === "بیرون شهر"}
                onChange={(e) => setLandLocation(e.target.value)}
                className="accent-green-600"
              />
              <span>بیرون شهر</span>
            </label>
          </div>
        </div>
      )}
      {/* Type of functionality section */}
      {type === 2 && (
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">نوع کاربری : </span>
          <input
            className="border-b-2 pb-2 px-1 outline-none sm:w-1/2"
            type="text"
            name="typeOfFunctionality"
            id="typeOfFunctionality"
            value={typeOfFunctionality}
            onChange={(e) => setTypeOfFunctionality(e.target.value)}
            placeholder="رستوران ، فروشگاه ، رستوران ، بیمه ..."
          />
        </div>
      )}
      {/* env type prefer */}
      {(type === 2 || type === 3) && (
        <div className="relative flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">
            چه نوع فضای کاری را ترجیح میدهید :
          </span>
          <div className="flex flex-row gap-5">
            <select
              name="env"
              id="env"
              onChange={(e) => setEnvTypePrefer(e.target.value)}
              className="bg-[var(--box)]/40  backdrop:blur-3xl bg-opacity-40 backdrop-blur-md shadow-lg shadow-black/20 sm:w-[40%] w-full px-4 py-3 rounded-xl cursor-pointer border border-white/30 transition-all duration-200 hover:shadow-2xl ">
              <option className="text-black font-bold" value="اصلی">
                خیابان اصلی
              </option>
              <option className="text-black font-bold" value="فرعی">
                خیابان فرعی
              </option>
              <option
                className="text-black font-bold"
                value="پاساژ و مجتمع تجاری">
                پاساژ و مجتمع تجاری
              </option>
            </select>
          </div>
        </div>
      )}
      {/* vital requirements */}
      {(type === 1 || type === 2 || type === 3) && (
        <div className="relative flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">امکانات ضوروی : </span>
          <div className="flex flex-row gap-5 flex-wrap">
            <label htmlFor="parking">
              <input
                className="ml-2"
                type="checkbox"
                name="parking"
                checked={vitals.includes("پارکینگ")}
                onChange={() => handleVitalsArr("پارکینگ", vitals, setVitals)}
                id="parking"
              />
              پارکینگ
            </label>
            <label htmlFor="elevator">
              <input
                className="ml-2"
                type="checkbox"
                name="elevator"
                checked={vitals.includes("آسانسور")}
                onChange={() => handleVitalsArr("آسانسور", vitals, setVitals)}
                id="elevator"
              />
              آسانسور
            </label>
            <label htmlFor="warehouse">
              <input
                className="ml-2"
                type="checkbox"
                name="warehouse"
                checked={vitals.includes("انباری")}
                onChange={() => handleVitalsArr("انباری", vitals, setVitals)}
                id="warehouse"
              />
              انباری
            </label>
            <label htmlFor="yard">
              <input
                className="ml-2"
                type="checkbox"
                name="yard"
                checked={vitals.includes("حیاط / بالکن")}
                onChange={() =>
                  handleVitalsArr("حیاط / بالکن", vitals, setVitals)
                }
                id="yard"
              />
              حیاط / بالکن
            </label>
            <label htmlFor="master">
              <input
                className="ml-2"
                type="checkbox"
                name="master"
                checked={vitals.includes("اتاق مستر")}
                onChange={() => handleVitalsArr("اتاق مستر", vitals, setVitals)}
                id="master"
              />
              اتاق مستر
            </label>
            <label htmlFor="garden">
              <input
                className="ml-2"
                type="checkbox"
                name="yard"
                checked={vitals.includes("روف گاردن")}
                onChange={() => handleVitalsArr("روف گاردن", vitals, setVitals)}
                id="garden"
              />
              روف گاردن
            </label>
          </div>
        </div>
      )}
      {/* clients prefer */}
      {type === 1 && (
        <div className="relative flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">
            چه ملکی را ترجیح میدهید :
          </span>
          <div className="flex flex-row gap-5 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                value="ویلایی"
                checked={clientPrefer === "ویلایی"}
                onChange={(e) => setClientPrefer(e.target.value)}
                className="accent-green-600"
              />
              <span>ویلایی</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                value="آپارتمان"
                checked={clientPrefer === "آپارتمان"}
                onChange={(e) => setClientPrefer(e.target.value)}
                className="accent-green-600"
              />
              <span>آپارتمان</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                value="مجتمع مسکونی"
                checked={clientPrefer === "مجتمع مسکونی"}
                onChange={(e) => setClientPrefer(e.target.value)}
                className="accent-green-600"
              />
              <span>مجتمع مسکونی</span>
            </label>
          </div>
        </div>
      )}
      {/* floor prefer */}
      {(type === 1 || type === 2 || type === 3) && (
        <div className="relative flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">
            چه طبقه ای را برای سکونت ترجیح می دهید :
          </span>
          <div className="flex flex-row gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="floor"
                value="پایین"
                checked={floorPrefer === "پایین"}
                onChange={(e) => setFloorPrefer(e.target.value)}
                className="accent-green-600"
              />
              <span>طبقه پایینی</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="floor"
                value="بالا"
                checked={floorPrefer === "بالا"}
                onChange={(e) => setFloorPrefer(e.target.value)}
                className="accent-green-600"
              />
              <span>طبقه بالایی</span>
            </label>
          </div>
        </div>
      )}
      {/* deadline */}
      <div className="relative flex flex-col gap-2 mt-4">
        <span className="text-[var(--blue)] font-bold">
          فرصت مورد نیاز شما برای پیداکردن فایل و قرار داد نهایی!؟
        </span>
        <div className="flex flex-row gap-5 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deadline"
              value="فوری"
              checked={deadline === "فوری"}
              onChange={(e) => setDeadline(e.target.value)}
              className="accent-green-600"
            />
            <span>فوری</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deadline"
              value="دو هفته"
              checked={deadline === "دو هفته"}
              onChange={(e) => setDeadline(e.target.value)}
              className="accent-green-600"
            />
            <span>دو هفته</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deadline"
              value="یک ماه"
              checked={deadline === "یک ماه"}
              onChange={(e) => setDeadline(e.target.value)}
              className="accent-green-600"
            />
            <span>یک ماه</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deadline"
              value="بلند مدت"
              checked={deadline === "بلند مدت"}
              onChange={(e) => setDeadline(e.target.value)}
              className="accent-green-600"
            />
            <span>بلند مدت / سرمایه گذاری</span>
          </label>
        </div>
      </div>
      {/* Map */}
      <div>
        <div className="relative flex flex-col gap-2 mt-4">
          <span className="text-[var(--blue)] font-bold">محله مورد نظر : </span>
          {/* map will render from map.tsx component */}
          <Map mapSelection={mapSelection} setMapSelection={setMapSelection} />
        </div>
      </div>
      {/* how section */}
      <div className="relative flex flex-col gap-2 mt-4">
        <span className="text-[var(--blue)] font-bold">
          طریقه آشنایی با هومینکس :{" "}
        </span>
        <div className="flex flex-row gap-5 flex-wrap">
          <label htmlFor="instagram">
            <input
              className="ml-2"
              type="radio"
              name="instagram"
              value="اینستاگرام"
              checked={visitMethod === "اینستاگرام"}
              onChange={(e) => setVisitMethod(e.target.value)}
              id="instagram"
            />
            اینستاگرام
          </label>
          <label htmlFor="telegram">
            <input
              className="ml-2"
              type="radio"
              name="telegram"
              value="تلگرام"
              checked={visitMethod === "تلگرام"}
              onChange={(e) => setVisitMethod(e.target.value)}
              id="telegram"
            />
            تلگرام
          </label>
          <label htmlFor="friends">
            <input
              className="ml-2"
              type="radio"
              name="friends"
              value="دوستان"
              checked={visitMethod === "دوستان"}
              onChange={(e) => setVisitMethod(e.target.value)}
              id="friends"
            />
            معرفی دوستان
          </label>
          <label htmlFor="other">
            <input
              className="ml-2"
              type="radio"
              name="other"
              value="سایر"
              checked={visitMethod === "سایر"}
              onChange={(e) => setVisitMethod(e.target.value)}
              id="other"
            />
            سایر
          </label>
        </div>
      </div>
      {/* explanation section */}
      <div className="relative flex flex-col gap-2 mt-4">
        <span className="text-[var(--blue)] font-bold">توضیحات تکمیلی : </span>
        <textarea
          name="explanation"
          id="explanation"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none outline-none border-white border-b-2 text-white/60 pb-0"></textarea>
      </div>
      {/* submit button */}
      <SubmitButton
        title={`ثبت درخواست مشاوره ${
          ["مسکونی", "تجاری", "اداری", "زمین"][type - 1]
        }`}
        handleFunc={sendReq}
      />
    </>
  );
}
