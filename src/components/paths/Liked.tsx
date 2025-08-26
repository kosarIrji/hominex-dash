/* eslint-disable */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { LIkedCard } from "../UI/Cards";
import { BiLike } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchFavorites,
  deleteFavorite,
} from "@/redux/Slices/favPropertiesSlice";
import { errorToast, successToast } from "@/config/Toasts";

type Property = {
  id: number;
  name: string;
  image: string;
  views: number;
  url: string;
};

export default function Liked() {
  const [page, setPage] = useState(1);
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { favorites, pagination, loading, error } = useSelector(
    (state: RootState) => state.favorites
  );

  // Log session for debugging
  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);
    console.log("Access Token:", session?.user?.access_token);
  }, [session, status]);

  // Fetch favorites when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.access_token) {
      dispatch(fetchFavorites({ page, token: session.user.access_token }));
    }
  }, [dispatch, page, session, status]);

  // Map favorites to Property type and handle concatenation for infinite scroll
  useEffect(() => {
    if (favorites.length > 0) {
      const newProperties = favorites.map((fav) => ({
        id: fav.property.id,
        name: fav.property.title,
        image: fav.property.primary_image_url,
        views: fav.property.views_count,
        url: `/properties/${fav.property.id}`,
      }));

      setLikedProperties((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNewProperties = newProperties.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...uniqueNewProperties];
      });

      setHasMore(pagination ? page < pagination.last_page : false);
    }
  }, [favorites, pagination, page]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  // Handle remove favorite
  const handleRemove = async (id: number) => {
    if (session?.user?.access_token) {
      try {
        const result = await dispatch(
          deleteFavorite({ favoriteId: id, token: session.user.access_token })
        ).unwrap();
        successToast(result.message);
      } catch (e: any) {
        errorToast(e || "خطا در حذف علاقه‌مندی");
      }
    } else {
      errorToast("لطفاً ابتدا وارد شوید.");
    }
  };

  if (status === "loading") {
    return (
      <div className="p-4 text-center text-gray-500">
        در حال بررسی وضعیت ورود...
      </div>
    );
  }

  if (status !== "authenticated" || !session?.user?.access_token) {
    return (
      <div className="p-4 text-center text-gray-500">
        لطفاً برای مشاهده علاقه‌مندی‌ها وارد شوید.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        خطا در دریافت اطلاعات: {error}
      </div>
    );
  }

  if (likedProperties.length === 0 && !loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        هیچ ملکی به علاقه‌مندی‌ها اضافه نشده است.
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-7xl mx-auto md:p-6 py-3 space-y-10">
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold md:text-2xl text-lg text-gray-600 flex flex-row-reverse justify-center items-center">
          آگهی مورد علاقه <BiLike className="w-7 h-7 md:mx-2" />
        </span>
      </div>

      {loading && likedProperties.length === 0 ? (
        <p className="mt-4 text-gray-500 text-center">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedProperties.map((property) => (
            <LIkedCard
              property={property}
              key={property.id}
              handleRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={loaderRef} className="text-center py-4">
          {loading ? (
            <p className="text-gray-500">در حال بارگذاری موارد بیشتر...</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
