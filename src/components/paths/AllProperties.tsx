"use client";

import React, { useEffect, useState } from "react";
import { VscTrash, VscInfo } from "react-icons/vsc";
import { url_v1 } from "@/config/urls";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { LiaClipboardListSolid } from "react-icons/lia";

interface Property {
  id: number;
  title: string;
  city: string;
  price: string;
  imageUrl: string;
  status?: string;
  status_label?: string;
  property_type?: string;
  property_status_label?: string;
  province?: string;
  land_area?: number;
  rooms_count?: number;
  creator_name?: string;
  created_at?: string;
  next_steps?: string[];
  primary_image_url?: string;
  formatted_price?: string;
}

interface AdminPropertyCardProps {
  property: Property;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
  rejectionId: number | null;
  rejectionReason: string;
  setRejectionId: (id: number | null) => void;
  setRejectionReason: (reason: string) => void;
}

const AdminPropertyCard: React.FC<AdminPropertyCardProps> = ({
  property,
  handleApprove,
  handleReject,
  rejectionId,
  rejectionReason,
  setRejectionId,
  setRejectionReason,
}) => {
  // Determine badge styling based on status
  const getStatusBadgeStyles = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <Image
        width={1000}
        height={1000}
        src={property.imageUrl || "/assets/img/not.jpg"}
        alt={property.title || "تصویر آگهی"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {property.title}
          </h2>
          {property.status_label && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyles(
                property.status
              )}`}>
              {property.status_label}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600 mb-4 [&>*]:gap-2 [&>*]:items-center">
          {property.city && property.province && (
            <p>
              مکان: {property.city}، {property.province}
            </p>
          )}
          {property.property_type && <p>نوع ملک: {property.property_type}</p>}
          {property.property_status_label && (
            <p>وضعیت: {property.property_status_label}</p>
          )}
          {property.land_area && <p>متراژ: {property.land_area} متر</p>}
          {property.rooms_count && <p>تعداد اتاق: {property.rooms_count}</p>}
          {property.creator_name && <p>ایجاد کننده: {property.creator_name}</p>}
          {property.created_at && (
            <p>
              تاریخ ایجاد:{" "}
              {new Date(property.created_at).toLocaleDateString("fa-IR")}
            </p>
          )}
          {property.next_steps && property.next_steps.length > 0 && (
            <div>
              <p className="font-medium">مراحل بعدی:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {property.next_steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="text-lg font-medium text-gray-900 mb-4">
          قیمت: {property.price || "نامشخص"}
        </p>
        <div className="flex flex-row gap-2">
          <button
            onClick={() => setRejectionId(property.id)}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm w-full sm:w-auto">
            <VscTrash className="w-4 h-4" /> رد کردن
          </button>
          <button
            onClick={() => handleApprove(property.id)}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm w-full sm:w-auto">
            تأیید
          </button>
          <button
            onClick={() => alert(`جزئیات ملک ${property.id}`)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto">
            <VscInfo className="w-4 h-4" /> مشاهده جزئیات
          </button>
        </div>
        {rejectionId === property.id && (
          <div className="mt-4">
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="دلیل رد کردن را وارد کنید..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-red-300"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleReject(property.id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm">
                ارسال
              </button>
              <button
                onClick={() => {
                  setRejectionId(null);
                  setRejectionReason("");
                }}
                className="bg-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-400 transition-colors text-sm">
                لغو
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AllProperties: React.FC = () => {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<string>("all"); // Filter state: all, approved, rejected, pending
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionId, setRejectionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  useEffect(() => {
    async function fetchProperties() {
      if (!session?.user?.access_token) return;

      try {
        const res = await fetch(url_v1("/admin/properties"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.access_token}`,
          },
        });

        if (!res.ok) throw new Error("خطا در دریافت املاک");

        const data = await res.json();
        console.log("Fetch Properties Response:", data); // Debug response
        const mapped: Property[] =
          data?.data?.properties?.properties?.map((p: Property) => ({
            id: p.id,
            title: p.title,
            city: p.city,
            province: p.province,
            price: p.formatted_price,
            imageUrl: p.primary_image_url,
            status: p.status,
            status_label: p.status_label,
            property_type: p.property_type,
            property_status_label: p.property_status_label,
            land_area: p.land_area,
            rooms_count: p.rooms_count,
            creator_name: p.creator_name,
            created_at: p.created_at,
            next_steps: p.next_steps,
          })) || [];

        setProperties(mapped);
        setFilteredProperties(mapped); // Initially show all properties
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.access_token) {
      fetchProperties();
    }
  }, [session?.user?.access_token]);

  // Apply filter when filter state changes
  useEffect(() => {
    if (filter === "all") {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(
        properties.filter((prop) => prop.status === filter)
      );
    }
  }, [filter, properties]);

  // Handle reject property
  const handleReject = async (id: number) => {
    if (!rejectionReason.trim()) {
      alert("لطفاً دلیل رد کردن را وارد کنید");
      return;
    }

    try {
      const res = await fetch(url_v1(`/admin/properties/${id}/reject`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: JSON.stringify({
          reason: rejectionReason,
        }),
      });

      if (!res.ok) throw new Error("خطا در رد کردن ملک");

      setProperties((prev) => prev.filter((p) => p.id !== id));
      setFilteredProperties((prev) => prev.filter((p) => p.id !== id));
      setRejectionId(null);
      setRejectionReason("");
      alert(`ملک با شناسه ${id} با موفقیت رد شد.`);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "خطای ناشناخته در رد کردن ملک"
      );
    }
  };

  // Handle approve property
  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(url_v1(`/admin/properties/${id}/approve`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      });

      if (!res.ok) throw new Error("خطا در تأیید ملک");

      setProperties((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: "approved", status_label: "تأیید شده" }
            : p
        )
      );
      setFilteredProperties((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: "approved", status_label: "تأیید شده" }
            : p
        )
      );
      alert(`ملک با شناسه ${id} تأیید شد.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطای ناشناخته در تأیید ملک");
    }
  };

  // Determine empty state message based on filter
  const getEmptyMessage = () => {
    switch (filter) {
      case "approved":
        return "هیچ ملکی تأیید شده یافت نشد.";
      case "rejected":
        return "هیچ ملکی رد شده یافت نشد.";
      case "pending":
        return "هیچ ملکی در انتظار یافت نشد.";
      case "all":
      default:
        return "هیچ ملکی یافت نشد.";
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">در حال بارگذاری...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">خطا: {error}</p>;
  }

  if (!session?.user?.access_token) {
    return (
      <p className="text-center text-gray-600">
        لطفاً برای مشاهده املاک وارد شوید.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto sm:p-4 md:p-6 font-morabba" dir="rtl">
      <div className="flex flex-col items-center justify-between md:flex-row mb-6">
        <h1 className="md:text-2xl text-lg w-full md:w-auto font-semibold mb-4 md:mb-0 flex flex-row text-gray-900">
          <LiaClipboardListSolid className="w-7 h-7 mr-2" />
          مدیریت املاک
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            همه
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "approved"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            تأیید شده
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "rejected"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            رد شده
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            در انتظار
          </button>
        </div>
      </div>
      {filteredProperties.length === 0 ? (
        <p className="p-4 text-center text-gray-600">{getEmptyMessage()}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <AdminPropertyCard
              key={property.id}
              property={property}
              handleApprove={handleApprove}
              handleReject={handleReject}
              rejectionId={rejectionId}
              rejectionReason={rejectionReason}
              setRejectionId={setRejectionId}
              setRejectionReason={setRejectionReason}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProperties;
