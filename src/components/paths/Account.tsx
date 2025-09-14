/* eslint-disable */
"use client";
import React, { useState, useEffect } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Yellow, Green, Red } from "../UI/Badges";
import { iranProvinces } from "../../config/Provinces";
import { url_v1 } from "@/config/urls";
import { useSession } from "next-auth/react";
import { successToast } from "@/config/Toasts";
import UpgradeToRealEstate from "../UI/UpgradeToRealEstate";

// src/types/client.ts (or wherever IClient is defined)
export interface IClient {
  user_type: "regular" | "admin" | "editor";
  is_active: boolean;
  profile_image_url: string;
  full_name: string;
  email?: string;
  phone?: string;
  age?: number;
  marital_status?: "single" | "married" | "divorced" | "widowed";
  job_title?: string;
  residence_province?: string;
  residence_city?: string;
  education_level?:
    | "under_diploma"
    | "diploma"
    | "associate"
    | "bachelor"
    | "master"
    | "phd";
  national_code?: string;
  address?: string;
}

export default function Account() {
  const client = useSelector((state: RootState) => state.authSlice.client);
  const { data: session } = useSession();
  const token = session?.user?.access_token;

  const [formData, setFormData] = useState({
    full_name: client?.full_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    age: client?.age?.toString() || "",
    marital_status: client?.marital_status || "",
    job_title: client?.job_title || "",
    selectedProvince: client?.residence_province || "",
    selectedCity: client?.residence_city || "",
    education_level: client?.education_level || "",
    national_code: client?.national_code || "",
    address: client?.address || "",
    new_password: "",
    new_password_confirmation: "",
    profile_image: null as File | null,
  });
  const [cities, setCities] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({
    profile: null,
    complete: null,
    image: null,
    password: null,
  });
  const [isSubmitting, setIsSubmitting] = useState({
    profile: false,
    complete: false,
    image: false,
    password: false,
  });

  // Initialize cities based on province
  useEffect(() => {
    if (formData.selectedProvince) {
      const found = iranProvinces.find(
        (item) => item.استان === formData.selectedProvince
      );
      setCities(found ? found.شهرها : []);
    }
  }, [formData.selectedProvince]);

  // Iranian national code validation
  const validateNationalCode = (code: string): boolean => {
    if (!/^\d{10}$/.test(code)) return false;
    const check = parseInt(code[9]);
    const sum = code
      .slice(0, 9)
      .split("")
      .reduce((acc, digit, i) => acc + parseInt(digit) * (10 - i), 0);
    const remainder = sum % 11;
    return remainder < 2 ? check === remainder : check === 11 - remainder;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "age") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
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
    setErrors((prev) => ({
      ...prev,
      profile: null,
      complete: null,
      password: null,
    }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setErrors((prev) => ({ ...prev, image: null }));
    if (file && file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "حجم تصویر باید کمتر از ۲ مگابایت باشد",
      }));
      return;
    }
    if (file && !["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "فرمت تصویر باید jpeg، jpg یا png باشد",
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, profile_image: file }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, profile: null }));
    setIsSubmitting((prev) => ({ ...prev, profile: true }));

    try {
      const response = await fetch(url_v1("/user/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 422) {
          throw new Error("اطلاعات وارد شده نامعتبر است");
        }
        if (response.status === 401) {
          throw new Error("لطفاً دوباره وارد شوید");
        }
        throw new Error(result.message || "خطا در به‌روزرسانی اطلاعات");
      }

      successToast(result.message || "پروفایل با موفقیت به‌روزرسانی شد");
    } catch (err) {
      if (err) {
        setErrors((prev) => ({
          ...prev,
          profile: "خطا در ارسال اطلاعات",
        }));
      }
    } finally {
      setIsSubmitting((prev) => ({ ...prev, profile: false }));
    }
  };

  // Handle profile completion
  const handleProfileComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, complete: null }));
    setIsSubmitting((prev) => ({ ...prev, complete: true }));

    // Validation
    if (
      formData.age &&
      (isNaN(parseInt(formData.age)) ||
        parseInt(formData.age) < 18 ||
        parseInt(formData.age) > 100)
    ) {
      setErrors((prev) => ({
        ...prev,
        complete: "سن باید بین ۱۸ تا ۱۰۰ باشد",
      }));
      setIsSubmitting((prev) => ({ ...prev, complete: false }));
      return;
    }
    if (formData.job_title && formData.job_title.length > 100) {
      setErrors((prev) => ({
        ...prev,
        complete: "عنوان شغلی حداکثر ۱۰۰ کاراکتر باشد",
      }));
      setIsSubmitting((prev) => ({ ...prev, complete: false }));
      return;
    }
    if (formData.selectedProvince && formData.selectedProvince.length > 100) {
      setErrors((prev) => ({
        ...prev,
        complete: "استان حداکثر ۱۰۰ کاراکتر باشد",
      }));
      setIsSubmitting((prev) => ({ ...prev, complete: false }));
      return;
    }
    if (formData.selectedCity && formData.selectedCity.length > 100) {
      setErrors((prev) => ({
        ...prev,
        complete: "شهر حداکثر ۱۰۰ کاراکتر باشد",
      }));
      setIsSubmitting((prev) => ({ ...prev, complete: false }));
      return;
    }
    if (
      formData.national_code &&
      !validateNationalCode(formData.national_code)
    ) {
      setErrors((prev) => ({ ...prev, complete: "کدملی نامعتبر است" }));
      setIsSubmitting((prev) => ({ ...prev, complete: false }));
      return;
    }
    if (formData.address && formData.address.length > 500) {
      setErrors((prev) => ({
        ...prev,
        complete: "آدرس حداکثر ۵۰۰ کاراکتر باشد",
      }));
      setIsSubmitting((prev) => ({ ...prev, complete: false }));
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
          age: formData.age ? parseInt(formData.age) : null,
          marital_status: formData.marital_status || null,
          job_title: formData.job_title || null,
          residence_province: formData.selectedProvince || null,
          residence_city: formData.selectedCity || null,
          education_level: formData.education_level || null,
          national_code: formData.national_code || null,
          address: formData.address || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 422) {
          throw new Error("اطلاعات وارد شده نامعتبر است");
        }
        if (response.status === 401) {
          throw new Error("لطفاً دوباره وارد شوید");
        }
        throw new Error(result.message || "خطا در تکمیل پروفایل");
      }

      successToast(result.message || "پروفایل با موفقیت تکمیل شد");
    } catch (err) {
      if (err) {
        setErrors((prev) => ({
          ...prev,
          complete: "خطا در ارسال اطلاعات",
        }));
      }
    } finally {
      setIsSubmitting((prev) => ({ ...prev, complete: false }));
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, image: null }));
    if (!formData.profile_image) {
      setErrors((prev) => ({ ...prev, image: "لطفاً یک تصویر انتخاب کنید" }));
      return;
    }

    setIsSubmitting((prev) => ({ ...prev, image: true }));
    const formDataToSend = new FormData();
    formDataToSend.append("profile_image", formData.profile_image);

    try {
      const response = await fetch(url_v1("/user/profile/upload-image"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        if (response.status === 422) {
          throw new Error("تصویر نامعتبر است");
        }
        if (response.status === 401) {
          throw new Error("لطفاً دوباره وارد شوید");
        }
        throw new Error(result.message || "خطا در آپلود تصویر");
      }

      successToast(result.message || "تصویر پروفایل با موفقیت آپلود شد");
    } catch (err) {
      if (err) {
        setErrors((prev) => ({
          ...prev,
          image: "خطا در ارسال تصویر",
        }));
      }
    } finally {
      setIsSubmitting((prev) => ({ ...prev, image: false }));
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, password: null }));
    setIsSubmitting((prev) => ({ ...prev, password: true }));

    if (formData.new_password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد",
      }));
      setIsSubmitting((prev) => ({ ...prev, password: false }));
      return;
    }
    if (formData.new_password !== formData.new_password_confirmation) {
      setErrors((prev) => ({
        ...prev,
        password: "رمز عبور جدید و تأیید آن مطابقت ندارند",
      }));
      setIsSubmitting((prev) => ({ ...prev, password: false }));
      return;
    }

    try {
      const response = await fetch(url_v1("/user/profile/change-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_password: formData.new_password,
          new_password_confirmation: formData.new_password_confirmation,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 422) {
          throw new Error("اطلاعات رمز عبور نامعتبر است");
        }
        if (response.status === 401) {
          throw new Error("لطفاً دوباره وارد شوید");
        }
        throw new Error(result.message || "خطا در تغییر رمز عبور");
      }

      successToast(result.message || "رمز عبور با موفقیت تغییر یافت");
      setFormData((prev) => ({
        ...prev,
        new_password: "",
        new_password_confirmation: "",
      }));
    } catch (err) {
      if (err) {
        setErrors((prev) => ({
          ...prev,
          password: "خطا در ارسال اطلاعات",
        }));
      }
    } finally {
      setIsSubmitting((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div dir="rtl" className="max-w-7xl mx-auto md:p-6 py-3 space-y-10">
      <div className="relative bg-[url('/assets/img/propertyBG.jpg')] bg-cover w-full h-[10rem] rounded-xl mb-10">
        <div className="pt-5 pr-5">
          <Yellow
            value={`دسترسی ${
              client?.user_type === "regular"
                ? "کاربر"
                : client?.user_type === "admin"
                ? "ادمین"
                : "ویراستار"
            }`}
          />
          {client?.is_active ? (
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
          onSubmit={handleProfileUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-describedby="profile-error">
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
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              aria-describedby="phone-info"
            />
            <p id="phone-info" className="text-sm text-gray-500 mt-1">
              شماره موبایل قابل تغییر نیست.
            </p>
          </div>
          {errors.profile && (
            <div
              id="profile-error"
              className="md:col-span-2 text-sm text-red-500"
              role="alert">
              {errors.profile}
            </div>
          )}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={isSubmitting.profile}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting.profile
                ? "در حال به‌روزرسانی..."
                : "به‌روزرسانی اطلاعات پایه"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-xl text-gray-600 mb-4">تکمیل پروفایل</h2>
        <form
          onSubmit={handleProfileComplete}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-describedby="complete-error">
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
              htmlFor="marital_status"
              className="block text-sm font-medium text-gray-700">
              وضعیت تاهل
            </label>
            <select
              id="marital_status"
              name="marital_status"
              value={formData.marital_status}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600">
              <option value="">انتخاب</option>
              <option value="single">مجرد</option>
              <option value="married">متاهل</option>
              <option value="divorced">مطلقه</option>
              <option value="widowed">بیوه</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="job_title"
              className="block text-sm font-medium text-gray-700">
              عنوان شغلی
            </label>
            <input
              id="job_title"
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: مهندس نرم‌افزار"
              maxLength={100}
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
              htmlFor="education_level"
              className="block text-sm font-medium text-gray-700">
              تحصیلات
            </label>
            <select
              id="education_level"
              name="education_level"
              value={formData.education_level}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600">
              <option value="">انتخاب کنید</option>
              <option value="under_diploma">زیر دیپلم</option>
              <option value="diploma">دیپلم</option>
              <option value="associate">فوق دیپلم</option>
              <option value="bachelor">لیسانس</option>
              <option value="master">فوق لیسانس</option>
              <option value="phd">دکتری</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="national_code"
              className="block text-sm font-medium text-gray-700">
              کدملی
            </label>
            <input
              id="national_code"
              name="national_code"
              type="text"
              value={formData.national_code}
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
              maxLength={500}
            />
          </div>
          {errors.complete && (
            <div
              id="complete-error"
              className="md:col-span-2 text-sm text-red-500"
              role="alert">
              {errors.complete}
            </div>
          )}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={isSubmitting.complete}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting.complete ? "در حال تکمیل..." : "تکمیل پروفایل"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-xl text-gray-600 mb-4">
          آپلود تصویر پروفایل
        </h2>
        <form
          onSubmit={handleProfileImageUpload}
          className="grid grid-cols-1 gap-4"
          aria-describedby="image-error">
          <div>
            <label
              htmlFor="profile_image"
              className="block text-sm font-medium text-gray-700">
              تصویر پروفایل (حداکثر ۲ مگابایت، فرمت jpeg/jpg/png)
            </label>
            <input
              id="profile_image"
              name="profile_image"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          {errors.image && (
            <div id="image-error" className="text-sm text-red-500" role="alert">
              {errors.image}
            </div>
          )}
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting.image || !formData.profile_image}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting.image ? "در حال آپلود..." : "آپلود تصویر"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-xl text-gray-600 mb-4">تغییر رمز عبور</h2>
        <form
          onSubmit={handlePasswordChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-describedby="password-error">
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
              value={formData.new_password}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="حداقل ۸ کاراکتر"
              required
            />
          </div>
          <div>
            <label
              htmlFor="new_password_confirmation"
              className="block text-sm font-medium text-gray-700">
              تأیید رمز عبور جدید
            </label>
            <input
              id="new_password_confirmation"
              name="new_password_confirmation"
              type="password"
              value={formData.new_password_confirmation}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="تکرار رمز عبور جدید"
              required
            />
          </div>
          {errors.password && (
            <div
              id="password-error"
              className="md:col-span-2 text-sm text-red-500"
              role="alert">
              {errors.password}
            </div>
          )}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={isSubmitting.password}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting.password ? "در حال تغییر..." : "تغییر رمز عبور"}
            </button>
          </div>
        </form>
      </div>
      <UpgradeToRealEstate />
    </div>
  );
}
