"use client";

import React, { useState } from "react";
import { iranProvinces } from "../../config/Provinces"; // adjust path as needed

export default function AccountInfo() {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    const found = iranProvinces.find((item) => item.استان === province);
    setCities(found ? found.شهرها : []);
    setSelectedCity("");
  };

  return (
    <div className="p-4" dir="rtl">
      <form className="max-w-7xl mx-auto sm:p-6 grid gap-6">
        {/* Full Name & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="fullname"
              className="font-medium text-gray-700 mb-1">
              نام کامل
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="علی فلاح"
              disabled
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              placeholder="ali@example.com"
              disabled
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            />
          </div>
        </div>

        {/* DOB & Phone */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="dob" className="font-medium text-gray-700 mb-1">
              تاریخ تولد
            </label>
            <input
              id="dob"
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="font-medium text-gray-700 mb-1">
              شماره موبایل
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+98 9356541212"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Province, City, Landlord */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Province */}
          <div className="flex flex-col">
            <label
              htmlFor="province"
              className="font-medium text-gray-700 mb-1">
              استان
            </label>
            <select
              id="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">انتخاب استان</option>
              {iranProvinces.map((item) => (
                <option key={item.استان} value={item.استان}>
                  {item.استان}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label htmlFor="city" className="font-medium text-gray-700 mb-1">
              شهر
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!cities.length}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
              <option value="">
                {cities.length ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Landlord */}
          <div className="flex flex-col">
            <label
              htmlFor="landlord"
              className="font-medium text-gray-700 mb-1">
              آیا صاحب‌خانه هستید؟
            </label>
            <select
              id="landlord"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">انتخاب</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer">
            تایید اطلاعات
          </button>
        </div>
      </form>
    </div>
  );
}
