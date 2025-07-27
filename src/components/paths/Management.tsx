"use client";
import React from "react";
import Form from "../UI/Form";
import { useState } from "react";
export default function Management() {
  const [mapSelection, setMapSelection] = useState<string[]>([]);

  const vals = [mapSelection, setMapSelection];
  return (
    <div dir="rtl" className="m-3">
      <div className="flex flex-row items-center justify-between">
        <Form />
      </div>
    </div>
  );
}
