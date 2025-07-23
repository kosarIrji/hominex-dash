import React from "react";

export default function Table() {
  return (
    <div className="relative overflow-x-auto mt-10">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              عنوان تیکت
            </th>
            <th scope="col" className="px-6 py-3">
              نوع
            </th>
            <th scope="col" className="px-6 py-3">
              اولیت
            </th>
            <th scope="col" className="px-6 py-3">
              وضعیت
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              عدم کارکرد دکمه افزودن ملک
            </th>
            <td className="px-6 py-4">فنی</td>
            <td className="px-6 py-4">
              <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-red-400 border border-red-400">
                فوری
              </span>
            </td>
            <td className="px-6 py-4">
              {/* still checking */}
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                درحال بررسی
              </span>
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              مشکل در پرداخت وجه
            </th>
            <td className="px-6 py-4">مالی</td>
            <td className="px-6 py-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                متوسط
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-green-400 border border-green-400">
                پاسخ داده شده
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
