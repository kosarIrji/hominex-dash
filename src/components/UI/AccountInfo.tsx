"use client";
import React, { useEffect, useState } from "react";
import { iranProvinces } from "../../config/Provinces";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { url_v1 } from "@/config/urls";
import { useSession } from "next-auth/react";
import { errorToast, successToast } from "@/config/Toasts";

export default function AccountInfo() {
  const client = useSelector((state: RootState) => state.authSlice.client);
  const [cities, setCities] = useState<string[]>([]);

  const [form, setForm] = useState({
    selectedProvince: "",
    selectedCity: "",
    maritalStatus: "",
    jobTitle: "",
    age: 0,
  });

  const session = useSession();
  const token = session.data?.user?.access_token;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "selectedProvince") {
      const found = iranProvinces.find((item) => item.استان === value);
      setCities(found ? found.شهرها : []);
      setForm((prev) => ({ ...prev, selectedCity: "" }));
    }
  };

  useEffect(() => {
    if (client) {
      setForm({
        selectedProvince: client.residence_province || "",
        selectedCity: client.residence_city || "",
        maritalStatus: client.marital_status || "",
        jobTitle: client.job_title || "",
        age: client.age || 0,
      });

      if (client.residence_province) {
        const found = iranProvinces.find(
          (item) => item.استان === client.residence_province
        );
        setCities(found ? found.شهرها : []);
      }
    }
  }, [client]);

  const handleCompleteProfile = async () => {
    try {
      const response = await fetch(url_v1("/user/profile/complete"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: form.age,
          marital_status: form.maritalStatus,
          job_title: form.jobTitle,
          residence_province: form.selectedProvince,
          residence_city: form.selectedCity,
        }),
      });

      const res = await response.json();

      if (response.ok) {
        successToast(res.message);
        window.location.reload(); // reloads the current page
      } else {
        errorToast(res.message);
      }
    } catch (e) {
      console.log(e);
      errorToast("خطا در ارسال اطلاعات");
    }
  };

  return (
    <div className="p-4" dir="rtl">
      <div className="max-w-7xl mx-auto sm:p-6 grid gap-6">
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
              placeholder={client?.full_name || ""}
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
              placeholder={client?.email || ""}
              disabled
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            />
          </div>
        </div>

        {/* DOB & Phone */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="dob" className="font-medium text-gray-700 mb-1">
              سن
            </label>
            <input
              id="dob"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
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
              placeholder={client?.phone || ""}
              disabled
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            />
          </div>
        </div>

        {/* Marital Status & Job Title */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="maritalStatus"
              className="font-medium text-gray-700 mb-1">
              وضعیت تاهل
            </label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300">
              <option value="">انتخاب</option>
              <option value="single">مجرد</option>
              <option value="married">متاهل</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="jobTitle"
              className="font-medium text-gray-700 mb-1">
              عنوان شغلی
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={form.jobTitle}
              onChange={handleChange}
              placeholder={client?.job_title || ""}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
          </div>
        </div>

        {/* Province, City, Landlord */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="province"
              className="font-medium text-gray-700 mb-1">
              استان
            </label>
            <select
              id="province"
              name="selectedProvince"
              value={form.selectedProvince}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">انتخاب استان</option>
              {iranProvinces.map((item) => (
                <option key={item.استان} value={item.استان}>
                  {item.استان}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="city" className="font-medium text-gray-700 mb-1">
              شهر
            </label>
            <select
              id="city"
              name="selectedCity"
              value={form.selectedCity}
              onChange={handleChange}
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

          {/* <div className="flex flex-col">
            <label
              htmlFor="landlord"
              className="font-medium text-gray-700 mb-1">
              آیا صاحب‌خانه هستید؟
            </label>
            <select
              id="landlord"
              name="landlord"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">انتخاب</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </div> */}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleCompleteProfile}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer">
            تایید اطلاعات
          </button>
        </div>
      </div>
    </div>
  );
}
