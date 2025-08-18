/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import LikedProperty from "../UI/LikedProperty";
import { BiLike } from "react-icons/bi";
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

export default function Liked() {
  const [likedProps, setLikedProps] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState(false);
  const session = useSession();
  // Fetch liked properties from API
  useEffect(() => {
    async function fetchLiked() {
      setLoading(true);
      try {
        const res = await fetch(url_v1(`/user/favorites?page=${page}`), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user?.access_token}`, // Add token here
          },
        });
        const data = await res.json();

        setLikedProps(
          data.data.favorites.map((fav: any) => ({
            id: fav.property.id,
            name: fav.property.title,
            image: fav.property.primary_image_url,
            views: fav.property.views_count,
            url: `/properties/${fav.property.id}`,
          }))
        );
        setPagination(data.data.pagination);
      } catch (err) {
        console.error("Error fetching liked properties:", err);
      }
      setLoading(false);
      setUpdate(false);
    }

    fetchLiked();
  }, [page, update]);

  return (
    <div dir="rtl" className="m-3">
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
          آگهی مورد علاقه <BiLike className="w-7 h-7 md:mx-2" />
        </span>
      </div>

      {loading ? (
        <p className="mt-4 text-gray-500">در حال بارگذاری...</p>
      ) : (
        <LikedProperty likedProperties={likedProps} setUpdate={setUpdate} />
      )}

      {/* Pagination Controls */}
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
