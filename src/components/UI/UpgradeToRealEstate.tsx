"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { url_v1 } from "@/config/urls";
import { successToast, errorToast } from "@/config/Toasts";
import { PiBuildingsLight } from "react-icons/pi";

interface ConsultantStatus {
  status: "none" | "pending" | "approved";
  is_consultant: boolean;
  can_request: boolean;
  request_data?: {
    id: number;
    company_name: string;
    submitted_at: string;
    is_verified: boolean;
  };
  consultant_data?: {
    id: number;
    company_name: string;
    is_verified: boolean;
  };
}

export default function UpgradeToRealEstate() {
  const { data: session } = useSession();
  const token = session?.user?.access_token;

  const initialFormData = {
    company_name: "",
    bio: "",
    contact_phone: "",
    contact_whatsapp: "",
    contact_telegram: "",
    contact_instagram: "",
    office_staff_count: "",
    office_address: "",
    license_number: "",
    license_image: null as File | null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState<ConsultantStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch consultant upgrade status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          url_v1("/user/consultant-upgrade/status"),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("لطفاً دوباره وارد شوید");
          }
          throw new Error(result.message || "خطا در دریافت وضعیت");
        }
        setStatus(result.data);
      } catch (err: any) {
        errorToast(err.message || "خطا در دریافت وضعیت");
      }
    };
    fetchStatus();
  }, [token]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "office_staff_count") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setError(null);
    if (file && file.size > 2 * 1024 * 1024) {
      setError("حجم تصویر باید کمتر از ۲ مگابایت باشد");
      return;
    }
    if (file && !["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("فرمت تصویر باید jpeg، jpg یا png باشد");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.company_name) {
      setError("نام شرکت الزامی است");
      setIsSubmitting(false);
      return;
    }
    if (formData.company_name.length > 100) {
      setError("نام شرکت حداکثر ۱۰۰ کاراکتر باشد");
      setIsSubmitting(false);
      return;
    }
    if (formData.bio.length < 20) {
      setError("بیوگرافی حداقل ۲۰ کاراکتر باشد");
      setIsSubmitting(false);
      return;
    }
    if (formData.bio.length > 500) {
      setError("بیوگرافی حداکثر ۵۰۰ کاراکتر باشد");
      setIsSubmitting(false);
      return;
    }
    if (!formData.contact_phone || !/^\d{11}$/.test(formData.contact_phone)) {
      setError("شماره تماس باید ۱۱ رقم باشد");
      setIsSubmitting(false);
      return;
    }
    if (
      formData.contact_whatsapp &&
      !/^\d{11}$/.test(formData.contact_whatsapp)
    ) {
      setError("شماره واتساپ باید ۱۱ رقم باشد");
      setIsSubmitting(false);
      return;
    }
    if (
      formData.contact_telegram &&
      !/^@[\w]+$/.test(formData.contact_telegram)
    ) {
      setError("شناسه تلگرام نامعتبر است");
      setIsSubmitting(false);
      return;
    }
    if (
      formData.contact_instagram &&
      !/^@[\w]+$/.test(formData.contact_instagram)
    ) {
      setError("شناسه اینستاگرام نامعتبر است");
      setIsSubmitting(false);
      return;
    }
    if (
      !formData.office_staff_count ||
      parseInt(formData.office_staff_count) < 0
    ) {
      setError("تعداد کارکنان نمی‌تواند منفی باشد");
      setIsSubmitting(false);
      return;
    }
    if (!formData.office_address) {
      setError("آدرس دفتر الزامی است");
      setIsSubmitting(false);
      return;
    }
    if (formData.office_address.length > 500) {
      setError("آدرس دفتر حداکثر ۵۰۰ کاراکتر باشد");
      setIsSubmitting(false);
      return;
    }
    if (!formData.license_number || !/^\d{8}$/.test(formData.license_number)) {
      setError("شماره مجوز باید ۸ رقم باشد");
      setIsSubmitting(false);
      return;
    }
    if (!formData.license_image) {
      setError("تصویر مجوز الزامی است");
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("company_name", formData.company_name);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("contact_phone", formData.contact_phone);
    if (formData.contact_whatsapp)
      formDataToSend.append("contact_whatsapp", formData.contact_whatsapp);
    if (formData.contact_telegram)
      formDataToSend.append("contact_telegram", formData.contact_telegram);
    if (formData.contact_instagram)
      formDataToSend.append("contact_instagram", formData.contact_instagram);
    formDataToSend.append("office_staff_count", formData.office_staff_count);
    formDataToSend.append("office_address", formData.office_address);
    formDataToSend.append("license_number", formData.license_number);
    if (formData.license_image)
      formDataToSend.append("license_image", formData.license_image);

    try {
      const response = await fetch(url_v1("/user/consultant-upgrade/submit"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          const errorMessages = Object.values(
            result.errors as Record<string, string[]>
          )
            .flat()
            .join(", ");
          throw new Error(errorMessages || "خطا در اعتبارسنجی اطلاعات");
        }
        if (response.status === 403) {
          throw new Error("شما مجاز به ارسال درخواست ارتقا نیستید");
        }
        if (response.status === 401) {
          throw new Error("لطفاً دوباره وارد شوید");
        }
        throw new Error(result.message || "خطا در ارسال درخواست ارتقا");
      }

      successToast(result.message || "درخواست ارتقا با موفقیت ارسال شد");
      setFormData(initialFormData); // Reset form
      setStatus(result.data); // Update status
    } catch (err: any) {
      setError(err.message || "خطا در ارسال درخواست");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!status) {
    return (
      <div dir="rtl" className="max-w-7xl mx-auto py-3 text-center">
        <p className="text-gray-600">در حال بارگذاری وضعیت...</p>
      </div>
    );
  }

  if (status.status === "approved") {
    return (
      <div dir="rtl" className="max-w-7xl mx-auto py-3 space-y-10">
        <div className="flex flex-row items-center justify-between">
          <span className="font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
            ارتقا به دفتر املاک
            <PiBuildingsLight className="w-7 h-7 mx-2" />
          </span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-green-600 font-bold">
            شما به عنوان مشاور املاک با نام شرکت{" "}
            {status.consultant_data?.company_name} تأیید شده‌اید.
          </p>
        </div>
      </div>
    );
  }

  if (status.status === "pending") {
    return (
      <div dir="rtl" className="max-w-7xl mx-auto py-3 space-y-10">
        <div className="flex flex-row items-center justify-between">
          <span className="font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
            ارتقا به دفتر املاک
            <PiBuildingsLight className="w-7 h-7 mx-2" />
          </span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-yellow-600 font-bold">
            درخواست ارتقا برای شرکت {status.request_data?.company_name} در حال
            بررسی است.
          </p>
          <p className="text-gray-600">
            تاریخ ارسال:{" "}
            {status.request_data?.submitted_at
              ? new Date(status.request_data.submitted_at).toLocaleString(
                  "fa-IR"
                )
              : "نامشخص"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-7xl mx-auto py-3 space-y-10">
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
          ارتقا به دفتر املاک
          <PiBuildingsLight className="w-7 h-7 mx-2" />
        </span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-describedby="form-error">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700">
              نام شرکت
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: املاک هدیه"
              maxLength={100}
              required
            />
          </div>
          <div>
            <label
              htmlFor="contact_phone"
              className="block text-sm font-medium text-gray-700">
              شماره تماس
            </label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="text"
              value={formData.contact_phone}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: 02133445566"
              maxLength={11}
              required
            />
          </div>
          <div>
            <label
              htmlFor="contact_whatsapp"
              className="block text-sm font-medium text-gray-700">
              شماره واتساپ (اختیاری)
            </label>
            <input
              id="contact_whatsapp"
              name="contact_whatsapp"
              type="text"
              value={formData.contact_whatsapp}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: 09123456789"
              maxLength={11}
            />
          </div>
          <div>
            <label
              htmlFor="contact_telegram"
              className="block text-sm font-medium text-gray-700">
              تلگرام (اختیاری)
            </label>
            <input
              id="contact_telegram"
              name="contact_telegram"
              type="text"
              value={formData.contact_telegram}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: @my_estate"
            />
          </div>
          <div>
            <label
              htmlFor="contact_instagram"
              className="block text-sm font-medium text-gray-700">
              اینستاگرام (اختیاری)
            </label>
            <input
              id="contact_instagram"
              name="contact_instagram"
              type="text"
              value={formData.contact_instagram}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: @my_estate_agency"
            />
          </div>
          <div>
            <label
              htmlFor="office_staff_count"
              className="block text-sm font-medium text-gray-700">
              تعداد کارکنان
            </label>
            <input
              id="office_staff_count"
              name="office_staff_count"
              type="text"
              value={formData.office_staff_count}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: ۳"
              required
            />
          </div>
          <div>
            <label
              htmlFor="office_address"
              className="block text-sm font-medium text-gray-700">
              آدرس دفتر
            </label>
            <input
              id="office_address"
              name="office_address"
              type="text"
              value={formData.office_address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: تهران، خیابان عباس آباد، پلاک ۲۵"
              maxLength={500}
              required
            />
          </div>
          <div>
            <label
              htmlFor="license_number"
              className="block text-sm font-medium text-gray-700">
              شماره مجوز
            </label>
            <input
              id="license_number"
              name="license_number"
              type="text"
              value={formData.license_number}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="مثال: ۱۲۳۴۵۶۷۸"
              maxLength={8}
              required
            />
          </div>
          <div>
            <label
              htmlFor="license_image"
              className="block text-sm font-medium text-gray-700">
              تصویر مجوز (حداکثر ۲ مگابایت، فرمت jpeg/jpg/png)
            </label>
            <input
              id="license_image"
              name="license_image"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700">
              بیوگرافی
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              placeholder="توضیحاتی درباره دفتر املاک خود بنویسید"
              rows={4}
              maxLength={500}
              required
            />
          </div>
          {error && (
            <div
              id="form-error"
              className="md:col-span-2 text-sm text-red-500"
              role="alert">
              {error}
            </div>
          )}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "در حال ارسال..." : "ارسال درخواست ارتقا"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
