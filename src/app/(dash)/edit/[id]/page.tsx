"use client";
import React from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Image
          src="/assets/svg/notFound.svg"
          alt="صفحه یافت نشد"
          width={300}
          height={300}
          className="mx-auto mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          صفحه درحال توسعه 👾
        </h2>
        <p className="text-gray-600 mb-8">
          با عرض پوزش درحال حاضر امکان ویرایش ملک امکان پذیر نمی باشد.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
          <FaHome className="w-5 h-5" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
