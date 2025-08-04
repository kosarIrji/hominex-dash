import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // For formatting dates
import { FaCheck, FaTimes, FaEye } from "react-icons/fa"; // Icons for actions
import { MdOutlineSupportAgent } from "react-icons/md";

interface RequestData {
  name: string;
  price: string;
  length: string;
  requestType: string;
  rooms: string;
  vitals: string[];
  clientPrefer: string;
  floorPrefer: string;
  deadline: string;
  visitMethod: string;
  description: string;
  rent: string;
  mortgage: string;
  mapSelection: string[];
  typeOfFunctionality: string;
  envTypePrefer: string;
  landLocation: string;
  landFunctionality: string;
}

interface Credentials {
  phone: string;
}

interface ConsultationRequest {
  id: string;
  data: RequestData;
  credentials: Credentials;
  date: string;
  done: boolean;
}

export default function ConsultationRequests() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);

  // Fetch consultation requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("https://validitycheck.sub4u.site/");
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data: ConsultationRequest[] = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Handle approve action
  const handleApprove = async (id: string) => {
    try {
      const response = await fetch("https://validitycheck.sub4u.site/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to approve request");
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, done: true } : req))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle reject action
  const handleReject = async (id: string) => {
    try {
      const response = await fetch("https://validitycheck.sub4u.site/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: false }),
      });
      if (!response.ok) throw new Error("Failed to reject request");
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, done: false } : req))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle view details action
  const handleViewDetails = (id: string) => {
    const request = requests.find((req) => req.id === id);
    if (request) setSelectedRequest(request);
  };

  // Close modal
  const closeModal = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return <div className="text-center p-4">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">خطا: {error}</div>;
  }

  return (
    <div dir="rtl" className="m-4 p-4 min-h-screen">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="font-bold flex flex-row items-center text-2xl text-gray-800">
          <MdOutlineSupportAgent className="w-7 h-7 mx-2" />
          مدیریت درخواست‌های مشاوره
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {request.data.name}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">نوع درخواست:</span>{" "}
              {request.data.requestType}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">تلفن:</span>{" "}
              {request.credentials.phone}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">تاریخ درخواست:</span> {request.date}
            </p>
            <p className="text-sm mb-3">
              <span className="font-medium">وضعیت:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  request.done
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                {request.done ? "تایید شده" : "در انتظار"}
              </span>
            </p>
            <div className="flex flex-row gap-3">
              <button
                onClick={() => handleApprove(request.id)}
                disabled={request.done}
                className={`p-2 rounded-full ${
                  request.done
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white transition-colors duration-200 cursor-pointer`}
                title="تایید">
                <FaCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(request.id)}
                disabled={!request.done}
                className={`p-2 rounded-full ${
                  !request.done
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

      {/* Modal for viewing details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              جزئیات درخواست
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">نام:</span>{" "}
              {selectedRequest.data.name}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">تلفن:</span>{" "}
              {selectedRequest.credentials.phone}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">نوع درخواست:</span>{" "}
              {selectedRequest.data.requestType}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">قیمت:</span>{" "}
              {selectedRequest.data.price || "مشخص نشده"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">متراژ:</span>{" "}
              {selectedRequest.data.length}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">تعداد اتاق:</span>{" "}
              {selectedRequest.data.rooms}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">امکانات:</span>{" "}
              {selectedRequest.data.vitals.join(", ") || "هیچ"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">ترجیح مشتری:</span>{" "}
              {selectedRequest.data.clientPrefer}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">ترجیح طبقه:</span>{" "}
              {selectedRequest.data.floorPrefer}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">مهلت:</span>{" "}
              {selectedRequest.data.deadline}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">روش بازدید:</span>{" "}
              {selectedRequest.data.visitMethod}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">توضیحات:</span>{" "}
              {selectedRequest.data.description || "هیچ"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">اجاره:</span>{" "}
              {selectedRequest.data.rent || "مشخص نشده"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">رهن:</span>{" "}
              {selectedRequest.data.mortgage || "مشخص نشده"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">مناطق انتخابی:</span>{" "}
              {selectedRequest.data.mapSelection.join(", ") || "هیچ"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">نوع کاربری:</span>{" "}
              {selectedRequest.data.typeOfFunctionality || "مشخص نشده"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">نوع محیط:</span>{" "}
              {selectedRequest.data.envTypePrefer}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">موقعیت زمین:</span>{" "}
              {selectedRequest.data.landLocation || "مشخص نشده"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">کاربری زمین:</span>{" "}
              {selectedRequest.data.landFunctionality || "مشخص نشده"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">تاریخ درخواست:</span>{" "}
              {selectedRequest.date}
            </p>
            <button
              onClick={closeModal}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-200">
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
