"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { url_v1 } from "@/config/urls";
import { PropertyCard } from "./Cards";
import { errorToast } from "@/config/Toasts";

type Property = {
  id: number;
  name: string;
  image: string;
  views: number;
  url: string;
  status: string;
  status_label?: string;
  property_type?: string;
  property_status_label?: string;
  formatted_price?: string;
  city?: string;
  province?: string;
  land_area?: number;
  building_area?: number;
  rooms_count?: number;
  construction_year?: number;
  property_direction?: string;
  creator_name?: string;
  created_at?: string;
  amenities?: string[];
  description?: string;
};

export default function AddedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<string>("all"); // Filter state: all, approved, rejected, pending, archived
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const token = session?.user?.access_token;

  useEffect(() => {
    async function fetchProperties() {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url_v1("/user/properties"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          errorToast("احراز هویت ناموفق - لطفاً دوباره وارد شوید.");
        }

        if (!res.ok) {
          throw new Error(`خطا در دریافت اطلاعات: ${res.status}`);
        }

        const json = await res.json();

        // Map API data to Property type
        const mappedProperties = json.data.properties.properties.map(
          (prop: {
            id: number;
            title: string;
            primary_image_url: string;
            views_count: number;
            status: string;
            status_label: string;
            property_type: string;
            transaction_type_label: string;
            formatted_price: string;
            city: string;
            province: string;
            land_area: number;
            building_area: number;
            rooms_count: number;
            construction_year: number;
            property_direction: string;
            creator_name: string;
            created_at: string;
            amenities: string[];
            description: string;
          }) => ({
            id: prop.id,
            name: prop.title,
            image: prop.primary_image_url || "/assets/img/not.jpg",
            views: prop.views_count,
            url: `/properties/${prop.id}`,
            status: prop.status,
            status_label: prop.status_label,
            property_type: prop.property_type,
            property_status_label: prop.transaction_type_label,
            formatted_price: prop.formatted_price,
            city: prop.city,
            province: prop.province,
            land_area: prop.land_area,
            building_area: prop.building_area,
            rooms_count: prop.rooms_count,
            construction_year: prop.construction_year,
            property_direction: prop.property_direction,
            creator_name: prop.creator_name,
            created_at: prop.created_at,
            amenities: prop.amenities,
            description: prop.description,
          })
        );

        setProperties(mappedProperties);
        setFilteredProperties(mappedProperties); // Initially show all properties
        // eslint-disable-next-line
      } catch (err: any) {
        console.error("Error fetching properties:", err);
        setError(err.message || "خطا در دریافت اطلاعات");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated" && token) {
      fetchProperties();
    }
  }, [status, token]);

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

  // ---------------------------------------

  const [propertyImages, setPropertyImages] = useState<Record<number, string>>(
    {}
  );

  useEffect(() => {
    async function fetchImagesForAll() {
      if (!token) return;

      const imagesMap: Record<number, string> = {};

      await Promise.all(
        filteredProperties.map(async (property) => {
          try {
            const res = await fetch(
              url_v1(`/user/properties/${property.id}/images`),
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                // CORS-related settings
                mode: "cors", // default for cross-origin requests
                cache: "no-cache",
              }
            );
            const data = await res.json();
            // Take the first image in the array
            const firstImage = await data.data?.images?.[0]?.image_url;
            imagesMap[property.id] = await firstImage;
          } catch (err) {
            if (err) imagesMap[property.id] = "/assets/img/not.jpg"; // fallback on error
          }
        })
      );

      setPropertyImages(imagesMap);
    }

    fetchImagesForAll();
  }, [filteredProperties, token]);

  // ---------------------------------------
  // Handle remove property
  const handleRemove = async (id: number) => {
    if (!token) {
      setError("لطفاً ابتدا وارد شوید.");
      return;
    }

    try {
      const res = await fetch(url_v1(`/user/properties/${id}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`خطا در حذف ملک: ${res.status}`);
      }

      // Update state to remove the deleted property
      setProperties((prev) => prev.filter((prop) => prop.id !== id));
      setFilteredProperties((prev) => prev.filter((prop) => prop.id !== id));

      // eslint-disable-next-line
    } catch (err: any) {
      console.error("Error deleting property:", err);
      setError(err.message || "خطا در حذف ملک");
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
      case "archived":
        return "هیچ ملکی آرشیو شده یافت نشد.";
      case "all":
      default:
        return "هیچ ملکی اضافه نشده است.";
    }
  };

  if (status === "loading") {
    return (
      <div className="p-4 text-center text-gray-500">
        در حال بررسی وضعیت ورود...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div dir="rtl" className="max-w-7xl w-full mx-auto md:p-6 py-3 space-y-6">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h1 className="md:text-2xl text-lg font-semibold mb-4 md:mb-0 text-gray-900">
          {/* املاک اضافه شده */}
        </h1>
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
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
          <button
            onClick={() => setFilter("archived")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "archived"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            آرشیو شده
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "draft"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            پیش نویس
          </button>
        </div>
      </div>

      {loading && filteredProperties.length === 0 ? (
        <p className="mt-4 text-gray-500 text-center">در حال بارگذاری...</p>
      ) : filteredProperties.length === 0 ? (
        <p className="p-4 text-center text-gray-500">{getEmptyMessage()}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              handleRemove={handleRemove}
              image={propertyImages[property.id] || "/assets/img/not.jpg"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
