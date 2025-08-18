import React, { useState } from "react";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import { TbLockAccess } from "react-icons/tb";

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_type: "consultant" | "admin" | "regular";
  is_active: boolean;
  is_phone_verified: boolean;
}

export default function UsersManagement() {
  // Sample user data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      full_name: "علی محمدی",
      email: "ali.mohammadi@example.com",
      phone: "09123456789",
      user_type: "consultant",
      is_active: true,
      is_phone_verified: false,
    },
    {
      id: 2,
      full_name: "سارا احمدی",
      email: "sara.ahmadi@example.com",
      phone: "09129876543",
      user_type: "admin",
      is_active: true,
      is_phone_verified: true,
    },
    {
      id: 3,
      full_name: "رضا حسینی",
      email: "reza.hosseini@example.com",
      phone: "09121234567",
      user_type: "regular",
      is_active: false,
      is_phone_verified: false,
    },
    {
      id: 4,
      full_name: "مریم رضایی",
      email: "maryam.rezaei@example.com",
      phone: "09127654321",
      user_type: "consultant",
      is_active: true,
      is_phone_verified: true,
    },
    {
      id: 5,
      full_name: "حسین کریمی",
      email: "hossein.karimi@example.com",
      phone: "09122345678",
      user_type: "regular",
      is_active: true,
      is_phone_verified: false,
    },
  ]);

  // State for search and modal
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Handlers for actions
  const handleToggleActive = (id: number) => {
    console.log(`Toggle active status for user ID: ${id}`);
    // Example API call: fetch(`/api/users/${id}/toggle-active`, { method: "PATCH" })
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, is_active: !user.is_active } : user
      )
    );
  };

  const handleVerifyPhone = (id: number) => {
    console.log(`Verify phone for user ID: ${id}`);
    // Example API call: fetch(`/api/users/${id}/verify-phone`, { method: "PATCH" })
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, is_phone_verified: true } : user
      )
    );
  };

  const handleChangeRole = (id: number, newRole: User["user_type"]) => {
    console.log(`Change role for user ID: ${id} to ${newRole}`);
    // Example API call: fetch(`/api/users/${id}/change-role`, { method: "PATCH", body: JSON.stringify({ user_type: newRole }) })
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, user_type: newRole } : user
      )
    );
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...selectedUser,
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      user_type: formData.get("user_type") as User["user_type"],
      is_active: formData.get("is_active") === "true",
    };
    console.log("Save updated user:", updatedUser);
    // Example API call: fetch(`/api/users/${updatedUser.id}`, { method: "PATCH", body: JSON.stringify(updatedUser) })
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered users by type
  const consultants = filteredUsers.filter(
    (user) => user.user_type === "consultant"
  );
  const admins = filteredUsers.filter((user) => user.user_type === "admin");
  const regulars = filteredUsers.filter((user) => user.user_type === "regular");

  // Render user cards
  const renderUserCards = (users: User[], title: string) => (
    <div className="mb-8 max-w-7xl mx-auto md:p-6 py-3 space-y-10">
      <h2 className="md:text-2xl text-lg font-semibold text-gray-800 mb-4">
        - {title}
      </h2>
      {users.length === 0 ? (
        <p className="text-gray-600">هیچ کاربری در این دسته وجود ندارد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {user.full_name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">ایمیل:</span> {user.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">تلفن:</span> {user.phone}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">نوع کاربر:</span>{" "}
                {user.user_type === "consultant"
                  ? "مشاور"
                  : user.user_type === "admin"
                  ? "ادمین"
                  : "کاربر عادی"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">وضعیت:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {user.is_active ? "فعال" : "غیرفعال"}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">تایید شماره:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.is_phone_verified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {user.is_phone_verified ? "تایید شده" : "تایید نشده"}
                </span>
              </p>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => handleToggleActive(user.id)}
                  className={`p-2 rounded-full ${
                    user.is_active
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white transition-colors duration-200`}
                  title={user.is_active ? "غیرفعال کردن" : "فعال کردن"}>
                  {user.is_active ? (
                    <FaTimes className="w-4 h-4" />
                  ) : (
                    <FaCheck className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleVerifyPhone(user.id)}
                  disabled={user.is_phone_verified}
                  className={`p-2 rounded-full ${
                    user.is_phone_verified
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white transition-colors duration-200`}
                  title="تایید شماره تماس">
                  <FaCheck className="w-4 h-4" />
                </button>
                <select
                  value={user.user_type}
                  onChange={(e) =>
                    handleChangeRole(
                      user.id,
                      e.target.value as User["user_type"]
                    )
                  }
                  className="p-2 rounded-md border bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 text-sm"
                  title="تغییر نقش">
                  <option value="consultant">مشاور</option>
                  <option value="admin">ادمین</option>
                  <option value="regular">کاربر عادی</option>
                </select>
                <button
                  onClick={() => handleEditUser(user)}
                  className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                  title="ویرایش">
                  <FaEdit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      dir="rtl"
      className="m-4  min-h-screen max-w-7xl mx-auto md:p-6 py-3 space-y-10">
      <h1 className="font-bold flex flex-row items-center md:text-2xl text-lg text-gray-800 mb-6">
        <TbLockAccess className="w-7 h-7 md:mx-2" />
        مدیریت کاربران
      </h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          جستجوی کاربر
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجو بر اساس نام..."
          className="p-2 w-full max-w-md border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {renderUserCards(consultants, "مشاوران")}
      {renderUserCards(admins, "ادمین‌ها")}
      {renderUserCards(regulars, "کاربران عادی")}

      {/* Modal for editing user */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">ویرایش اطلاعات کاربر</h2>
            <form onSubmit={handleSaveUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  نام کامل
                </label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={selectedUser.full_name}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedUser.email}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  نوع کاربر
                </label>
                <select
                  name="user_type"
                  defaultValue={selectedUser.user_type}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required>
                  <option value="consultant">مشاور</option>
                  <option value="admin">ادمین</option>
                  <option value="regular">کاربر عادی</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  وضعیت
                </label>
                <select
                  name="is_active"
                  defaultValue={selectedUser.is_active.toString()}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required>
                  <option value="true">فعال</option>
                  <option value="false">غیرفعال</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                  لغو
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
