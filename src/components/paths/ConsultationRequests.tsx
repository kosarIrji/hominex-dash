import React from "react";
import { format } from "date-fns"; // For formatting dates
import { FaCheck, FaTimes, FaEye } from "react-icons/fa"; // Icons for actions
import { MdOutlineSupportAgent } from "react-icons/md";
interface ConsultationRequest {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyName: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

export default function ConsultationRequests() {
  // Sample data for consultation requests
  const consultationRequests: ConsultationRequest[] = [
    {
      id: 1,
      clientName: "علی محمدی",
      clientEmail: "ali.mohammadi@example.com",
      clientPhone: "09123456789",
      propertyName: "آپارتمان لوکس در زعفرانیه",
      requestDate: "2025-08-01T10:00:00Z",
      status: "pending",
    },
    {
      id: 2,
      clientName: "سارا احمدی",
      clientEmail: "sara.ahmadi@example.com",
      clientPhone: "09129876543",
      propertyName: "ویلای مدرن در لواسان",
      requestDate: "2025-08-02T14:30:00Z",
      status: "approved",
    },
    {
      id: 3,
      clientName: "رضا حسینی",
      clientEmail: "reza.hosseini@example.com",
      clientPhone: "09121234567",
      propertyName: "خانه ویلایی در نیاوران",
      requestDate: "2025-08-03T09:15:00Z",
      status: "rejected",
    },
    // Add more sample data as needed
  ];

  // Handle approve action
  const handleApprove = (id: number) => {
    console.log("Approve request with ID:", id);
    // Add API call to update status to 'approved'
  };

  // Handle reject action
  const handleReject = (id: number) => {
    console.log("Reject request with ID:", id);
    // Add API call to update status to 'rejected'
  };

  // Handle view details action
  const handleViewDetails = (id: number) => {
    console.log("View details for request with ID:", id);
    // Add navigation or modal logic to show request details
  };

  return (
    <div dir="rtl" className="m-4 p-4  min-h-screen">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="font-bold flex flex-row items-center text-2xl text-gray-800">
          <MdOutlineSupportAgent className="w-7 h-7 mx-2" />
          مدیریت درخواست‌های مشاوره
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultationRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {request.propertyName}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">نام مشتری:</span>{" "}
              {request.clientName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">ایمیل:</span> {request.clientEmail}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">تلفن:</span> {request.clientPhone}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">تاریخ درخواست:</span>{" "}
              {format(new Date(request.requestDate), "yyyy-MM-dd HH:mm")}
            </p>
            <p className="text-sm mb-3">
              <span className="font-medium">وضعیت:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  request.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                {request.status === "approved"
                  ? "تایید شده"
                  : request.status === "rejected"
                  ? "رد شده"
                  : "در انتظار"}
              </span>
            </p>
            <div className="flex flex-row gap-3">
              <button
                onClick={() => handleApprove(request.id)}
                disabled={request.status === "approved"}
                className={`p-2 rounded-full ${
                  request.status === "approved"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white transition-colors duration-200 cursor-pointer`}
                title="تایید">
                <FaCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(request.id)}
                disabled={request.status === "rejected"}
                className={`p-2 rounded-full ${
                  request.status === "rejected"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } text-white transition-colors duration-200 cursor-pointer`}
                title="رد">
                <FaTimes className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewDetails(request.id)}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 cursor-pointer"
                title="مشاهده جزئیات">
                <FaEye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
