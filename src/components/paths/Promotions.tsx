"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { successToast, errorToast } from "@/config/Toasts";
import { PiBuildingsLight } from "react-icons/pi";

interface User {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
}

interface ConsultantRequest {
  id: number;
  user: User;
  company_name: string;
  bio: string;
  contact_phone: string;
  contact_whatsapp: string | null;
  contact_telegram: string | null;
  contact_instagram: string | null;
  profile_image_url: string | null;
  submitted_at: string;
}

export default function Promotions() {
  const { data: session } = useSession();
  const token = session?.user?.access_token;
  const [requests, setRequests] = useState<ConsultantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch consultant requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/promotions?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "خطا در دریافت لیست درخواست‌ها");
        setRequests(result.data.requests);
      } catch (err) {
        errorToast(
          err instanceof Error ? err.message : "خطا در دریافت لیست درخواست‌ها"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  // ✅ Approve request
  const handleApprove = async (requestId: number) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/promotions/${requestId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400)
          throw new Error("این درخواست قبلاً تأیید شده است");
        throw new Error(result.message || "خطا در تأیید درخواست");
      }
      successToast(result.message || "درخواست با موفقیت تأیید شد");
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      errorToast(err instanceof Error ? err.message : "خطا در تأیید درخواست");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Reject request
  const handleReject = async () => {
    if (!token || !selectedRequestId) return;
    if (rejectReason.length < 10 || rejectReason.length > 255) {
      errorToast("دلیل رد درخواست باید بین ۱۰ تا ۲۵۵ کاراکتر باشد");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/promotions/${selectedRequestId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, reason: rejectReason }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400)
          throw new Error("این درخواست قبلاً رد شده است");
        if (response.status === 422) {
          throw new Error(
            result.errors?.reason?.[0] || "دلیل رد درخواست نامعتبر است"
          );
        }
        throw new Error(result.message || "خطا در رد درخواست");
      }
      successToast(result.message || "درخواست با موفقیت رد شد");
      setRequests((prev) => prev.filter((req) => req.id !== selectedRequestId));
      setRejectModalOpen(false);
      setRejectReason("");
      setSelectedRequestId(null);
    } catch (err) {
      errorToast(err instanceof Error ? err.message : "خطا در رد درخواست");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectModal = (requestId: number) => {
    setSelectedRequestId(requestId);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setRejectReason("");
    setSelectedRequestId(null);
  };

  if (loading) {
    return (
      <div dir="rtl" className="max-w-7xl mx-auto py-6 px-4 text-center">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex flex-row items-center justify-between mb-6">
        <span className="font-bold text-lg md:text-2xl text-gray-600 flex items-center gap-2">
          <PiBuildingsLight className="w-7 h-7 mr-2" />
          لیست درخواست‌های ارتقا
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="py-3 px-4 text-right">نام کامل</th>
              <th className="py-3 px-4 text-right">ایمیل</th>
              <th className="py-3 px-4 text-right">شماره تماس</th>
              <th className="py-3 px-4 text-right">نام شرکت</th>
              <th className="py-3 px-4 text-right">تاریخ ارسال</th>
              <th className="py-3 px-4 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                  هیچ درخواستی یافت نشد
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{request.user.full_name}</td>
                  <td className="py-3 px-4">{request.user.email}</td>
                  <td className="py-3 px-4">{request.user.phone}</td>
                  <td className="py-3 px-4">{request.company_name}</td>
                  <td className="py-3 px-4">
                    {new Date(request.submitted_at).toLocaleString("fa-IR")}
                  </td>
                  <td className="py-3 px-4 flex gap-2 space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={isSubmitting}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      تأیید
                    </button>
                    <button
                      onClick={() => openRejectModal(request.id)}
                      disabled={isSubmitting}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      رد
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-500">
            هیچ درخواستی یافت نشد
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-lg shadow-md space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">نام کامل:</span>
                <span>{request.user.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">ایمیل:</span>
                <span>{request.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">شماره تماس:</span>
                <span>{request.user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">نام شرکت:</span>
                <span>{request.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  تاریخ ارسال:
                </span>
                <span>
                  {new Date(request.submitted_at).toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="flex justify-end gap-2 space-x-2 space-x-reverse">
                <button
                  onClick={() => handleApprove(request.id)}
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  تأیید
                </button>
                <button
                  onClick={() => openRejectModal(request.id)}
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  رد
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              دلیل رد درخواست
            </h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
              rows={4}
              placeholder="دلیل رد درخواست را وارد کنید (۱۰ تا ۲۵۵ کاراکتر)"
              maxLength={255}
            />
            <div className="mt-4 flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                لغو
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || rejectReason.length < 10}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "در حال ارسال..." : "تأیید رد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
