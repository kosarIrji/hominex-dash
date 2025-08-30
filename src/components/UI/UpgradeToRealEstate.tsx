"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { url_v1 } from "@/config/urls";
import { successToast, errorToast } from "@/config/Toasts";
import { PiScissorsLight } from "react-icons/pi";
import { PiBuildingsLight } from "react-icons/pi";
import Image from "next/image";
import { Client } from "../paths/Account";
import { CiCirclePlus } from "react-icons/ci";

export default function UpgradeToRealEstate() {
  const client = useSelector(
    (state: RootState) => state.authSlice.client as Client
  );
  const { data: session } = useSession();
  const token = session?.user?.access_token;

  const [formData, setFormData] = useState({
    office_name: client.office_name || "",
    work_experience: client.work_experience || "",
    office_bio: client.office_bio || "",
    workplace_address: client.workplace_address || "",
    consultants_count: client.consultants_count?.toString() || "",
    instagram_id: client.instagram_id?.toString() || "",
    email_address: client.email_address?.toString() || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to format number with commas
  const formatNumberWithCommas = (value: string): string => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    if (!cleanedValue) return "";
    return parseInt(cleanedValue).toLocaleString("en-EN");
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "consultants_count") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatNumberWithCommas(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.office_name) {
      setError("نام دفتر الزامی است");
      setIsSubmitting(false);
      return;
    }
    if (!formData.work_experience) {
      setError("سابقه کاری الزامی است");
      setIsSubmitting(false);
      return;
    }
    if (!formData.workplace_address) {
      setError("آدرس محل کار الزامی است");
      setIsSubmitting(false);
      return;
    }
    if (
      formData.consultants_count &&
      parseInt(formData.consultants_count.replace(/,/g, "")) < 0
    ) {
      setError("تعداد مشاورین نمی‌تواند منفی باشد");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(url_v1("/user/upgrade-to-real-estate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          office_name: formData.office_name,
          work_experience: formData.work_experience,
          office_bio: formData.office_bio || null,
          workplace_address: formData.workplace_address,
          consultants_count: formData.consultants_count
            ? parseInt(formData.consultants_count.replace(/,/g, ""))
            : null,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "خطا در ارسال درخواست ارتقاء");
      }

      successToast(result.message || "درخواست ارتقاء با موفقیت ارسال شد");
      window.location.reload(); // Reload to reflect updated client data
    } catch (err) {
      if (err) errorToast("خطا در ارسال درخواست");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto  py-3 space-y-10">
      <div className="flex flex-row items-center justify-between">
        <span className="w-full font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
          <PiScissorsLight />
          <div className="w-full border border-dashed border-gray-500"></div>
        </span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
          ارتقا به دفتر املاک
          <PiBuildingsLight className="w-7 h-7 mx-2" />
        </span>
      </div>
      <div className="w-full flex justify-end">
        <div className="relative w-fit h-fit left-0 bottom-[-1rem] flex justify-center items-center">
          <input type="file" name="profile" id="profile" className="hidden" />
          <label htmlFor="profile">
            <CiCirclePlus
              name="profile"
              id="profile"
              className="absolute right-[-0rem] bottom-[-0rem] cursor-pointer text-white rounded-full bg-blue-500 w-7 h-7 font-bold"
            />
          </label>
          {/* client.profile_picture + concatWithPlus(client.full_name) */}
          <Image
            src={"/assets/img/logo.png"}
            width={100}
            height={100}
            unoptimized={true}
            alt="profile picture"
            className="rounded-lg md:w-20 md:h-20 w-20 h-20"
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="office_name"
              className="block text-sm font-medium text-gray-700">
              نام دفتر
            </label>
            <input
              id="office_name"
              name="office_name"
              type="text"
              value={formData.office_name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: املاک پارسیان"
              required
            />
          </div>
          <div>
            <label
              htmlFor="work_experience"
              className="block text-sm font-medium text-gray-700">
              سابقه کاری
            </label>
            <select
              id="work_experience"
              name="work_experience"
              value={formData.work_experience}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              required>
              <option value="">انتخاب کنید</option>
              <option value="کمتر از ۱ سال">کمتر از ۱ سال</option>
              <option value="۱-۳ سال">۱-۳ سال</option>
              <option value="۳-۵ سال">۳-۵ سال</option>
              <option value="بیش از ۵ سال">بیش از ۵ سال</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="office_bio"
              className="block text-sm font-medium text-gray-700">
              بیو دفتر
            </label>
            <textarea
              id="office_bio"
              name="office_bio"
              value={formData.office_bio}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="توضیحاتی درباره دفتر املاک خود بنویسید"
              rows={4}
            />
          </div>
          <div>
            <label
              htmlFor="workplace_address"
              className="block text-sm font-medium text-gray-700">
              آدرس محل کار
            </label>
            <input
              id="workplace_address"
              name="workplace_address"
              type="text"
              value={formData.workplace_address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: تهران، خیابان آزادی، کوچه ۱۲"
              required
            />
          </div>
          <div>
            <label
              htmlFor="consultants_count"
              className="block text-sm font-medium text-gray-700">
              تعداد مشاورین
            </label>
            <input
              id="consultants_count"
              name="consultants_count"
              type="text"
              value={formData.consultants_count}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: ۵"
            />
          </div>

          {/* socials */}
          <div>
            <label
              htmlFor="workplace_address"
              className="block text-sm font-medium text-gray-700">
              اینستاگرام
            </label>
            <input
              id="instagram_id"
              name="instagram_id"
              type="text"
              value={formData.instagram_id}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="@Hominex.ir"
              required
            />
          </div>
          <div>
            <label
              htmlFor="consultants_count"
              className="block text-sm font-medium text-gray-700">
              آدرس ایمیل
            </label>
            <input
              id="email_address"
              name="email_address"
              type="text"
              value={formData.email_address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="hominex@gmail.com"
            />
          </div>
          {error && (
            <div className="md:col-span-2 text-sm text-red-500" role="alert">
              {error}
            </div>
          )}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "در حال ارسال..." : "ارسال درخواست ارتقاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
