"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { GoGear } from "react-icons/go";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineWavingHand } from "react-icons/md";
import SpotlightCard from "../../blocks/Components/SpotlightCard/SpotlightCard";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { switchRoute } from "@/redux/Slices/routeSwitch";
import { useSession } from "next-auth/react";
import { errorToast } from "@/config/Toasts";
import { url_v1 } from "@/config/urls";

export default function Main() {
  const session = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { client } = useSelector((state: RootState) => state.authSlice);

  const [recentAds, setRecentAds] = useState<
    {
      id: number;
      title: string;
      date: string;
    }[]
  >([]);

  const stats = [
    {
      label: "آگهی‌های ایجاد شده",
      value: client.stats.created_properties_count,
      href: "/",
    },
    {
      label: "آگهی‌های نشان‌شده",
      value: client.stats.favorites_count,
      href: "/",
    },
    {
      label: "آگهی های تایید شده",
      value: client.stats.approved_properties_count,
      href: "/ads",
    },
  ];

  const token = session.data?.user?.access_token;

  useEffect(() => {
    async function fetchProperties() {
      if (!token) return;
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
          return;
        }

        if (!res.ok) {
          throw new Error(`خطا در دریافت اطلاعات: ${res.status}`);
        }

        const json = await res.json();

        const mappedProperties = json.data.properties.properties.map(
          (prop: { id: number; title: string; created_at: string }) => ({
            id: prop.id,
            title: prop.title,
            date: new Date(prop.created_at).toLocaleDateString("fa-IR"), // Persian date
          })
        );

        // Sort by date desc & pick last 3
        interface Property {
          id: number;
          title: string;
          date: string;
        }

        const latestThree: Property[] = mappedProperties
          .sort(
            (a: Property, b: Property) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 3);

        setRecentAds(latestThree);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    }

    if (token) {
      fetchProperties();
    }
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto md:p-6 py-3 space-y-10" dir="rtl">
      <div>
        <h1 className="md:text-2xl text-lg font-bold text-gray-800 flex flex-row gap-3">
          <MdOutlineWavingHand className="w-7 h-7" /> خوش آمدید{" "}
          {client.full_name}
        </h1>
        <p className="text-gray-500 text-sm md:mt-0">
          در اینجا خلاصه‌ای از فعالیت‌های اخیر شما را می‌بینید.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3">
        {stats.map((stat, i) => (
          <SpotlightCard
            key={i}
            className="custom-spotlight-card bg-white border-none shadow-md"
            spotlightColor="rgba(0, 229, 255, 0.5)">
            <Link
              href={stat.href}
              className="block relative rounded-xl md:px-6 px-0 md:py-4 py-0 transition">
              <h2 className="text-sm text-gray-500 mb-1">{stat.label}</h2>
              <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
            </Link>
          </SpotlightCard>
        ))}
      </div>

      {/* Recent Ads */}
      <div>
        <h3 className="md:text-2xl text-lg font-semibold mb-4 flex flex-row items-center gap-3">
          <LuCalendarClock className="w-7 h-7" /> آگهی‌های اخیر شما
        </h3>
        <ul className="space-y-3">
          {recentAds.map((ad) => (
            <li
              key={ad.id}
              className="bg-gray-50 shadow-md rounded-lg p-4 flex justify-between items-center">
              <span className="text-gray-700 font-medium text-sm">
                {ad.title}
              </span>
              <span className="text-gray-400 text-sm">{ad.date}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => dispatch(switchRoute("properties"))}
          className="bg-blue-600 cursor-pointer text-white py-4 px-6 rounded-xl text-center hover:bg-blue-700 transition flex flex-row justify-center items-center gap-3">
          <CiCirclePlus /> ثبت آگهی جدید
        </button>
        <button
          onClick={() => dispatch(switchRoute("account"))}
          className="bg-gray-100 shadow-lg shadow-gray-400 cursor-pointer text-gray-700 py-4 px-6 rounded-xl text-center hover:bg-gray-200 transition flex flex-row justify-center items-center gap-3">
          <GoGear /> ویرایش اطلاعات حساب
        </button>
      </div>
    </div>
  );
}
