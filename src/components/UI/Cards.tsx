import React from "react";
import Image from "next/image";
import { FaRegEye } from "react-icons/fa6";
import { VscEdit, VscInfo, VscTrash } from "react-icons/vsc";
import { YellowChildren } from "./Badges";

type Property = {
  id: number;
  name: string;
  image: string;
  views: number;
  url: string;
  favorite_id?: number; // Only for LIkedCard
  property_type?: string;
  property_status_label?: string;
  formatted_price?: string;
  city?: string;
  province?: string;
  land_area?: number;
  rooms_count?: number;
  status?: string;
  status_label?: string;
  creator_name?: string;
  created_at?: string;
  next_steps?: string[];
};

type PropertyCardProps = {
  property: Property;
  handleRemove: (id: number) => void;
  image: string;
};

export function LIkedCard({ property, handleRemove }: PropertyCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <Image
        width={1000}
        height={1000}
        unoptimized={true}
        src={property.image || "/assets/img/not.jpg"}
        alt={property.name || "تصویر آگهی"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {property.name}
        </h2>
        <div className="text-sm text-gray-600 mb-4 [&>*]:gap-2 [&>*]:items-center">
          <YellowChildren>
            {property.views} <FaRegEye />
          </YellowChildren>
          {property.property_type && <p>نوع ملک: {property.property_type}</p>}
          {property.property_status_label && (
            <p>وضعیت: {property.property_status_label}</p>
          )}
          {property.city && property.province && (
            <p>
              مکان: {property.city}، {property.province}
            </p>
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
          قیمت: {property.formatted_price || "نامشخص"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleRemove(property.favorite_id || property.id)}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm w-full sm:w-auto">
            <VscTrash className="w-4 h-4" /> حذف
          </button>
          <a
            href={property.url}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto">
            <VscInfo className="w-4 h-4" /> مشاهده ملک
          </a>
        </div>
      </div>
    </div>
  );
}

export function PropertyCard({
  property,
  handleRemove,
  image,
}: PropertyCardProps) {
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
  function convertPropertyPath(path: string): string {
    const baseUrl = "https://hominex.ir/estates";
    // Remove leading "/properties"
    const newPath = path.replace(/^\/properties/, "");
    return `${baseUrl}${newPath}`;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <Image
        width={1000}
        height={1000}
        src={image}
        loading="lazy"
        unoptimized={true}
        alt={property.name || "تصویر آگهی"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {property.name}
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
          <YellowChildren>
            {property.views} <FaRegEye />
          </YellowChildren>
          {property.property_type && <p>نوع ملک: {property.property_type}</p>}
          {property.property_status_label && (
            <p>وضعیت: {property.property_status_label}</p>
          )}
          {property.city && property.province && (
            <p>
              مکان: {property.city}، {property.province}
            </p>
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
          قیمت: {property.formatted_price || "نامشخص"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleRemove(property.id)}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm w-full sm:w-auto">
            <VscTrash className="w-4 h-4" /> حذف
          </button>
          <a
            href={convertPropertyPath(property.url)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto">
            <VscInfo className="w-4 h-4" /> مشاهده ملک
          </a>
          <a
            href={`/edit/${property.id}`}
            className="flex items-center gap-1 opacity-50 bg-gray-600 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors text-sm w-full sm:w-auto">
            <VscEdit className="w-4 h-4" /> ویرایش
          </a>
        </div>
      </div>
    </div>
  );
}
