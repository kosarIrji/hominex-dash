import { url_v1 } from "@/config/urls";
import React, { useState, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { TbLockAccess } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { errorToast, successToast } from "@/config/Toasts";

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_type: "consultant" | "admin" | "regular";
  is_active: boolean;
  is_phone_verified: boolean;
  properties_count?: number;
  approved_properties_count?: number;
  consultant?: {
    id: number;
    company_name: string;
    is_verified: boolean;
  } | null;
}

interface UserDetails extends User {
  updated_at?: string;
  consultant?: {
    id: number;
    company_name: string;
    bio?: string;
    contact_phone?: string;
    contact_whatsapp?: string;
    contact_telegram?: string;
    contact_instagram?: string;
    is_verified: boolean;
    created_at: string;
  } | null;
  stats?: {
    properties_count: number;
    approved_properties: number;
    pending_properties: number;
    favorites_count: number;
    consultation_requests_count: number;
  };
}

interface CategoryData {
  users: User[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
}

export default function UsersManagement() {
  const session = useSession();
  const [categoryData, setCategoryData] = useState<
    Record<"consultant" | "admin" | "regular", CategoryData>
  >({
    consultant: { users: [], page: 1, hasMore: true, isLoading: false },
    admin: { users: [], page: 1, hasMore: true, isLoading: false },
    regular: { users: [], page: 1, hasMore: true, isLoading: false },
  });
  const [currentCategory, setCurrentCategory] = useState<
    "consultant" | "admin" | "regular"
  >("consultant");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Loading state for Save button

  // Assume token is stored in session
  const TOKEN = session.data?.user?.access_token;

  // Fetch users for a specific category
  const fetchUsers = useCallback(
    async (
      category: "consultant" | "admin" | "regular",
      page: number,
      append: boolean = false
    ) => {
      if (!TOKEN) {
        errorToast("توکن نامعتبر");
        return;
      }

      setCategoryData((prev) => {
        const catData = prev[category];
        if (catData.isLoading || !catData.hasMore) return prev;
        return {
          ...prev,
          [category]: { ...catData, isLoading: true },
        };
      });

      try {
        const response = await fetch(
          url_v1(
            `/admin/users?page=${page}&user_type=${category}&search=${encodeURIComponent(
              searchTerm
            )}`
          ),
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setCategoryData((prev) => {
            const catData = prev[category];
            const newUsers = data.data.users as User[];
            const existingIds = new Set(catData.users.map((user) => user.id));
            const filteredNewUsers = newUsers.filter(
              (user) => !existingIds.has(user.id)
            );
            const updatedUsers = append
              ? [...catData.users, ...filteredNewUsers]
              : filteredNewUsers;
            return {
              ...prev,
              [category]: {
                users: updatedUsers,
                page,
                hasMore: page < data.data.pagination.total_pages,
                isLoading: false,
              },
            };
          });
        } else {
          errorToast(data.message || "Failed to fetch users");
          setCategoryData((prev) => ({
            ...prev,
            [category]: { ...prev[category], isLoading: false },
          }));
        }
      } catch (error) {
        if (error) errorToast("خطا در دریافت اطلاعات");
        setCategoryData((prev) => ({
          ...prev,
          [category]: { ...prev[category], isLoading: false },
        }));
      }
    },
    [TOKEN, searchTerm]
  );

  // Reset and fetch when category or search changes
  useEffect(() => {
    setCategoryData((prev) => ({
      ...prev,
      [currentCategory]: {
        users: [],
        page: 1,
        hasMore: true,
        isLoading: false,
      },
    }));
    fetchUsers(currentCategory, 1, false);
  }, [currentCategory, searchTerm, fetchUsers]);

  // Load more users when button is clicked
  const handleLoadMore = () => {
    const nextPage = categoryData[currentCategory].page + 1;
    setCategoryData((prev) => ({
      ...prev,
      [currentCategory]: { ...prev[currentCategory], page: nextPage },
    }));
    fetchUsers(currentCategory, nextPage, true);
  };

  // Fetch user details
  const fetchUserDetails = async (userId: number) => {
    if (!TOKEN) {
      errorToast("No authentication token available");
      return;
    }
    try {
      const response = await fetch(url_v1(`/admin/users/${userId}`), {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSelectedUser(data.data);
      } else {
        errorToast(data.message || "Failed to fetch user details");
      }
    } catch (err) {
      if (err) errorToast("Error fetching user details");
    }
  };

  // Handlers for actions
  const handleChangeRole = async (id: number, newRole: User["user_type"]) => {
    if (!TOKEN) {
      errorToast("No authentication token available");
      return;
    }
    try {
      const response = await fetch(url_v1(`/admin/users/${id}/change-role`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_type: newRole,
          reason: "تغییر نقش به دلیل درخواست کاربر",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCategoryData((prev) => {
          const updatedCategories = { ...prev };
          Object.keys(updatedCategories).forEach((cat) => {
            updatedCategories[cat as keyof typeof updatedCategories].users =
              updatedCategories[
                cat as keyof typeof updatedCategories
              ].users.map((user) =>
                user.id === id ? { ...user, user_type: newRole } : user
              );
          });
          return updatedCategories;
        });
      } else {
        errorToast(data.message || "Failed to change role");
      }
    } catch (error) {
      if (error) errorToast("خطا در تغییر سطح دسترسی");
    }
  };

  const handleToggleActive = async (id: number) => {
    if (!TOKEN) {
      errorToast("توکن نامعتبر");
      return;
    }
    try {
      const response = await fetch(url_v1(`/admin/users/${id}/toggle-active`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategoryData((prev) => {
          const updatedCategories = { ...prev };
          Object.keys(updatedCategories).forEach((cat) => {
            updatedCategories[cat as keyof typeof updatedCategories].users =
              updatedCategories[
                cat as keyof typeof updatedCategories
              ].users.map((user) =>
                user.id === id
                  ? { ...user, is_active: data.data.is_active }
                  : user
              );
          });
          return updatedCategories;
        });
      } else {
        errorToast(data.message || "Failed to toggle active status");
      }
    } catch (error) {
      if (error) errorToast("خطا در فعال/غیرفعال سازی");
    }
  };

  const handleEditUser = async (user: User) => {
    await fetchUserDetails(user.id);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser || !TOKEN) {
      errorToast("No authentication token available or no user selected");
      return;
    }
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      user_type: formData.get("user_type") as User["user_type"],
      is_active: formData.get("is_active") === "true",
    };
    try {
      const response = await fetch(url_v1(`/admin/users/${selectedUser.id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (data.success) {
        setCategoryData((prev) => {
          const updatedCategories = { ...prev };
          Object.keys(updatedCategories).forEach((cat) => {
            updatedCategories[cat as keyof typeof updatedCategories].users =
              updatedCategories[
                cat as keyof typeof updatedCategories
              ].users.map((user) =>
                user.id === selectedUser.id ? data.data.user : user
              );
          });
          return updatedCategories;
        });
        successToast(data.message);
        setIsModalOpen(false);
        setSelectedUser(null);
      } else {
        errorToast(data.message || "خطا در بروزرسانی کاربر");
      }
    } catch (error) {
      if (error) errorToast("خطا در بروزرسانی کاربر");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const currentData = categoryData[currentCategory];

  // Filter users by search term (client-side for already loaded users)
  const filteredUsers = currentData.users.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render user cards
  const renderUserCards = (users: User[]) => (
    <div className="mb-8 max-w-7xl mx-auto md:p-6 py-3 space-y-10">
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
                  className={`px-2 py-1 rounded-sm text-xs ${
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
                <select
                  value={user.user_type}
                  onChange={(e) =>
                    handleChangeRole(
                      user.id,
                      e.target.value as User["user_type"]
                    )
                  }
                  className="p-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 text-sm"
                  title="تغییر نقش">
                  <option value="consultant">مشاور</option>
                  <option value="admin">ادمین</option>
                  <option value="regular">کاربر عادی</option>
                </select>
                <button
                  onClick={() => handleEditUser(user)}
                  className="p-2 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                  title="ویرایش">
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleToggleActive(user.id)}
                  className={`p-2 rounded-md border border-gray-300 bg-gray-100 text-sm transition-colors duration-200 ${
                    user.is_active
                      ? "text-red-600 hover:bg-red-50"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                  title={user.is_active ? "غیرفعال کردن" : "فعال کردن"}>
                  {user.is_active ? "غیرفعال" : "فعال"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {currentData.hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={currentData.isLoading}
            className={`px-6 py-2 rounded-md text-white ${
              currentData.isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}>
            {currentData.isLoading ? "در حال بارگذاری..." : "بارگذاری بیشتر"}
          </button>
        </div>
      )}
      {!currentData.hasMore && currentData.users.length > 0 && (
        <p className="text-center text-gray-600 mt-6">داده بیشتری وجود ندارد</p>
      )}
    </div>
  );

  return (
    <div
      dir="rtl"
      className="m-4 min-h-screen max-w-7xl mx-auto md:p-6 py-3 space-y-10">
      <div className="flex sm:flex-row flex-col gap-5 sm:gap-0 justify-between items-center mb-6">
        <h1 className="font-bold w-full sm:w-auto flex flex-row items-center md:text-2xl text-lg text-gray-800">
          <TbLockAccess className="w-7 h-7 md:mx-2" />
          مدیریت کاربران
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentCategory("consultant")}
            className={`px-4 py-2 rounded-md ${
              currentCategory === "consultant"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}>
            مشاوران
          </button>
          <button
            onClick={() => setCurrentCategory("admin")}
            className={`px-4 py-2 rounded-md ${
              currentCategory === "admin"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}>
            ادمین‌ها
          </button>
          <button
            onClick={() => setCurrentCategory("regular")}
            className={`px-4 py-2 rounded-md ${
              currentCategory === "regular"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}>
            کاربران عادی
          </button>
        </div>
      </div>
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
      {currentData.isLoading && currentData.users.length === 0 ? (
        <p className="text-gray-600">در حال بارگذاری...</p>
      ) : (
        renderUserCards(filteredUsers)
      )}

      {/* Modal for editing user */}
      {isModalOpen && selectedUser && (
        <div
          style={{ position: "fixed" }}
          className="fixed left-0 top-0 inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className=" bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">ویرایش اطلاعات کاربر</h2>
            <form onSubmit={handleSaveUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  نام کامل
                </label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={selectedUser.full_name || ""}
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
                  defaultValue={selectedUser.email || ""}
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
                  defaultValue={selectedUser.user_type || ""}
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
              {selectedUser.consultant && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    اطلاعات مشاور
                  </label>
                  <p className="text-sm text-gray-600">
                    نام شرکت: {selectedUser.consultant.company_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    بیوگرافی: {selectedUser.consultant.bio || "ندارد"}
                  </p>
                  <p className="text-sm text-gray-600">
                    تماس: {selectedUser.consultant.contact_phone || "ندارد"}
                  </p>
                  <p className="text-sm text-gray-600">
                    واتساپ:{" "}
                    {selectedUser.consultant.contact_whatsapp || "ندارد"}
                  </p>
                  <p className="text-sm text-gray-600">
                    تلگرام:{" "}
                    {selectedUser.consultant.contact_telegram || "ندارد"}
                  </p>
                  <p className="text-sm text-gray-600">
                    اینستاگرام:{" "}
                    {selectedUser.consultant.contact_instagram || "ندارد"}
                  </p>
                </div>
              )}
              {selectedUser.stats && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    آمار
                  </label>
                  <p className="text-sm text-gray-600">
                    تعداد املاک: {selectedUser.stats.properties_count}
                  </p>
                  <p className="text-sm text-gray-600">
                    املاک تایید شده: {selectedUser.stats.approved_properties}
                  </p>
                  <p className="text-sm text-gray-600">
                    املاک در انتظار: {selectedUser.stats.pending_properties}
                  </p>
                  <p className="text-sm text-gray-600">
                    تعداد علاقه‌مندی‌ها: {selectedUser.stats.favorites_count}
                  </p>
                  <p className="text-sm text-gray-600">
                    درخواست‌های مشاوره:{" "}
                    {selectedUser.stats.consultation_requests_count}
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                  لغو
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed`}>
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال ذخیره...
                    </>
                  ) : (
                    "ذخیره"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
