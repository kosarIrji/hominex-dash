"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  VscGitPullRequestDraft,
  VscInfo,
  VscTrash,
  VscEllipsis,
} from "react-icons/vsc";
import { url, url_v1 } from "@/config/urls";

// TypeScript interfaces
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

// Status styles for badges
const statusStyles: { [key: string]: string } = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  canceled: "bg-gray-100 text-gray-800",
};

const ConsultationsPage: React.FC = () => {
  const { data: session } = useSession();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConsultations() {
      if (!session?.access_token) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url_v1("/user/consultation-requests"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
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
      const res = await fetch(url_v1(`/user/consultation-requests${id}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (!res.ok) throw new Error(`خطا در دریافت جزئیات: ${res.status}`);
      const data = await res.json();
      alert(`جزئیات درخواست مشاوره ${id}:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert(`خطا در دریافت جزئیات: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm("آیا مطمئن هستید که می‌خواهید این درخواست مشاوره را حذف کنید؟")
    )
      return;
    try {
      const res = await fetch(url_v1(`/user/consultation-requests${id}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (!res.ok) throw new Error(`خطا در حذف درخواست: ${res.status}`);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
      alert(`درخواست مشاوره ${id} با موفقیت حذف شد.`);
    } catch (error) {
      alert(`خطا در حذف درخواست مشاوره: ${(error as Error).message}`);
    }
  };

  const handleAnotherAction = (id: number) => {
    alert(`اقدام دیگر برای درخواست مشاوره ${id} کلیک شد.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
          خطا: {error}
        </div>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md">
          هیچ درخواست مشاوره‌ای یافت نشد.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          درخواست‌های مشاوره ({consultations.length})
          <VscGitPullRequestDraft className="w-8 h-8 text-blue-600" />
        </h1>
      </div>
      <div className="grid gap-6">
        {consultations.map((consultation) => (
          <div
            key={consultation.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {consultation.full_name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyles[consultation.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}>
                    {consultation.status_label}
                  </span>
                </div>
                <div className="mt-2 text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">تماس:</span>{" "}
                    {consultation.phone}
                  </p>
                  <p>
                    <span className="font-medium">پیام:</span>{" "}
                    {consultation.message.substring(0, 60)}...
                  </p>
                  <p>
                    <span className="font-medium">ملک:</span>{" "}
                    {consultation.property.title} ({consultation.property.city})
                  </p>
                  <p>
                    <span className="font-medium">مشاور:</span>{" "}
                    {consultation.consultant.name} (
                    {consultation.consultant.company_name})
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <button
                  onClick={() => handleDetails(consultation.id)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <VscInfo className="w-5 h-5" />
                  جزئیات
                </button>
                {consultation.can_cancel && (
                  <button
                    onClick={() => handleDelete(consultation.id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                    <VscTrash className="w-5 h-5" />
                    حذف
                  </button>
                )}
                <button
                  onClick={() => handleAnotherAction(consultation.id)}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <VscEllipsis className="w-5 h-5" />
                  سایر
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultationsPage;
