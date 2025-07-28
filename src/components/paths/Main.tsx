"use client";
import React from "react";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { GoGear } from "react-icons/go";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineWavingHand } from "react-icons/md";
import SpotlightCard from "../../../blocks/Components/SpotlightCard/SpotlightCard";

export default function Main() {
  const stats = [
    { label: "آگهی‌های من", value: 12, href: "/ads" },
    { label: "آگهی‌های نشان‌شده", value: 4, href: "/liked" },
    { label: "بازدید امروز", value: 187, href: "/ads" },
    { label: "تکمیل پروفایل", value: "80%", href: "/profile" },
  ];

  const recentAds = [
    { title: "آپارتمان 80 متری نوساز", date: "1403/04/12" },
    { title: "زمین 200 متری در لواسان", date: "1403/04/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex flex-row gap-3">
          <MdOutlineWavingHand className="w-7 h-7" /> خوش آمدید رضا
        </h1>
        <p className="text-gray-500">
          در اینجا خلاصه‌ای از فعالیت‌های اخیر شما را می‌بینید.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <SpotlightCard
            key={i}
            className="custom-spotlight-card bg-white"
            spotlightColor="rgba(0, 229, 255, 0.5)">
            <Link
              href={stat.href}
              className="block relative rounded-xl px-6 py-4 transition">
              <h2 className="text-sm text-gray-500 mb-1">{stat.label}</h2>
              <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
            </Link>
          </SpotlightCard>
        ))}
      </div>

      {/* Recent Ads */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex flex-row items-center gap-3">
          <LuCalendarClock className="w-7 h-7" /> آگهی‌های اخیر شما
        </h3>
        <ul className="space-y-3">
          {recentAds.map((ad, i) => (
            <li
              key={i}
              className="bg-gray-50 border rounded-lg p-4 flex justify-between items-center">
              <span className="text-gray-700 font-medium">{ad.title}</span>
              <span className="text-gray-400 text-sm">{ad.date}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/ads/new"
          className="bg-blue-600 text-white py-4 px-6 rounded-xl text-center hover:bg-blue-700 transition flex flex-row justify-center items-center gap-3">
          <CiCirclePlus /> ثبت آگهی جدید
        </Link>
        <Link
          href="/profile"
          className="bg-gray-100 text-gray-700 py-4 px-6 rounded-xl text-center hover:bg-gray-200 transition flex flex-row justify-center items-center gap-3">
          <GoGear /> ویرایش اطلاعات حساب
        </Link>
      </div>
    </div>
  );
}
