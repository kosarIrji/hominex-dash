"use client";
import React from "react";
import Form from "../UI/Form";
import { useState } from "react";
import { FaRegListAlt } from "react-icons/fa";

export default function Management() {
  const [mapSelection, setMapSelection] = useState<string[]>([]);

  const vals = [mapSelection, setMapSelection];
  return (
    <div dir="rtl" className="m-3">
      <span className="text-xl font-bold text-gray-600 mb-6 flex flex-row-reverse w-full items-center justify-end">
        فرم ثبت آگهی ملک <FaRegListAlt className="w-7 h-7 mx-2" />
      </span>
      <div className="flex flex-row items-center justify-between">
        <Form />
      </div>
    </div>
  );
}
