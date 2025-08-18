"use client";
import React, { useEffect, useState } from "react";
import LikedProperty from "./LikedProperty";
import { useSession } from "next-auth/react";
import { url_v1 } from "@/config/urls";

type Property = {
  id: number;
  name: string;
  image: string;
  views: number;
  url: string;
};

type Pagination = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
};

export default function AddedProperties() {
  const [likedProps, setLikedProps] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState(false);
  const session = useSession();
  const token = session.data?.user?.access_token; // ✅ correct path to token

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const res = await fetch(url_v1(`/user/properties?page=${page}`), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          console.error("Unauthorized - maybe token expired");
          return;
        }

        const json = await res.json();

        type Props = {
          id: number;
          title: string;
          primary_image_url: string;
          views_count: string;
          url: string;
        };
        // Map API data to our UI structure
        setLikedProps(
          /* eslint-disable no-console, no-unused-vars */
          json.data.properties.properties.map((prop: Props) => ({
            id: prop.id,
            name: prop.title,
            image: prop.primary_image_url,
            views: prop.views_count,
            url: `/properties/${prop.id}`,
          }))
        );
        /* eslint-enable no-console, no-unused-vars */

        // Set pagination from meta
        setPagination(json.data.properties.meta);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
        setUpdate(false);
      }
    }

    if (token) {
      fetchProperties();
    }
  }, [page, update, token]);

  return (
    <div dir="rtl" className="m-3 w-full">
      {loading ? (
        <p className="mt-4 text-gray-500">در حال بارگذاری...</p>
      ) : (
        <LikedProperty likedProperties={likedProps} setUpdate={setUpdate} />
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
            قبلی
          </button>
          <span className="flex items-center">
            صفحه {pagination.current_page} از {pagination.last_page}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.last_page, p + 1))
            }
            disabled={page === pagination.last_page}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
