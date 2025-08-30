"use client";
import React, { useState, useEffect } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Yellow, Green, Red } from "../UI/Badges";
import { iranProvinces } from "../../config/Provinces";
import { url_v1 } from "@/config/urls";
import { useSession } from "next-auth/react";
import { errorToast, successToast } from "@/config/Toasts";
import UpgradeToRealEstate from "../UI/UpgradeToRealEstate";
export interface Client {
  user_type: "regular" | "admin" | "editor";
  is_active: boolean;
  profile_picture: string;
  full_name: string;
  email?: string;
  phone?: string;
  age?: number;
  marital_status?: string;
  job_title?: string;
  residence_province?: string;
  residence_city?: string;
  education?: string;
  national_id?: string;
  address?: string;
  monthly_income_min?: number;
  monthly_income_max?: number;
  office_name?: string;
  work_experience?: string;
  office_bio?: string;
  workplace_address?: string;
  consultants_count?: string;
  instagram_id?: string;
  email_address?: string;
}

export default function Account() {
  const client = useSelector(
    (state: RootState) => state.authSlice.client as Client
  );
  const { data: session } = useSession();
  const token = session?.user?.access_token;

  const [formData, setFormData] = useState({
    full_name: client.full_name || "",
    email: client.email || "",
    phone: client.phone || "",
    age: client.age?.toString() || "",
    maritalStatus: client.marital_status || "",
    jobTitle: client.job_title || "",
    selectedProvince: client.residence_province || "",
    selectedCity: client.residence_city || "",
    education: client.education || "",
    national_id: client.national_id || "",
    address: client.address || "",
    monthly_income_min: client.monthly_income_min?.toString() || "",
    monthly_income_max: client.monthly_income_max?.toString() || "",
    new_password: "",
  });
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize cities based on province
  useEffect(() => {
    if (formData.selectedProvince) {
      const found = iranProvinces.find(
        (item) => item.استان === formData.selectedProvince
      );
      setCities(found ? found.شهرها : []);
    }
  }, [formData.selectedProvince]);

  // Function to format number with commas
  const formatNumberWithCommas = (value: string): string => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    if (!cleanedValue) return "";
    return parseInt(cleanedValue).toLocaleString("en-EN");
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      name === "monthly_income_min" ||
      name === "monthly_income_max" ||
      name === "age"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: formatNumberWithCommas(value),
      }));
    } else if (name === "selectedProvince") {
      const found = iranProvinces.find((item) => item.استان === value);
      setCities(found ? found.شهرها : []);
      setFormData((prev) => ({
        ...prev,
        selectedProvince: value,
        selectedCity: "",
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
    if (formData.new_password && formData.new_password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      setIsSubmitting(false);
      return;
    }
    if (
      formData.monthly_income_min &&
      formData.monthly_income_max &&
      parseInt(formData.monthly_income_min.replace(/,/g, "")) >
        parseInt(formData.monthly_income_max.replace(/,/g, ""))
    ) {
      setError("حداقل درآمد نمی‌تواند بیشتر از حداکثر درآمد باشد");
      setIsSubmitting(false);
      return;
    }
    if (formData.age && parseInt(formData.age.replace(/,/g, "")) < 0) {
      setError("سن نمی‌تواند منفی باشد");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(url_v1("/user/profile/complete"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: formData.age ? parseInt(formData.age.replace(/,/g, "")) : null,
          marital_status: formData.maritalStatus || null,
          job_title: formData.jobTitle || null,
          residence_province: formData.selectedProvince || null,
          residence_city: formData.selectedCity || null,
          education: formData.education || null,
          national_id: formData.national_id || null,
          address: formData.address || null,
          monthly_income_min: formData.monthly_income_min
            ? parseInt(formData.monthly_income_min.replace(/,/g, ""))
            : null,
          monthly_income_max: formData.monthly_income_max
            ? parseInt(formData.monthly_income_max.replace(/,/g, ""))
            : null,
          new_password: formData.new_password || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "خطا در به‌روزرسانی اطلاعات");
      }

      successToast(result.message || "اطلاعات با موفقیت به‌روزرسانی شد");
      window.location.reload(); // Reload to reflect updated client data
    } catch (err) {
      if (err) errorToast("خطا در ارسال اطلاعات");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
          حساب کاربری
          <RiAccountCircleLine className="w-7 h-7 mx-2" />
        </span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-xl text-gray-600 mb-4">اطلاعات کاربری</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700">
              نام کامل
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700">
              شماره موبایل
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700">
              سن
            </label>
            <input
              id="age"
              name="age"
              type="text"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: 30"
            />
          </div>
          <div>
            <label
              htmlFor="maritalStatus"
              className="block text-sm font-medium text-gray-700">
              وضعیت تاهل
            </label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600">
              <option value="">انتخاب</option>
              <option value="single">مجرد</option>
              <option value="married">متاهل</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700">
              عنوان شغلی
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: مهندس نرم‌افزار"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="selectedProvince"
                className="block text-sm font-medium text-gray-700">
                استان
              </label>
              <select
                id="selectedProvince"
                name="selectedProvince"
                value={formData.selectedProvince}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600">
                <option value="">انتخاب استان</option>
                {iranProvinces.map((item) => (
                  <option key={item.استان} value={item.استان}>
                    {item.استان}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="selectedCity"
                className="block text-sm font-medium text-gray-700">
                شهر
              </label>
              <select
                id="selectedCity"
                name="selectedCity"
                value={formData.selectedCity}
                onChange={handleInputChange}
                disabled={!cities.length}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100">
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
          </div>
          <div>
            <label
              htmlFor="education"
              className="block text-sm font-medium text-gray-700">
              تحصیلات
            </label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600">
              <option value="">انتخاب کنید</option>
              <option value="دیپلم">دیپلم</option>
              <option value="کاردانی">کاردانی</option>
              <option value="کارشناسی">کارشناسی</option>
              <option value="کارشناسی ارشد">کارشناسی ارشد</option>
              <option value="دکتری">دکتری</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="national_id"
              className="block text-sm font-medium text-gray-700">
              کدملی
            </label>
            <input
              id="national_id"
              name="national_id"
              type="text"
              value={formData.national_id}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
              maxLength={10}
              pattern="[0-9]{10}"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700">
              آدرس محل سکونت
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: تهران، خیابان آزادی، کوچه ۱۲"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="monthly_income_min"
                className="block text-sm font-medium text-gray-700">
                حداقل درآمد ماهانه (تومان)
              </label>
              <input
                id="monthly_income_min"
                name="monthly_income_min"
                type="text"
                value={formData.monthly_income_min}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
                placeholder="مثال: 10,000,000"
              />
            </div>
            <div>
              <label
                htmlFor="monthly_income_max"
                className="block text-sm font-medium text-gray-700">
                حداکثر درآمد ماهانه (تومان)
              </label>
              <input
                id="monthly_income_max"
                name="monthly_income_max"
                type="text"
                value={formData.monthly_income_max}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
                placeholder="مثال: 20,000,000"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="new_password"
              className="block text-sm font-medium text-gray-700">
              رمز عبور جدید
            </label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              value={formData.new_password}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="حداقل ۸ کاراکتر"
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting
                ? "در حال به‌روزرسانی..."
                : "تایید و به‌روزرسانی اطلاعات"}
            </button>
          </div>
        </form>
      </div>
      <UpgradeToRealEstate />
    </div>
  );
}
