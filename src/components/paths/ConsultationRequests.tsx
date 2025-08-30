"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { VscGitPullRequestDraft, VscInfo, VscTrash } from "react-icons/vsc";
import { url_v1 } from "@/config/urls";

interface Consultant {
  id: number;
  name: string;
  company_name: string;
  contact_phone: string;
  contact_whatsapp: string;
  is_verified: boolean;
}

interface Property {
  id: number;
  title: string;
  city: string;
  property_type: string;
  formatted_price: string;
  primary_image_url: string;
}

interface Consultation {
  id: number;
  full_name: string;
  phone: string;
  message: string;
  preferred_contact_method: string;
  preferred_contact_time: string;
  status: string;
  status_label: string;
  consultant_notes: string | null;
  consultant: Consultant;
  property: Property;
  can_edit: boolean;
  can_cancel: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResult {
  success: boolean;
  message: string;
  data: {
    consultations: Consultation[];
    pagination: object;
    stats: object;
  };
  timestamp: string;
}

interface ConsultationDetails {
  id: number;
  full_name: string;
  phone: string;
  message: string;
  preferred_contact_method: string;
  preferred_contact_time: string;
  status: string;
  status_label: string;
  consultant_notes: string | null;
  consultant: Consultant;
  property: Property;
  created_at: string;
  updated_at: string;
}

const statusStyles: { [key: string]: string } = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  canceled: "bg-gray-200 text-gray-700",
};

const ConsultationsPage: React.FC = () => {
  const { data: session } = useSession();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationDetails | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchConsultations() {
      if (!session?.user?.access_token) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url_v1("/user/consultation-requests"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user?.access_token}`,
          },
        });
        if (!res.ok) throw new Error(`خطا در دریافت اطلاعات: ${res.status}`);
        const data: ApiResult = await res.json();
        if (!data.success)
          throw new Error(data.message || "خطای ناشناخته از API");
        setConsultations(data.data.consultations);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchConsultations();
  }, [session]);

  const handleDetails = async (id: number) => {
    try {
      const res = await fetch(url_v1(`/user/consultation-requests/${id}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      });
      if (!res.ok) throw new Error(`خطا در دریافت جزئیات: ${res.status}`);
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "خطای ناشناخته در جزئیات");
      setSelectedConsultation(data.data);
      setIsPopupOpen(true);
    } catch (error) {
      alert(`خطا در دریافت جزئیات: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(
        url_v1(`/user/consultation-requests/${deleteId}`),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
        }
      );
      if (!res.ok) throw new Error(`خطا در حذف درخواست: ${res.status}`);
      setConsultations((prev) => prev.filter((c) => c.id !== deleteId));
      alert(`درخواست مشاوره ${deleteId} با موفقیت حذف شد.`);
    } catch (error) {
      alert(`خطا در حذف درخواست مشاوره: ${(error as Error).message}`);
    } finally {
      setIsDeletePopupOpen(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeletePopupOpen(false);
    setDeleteId(null);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedConsultation(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-600">خطا: {error}</p>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">هیچ درخواست مشاوره‌ای یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-morabba">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 justify-end">
        درخواست‌های مشاوره ({consultations.length})
        <VscGitPullRequestDraft className="w-6 h-6" />
      </h1>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        dir="rtl">
        {consultations.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {c.full_name}
              </h2>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusStyles[c.status]
                }`}>
                {c.status_label}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">تلفن:</span> {c.phone}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">پیام:</span>{" "}
              {c.message.substring(0, 50)}...
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">ملک:</span> {c.property.title} (
              {c.property.city})
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">مشاور:</span> {c.consultant.name} (
              {c.consultant.company_name})
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleDetails(c.id)}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors">
                <VscInfo className="w-4 h-4" /> جزئیات
              </button>
              {c.can_cancel && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition-colors">
                  <VscTrash className="w-4 h-4" /> حذف
                </button>
              )}
              {/* <button
                onClick={() => handleAnotherAction(c.id)}
                className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition-colors">
                <VscEllipsis className="w-4 h-4" /> سایر
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && selectedConsultation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={closePopup}
          dir="rtl">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closePopup}
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              جزئیات درخواست مشاوره
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">شناسه:</span>{" "}
                {selectedConsultation.id}
              </p>
              <p>
                <span className="font-medium">نام کامل:</span>{" "}
                {selectedConsultation.full_name}
              </p>
              <p>
                <span className="font-medium">تلفن:</span>{" "}
                {selectedConsultation.phone}
              </p>
              <p>
                <span className="font-medium">پیام:</span>{" "}
                {selectedConsultation.message}
              </p>
              <p>
                <span className="font-medium">روش تماس ترجیحی:</span>{" "}
                {selectedConsultation.preferred_contact_method}
              </p>
              <p>
                <span className="font-medium">زمان تماس ترجیحی:</span>{" "}
                {selectedConsultation.preferred_contact_time}
              </p>
              <p>
                <span className="font-medium">وضعیت:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusStyles[selectedConsultation.status]
                  }`}>
                  {selectedConsultation.status_label}
                </span>
              </p>
              <p>
                <span className="font-medium">یادداشت‌های مشاور:</span>{" "}
                {selectedConsultation.consultant_notes || "بدون یادداشت"}
              </p>
              <p>
                <span className="font-medium">مشاور:</span>{" "}
                {selectedConsultation.consultant.name} (
                {selectedConsultation.consultant.company_name})
              </p>
              <p>
                <span className="font-medium">ملک:</span>{" "}
                {selectedConsultation.property.title} (
                {selectedConsultation.property.city})
              </p>
              <p>
                <span className="font-medium">نوع ملک:</span>{" "}
                {selectedConsultation.property.property_type}
              </p>
              <p>
                <span className="font-medium">قیمت:</span>{" "}
                {selectedConsultation.property.formatted_price}
              </p>
              <p>
                <span className="font-medium">ایجاد شده در:</span>{" "}
                {new Date(selectedConsultation.created_at).toLocaleString(
                  "fa-IR"
                )}
              </p>
              <p>
                <span className="font-medium">به‌روزرسانی شده در:</span>{" "}
                {new Date(selectedConsultation.updated_at).toLocaleString(
                  "fa-IR"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {isDeletePopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={cancelDelete}
          dir="rtl">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm sm:max-w-md relative"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={cancelDelete}
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              تأیید حذف درخواست
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              آیا مطمئن هستید که می‌خواهید این درخواست مشاوره را حذف کنید؟
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                بله
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
                خیر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
