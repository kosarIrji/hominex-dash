"use client";
import { useState } from "react";

export default function AddTicketForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [urgency, setUrgency] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ticketData = {
      title,
      message,
      type,
      urgency,
    };

    console.log("Submitting ticket:", ticketData);
    // You can send ticketData to your backend via fetch or axios here
  };

  return (
    <div className="flex flex-col mt-5  md:flex-row gap-5 justify-center">
      {/* instruction section */}

      <div className="bg-blue-50  p-6 rounded-xl shadow-md text-gray-800 md:w-1/2 w-full">
        <h2 className="text-xl font-bold mb-4">📋 راهنمای ارسال تیکت</h2>
        <p className="mb-4">
          برای دریافت پشتیبانی بهتر، لطفاً اطلاعات مربوط به درخواست خود را
          به‌صورت دقیق وارد کنید. 📝
        </p>
        <p className="mb-4">
          مواردی مثل عنوان مناسب، نوع درخواست، و میزان فوریت به ما کمک می‌کنن
          سریع‌تر و بهتر راهنمایی‌تون کنیم. 🔍
        </p>
        <p className="text-sm text-gray-600 mt-6">
          ⏰ معمولا پاسخ‌دهی بین <strong>۱ تا ۴ ساعت</strong> طول می‌کشه. از
          صبوری‌تون ممنونیم! 🙏
        </p>
      </div>

      {/* sending form */}
      <form onSubmit={handleSubmit} className="md:w-1/2 w-full px-6 space-y-6">
        <div>
          <label className="block mb-1 font-medium">عنوان تیکت</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-row w-full gap-3">
          <div className="w-full">
            <label className="block mb-1 font-medium">نوع درخواست</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required>
              <option value="technical">فنی</option>
              <option value="financial">مالی</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium">سطح اولویت</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required>
              <option value="urgent">فوری</option>
              <option value="medium">متوسط</option>
              <option value="low">پایین</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">متن تیکت</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          ثبت درخواست
        </button>
      </form>
    </div>
  );
}
