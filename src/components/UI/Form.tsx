/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import { iranProvinces } from "@/config/Provinces";
import MapComponent from "./map";
import ImageUploader from "./ImageUploader";
import { url_v1 } from "@/config/urls";
import { useSession, signOut } from "next-auth/react";
import { errorToast, successToast } from "@/config/Toasts";

interface FormData {
  property_type_id: number;
  title: string;
  description: string;
  property_category:
    | "residential"
    | "commercial"
    | "office"
    | "land"
    | "garden_villa"
    | "presale";
  transaction_type:
    | "sale"
    | "rent_mortgage"
    | "daily_rent"
    | "construction_partnership"
    | "presale"
    | "exchange";
  total_price?: string;
  mortgage_price?: string;
  rent_price?: string;
  daily_rent_price?: string;
  land_area?: string;
  building_area?: string;
  rooms_count?: string;
  floor_number?: string;
  total_floors?: string;
  unit_number?: string;
  total_units_in_floor?: string;
  construction_year?: string;
  completion_date?: string;
  document_status?:
    | "single_deed"
    | "six_dangs"
    | "promissory"
    | "attorney"
    | "endowment"
    | "transferring"
    | "rental_right"
    | "other";
  property_direction?: "north" | "south" | "east" | "west";
  unit_direction?: "north" | "south" | "east" | "west" | "middle";
  corner_count?: "1" | "2" | "3" | "4";
  view_type?: "street" | "alley" | "garden_view";
  flooring_type?: "ceramic" | "parquet" | "stone" | "mosaic" | "cement";
  kitchen_type?: "open" | "island";
  cabinet_type?:
    | "mdf"
    | "wood"
    | "metal"
    | "high_gloss"
    | "vacuum"
    | "membrane";
  closet_type?:
    | "mdf"
    | "wood"
    | "metal"
    | "high_gloss"
    | "vacuum"
    | "membrane"
    | "none";
  wc_type?: "iranian" | "western" | "both";
  wc_count?: string;
  has_bathtub?: boolean;
  has_jacuzzi?: boolean;
  has_separate_access?: boolean;
  shop_front_area?: string;
  shop_floor_area?: string;
  frontage_area?: string;
  land_usage?: string;
  entrance_type?:
    | "electric_shutter"
    | "manual_shutter"
    | "glass"
    | "metal"
    | "other";
  cooling_heating_systems: string[];
  building_amenities: string[];
  utilities: ("water" | "electricity" | "gas" | "phone")[];
  amenities: number[];
  province: string;
  city: string;
  address: string;
  status: "draft" | "pending";
  images?: string[];
}

interface ApiPayload {
  property_type_id: number;
  title: string;
  description: string;
  property_category:
    | "residential"
    | "commercial"
    | "office"
    | "land"
    | "garden_villa"
    | "presale";
  transaction_type:
    | "sale"
    | "rent_mortgage"
    | "daily_rent"
    | "construction_partnership"
    | "presale"
    | "exchange";
  total_price?: number;
  mortgage_price?: number;
  rent_price?: number;
  daily_rent_price?: number;
  land_area?: number;
  building_area?: number;
  rooms_count?: number;
  floor_number?: number;
  total_floors?: number;
  unit_number?: number;
  total_units_in_floor?: number;
  construction_year?: number;
  completion_date?: string;
  document_status?:
    | "single_deed"
    | "six_dangs"
    | "promissory"
    | "attorney"
    | "endowment"
    | "transferring"
    | "rental_right"
    | "other";
  property_direction?: "north" | "south" | "east" | "west";
  unit_direction?: "north" | "south" | "east" | "west" | "middle";
  corner_count?: number;
  view_type?: "street" | "alley" | "garden_view";
  flooring_type?: "ceramic" | "parquet" | "stone" | "mosaic" | "cement";
  kitchen_type?: "open" | "island";
  cabinet_type?:
    | "mdf"
    | "wood"
    | "metal"
    | "high_gloss"
    | "vacuum"
    | "membrane";
  closet_type?:
    | "mdf"
    | "wood"
    | "metal"
    | "high_gloss"
    | "vacuum"
    | "membrane"
    | "none";
  wc_type?: "iranian" | "western" | "both";
  wc_count?: number;
  has_bathtub?: boolean;
  has_jacuzzi?: boolean;
  has_separate_access?: boolean;
  shop_front_area?: number;
  shop_floor_area?: number;
  frontage_area?: number;
  land_usage?: string;
  entrance_type?:
    | "electric_shutter"
    | "manual_shutter"
    | "glass"
    | "metal"
    | "other";
  cooling_heating_systems?: string[];
  building_amenities?: string[];
  utilities?: string[];
  amenities?: number[];
  province?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  sector: string;
  status?: "draft" | "pending";
  images?: string[];
  is_featured: boolean;
}

export default function SubmitPropertyPage() {
  const { data: session, status } = useSession();
  const token = session?.user?.access_token;

  // Utility to format numbers with commas
  function formatNumberWithCommas(value: string): string {
    const num = value.replace(/[^\d]/g, "");
    if (!num) return "";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const coolingHeatingOptions = [
    { value: "کولر آبی", label: "کولر آبی" },
    { value: "گازی", label: "گازی" },
    { value: "فن کویل", label: "فن کویل" },
    { value: "داکت اسپلیت", label: "داکت اسپلیت" },
    { value: "چیلر", label: "چیلر" },
    { value: "گرمایش از کف", label: "گرمایش از کف" },
    { value: "پکیج", label: "پکیج" },
    { value: "شوفاژ", label: "شوفاژ" },
  ];

  const buildingAmenitiesOptions = [
    { value: "آسانسور", label: "آسانسور" },
    { value: "پارکینگ", label: "پارکینگ" },
    { value: "انباری", label: "انباری" },
    { value: "بالکن", label: "بالکن" },
    { value: "تراس", label: "تراس" },
    { value: "درب ریموتی", label: "درب ریموتی" },
    { value: "آیفون تصویری", label: "آیفون تصویری" },
    { value: "برق اضطراری", label: "برق اضطراری" },
    { value: "شوتینگ زباله", label: "شوتینگ زباله" },
    { value: "جارو مرکزی", label: "جارو مرکزی" },
    { value: "BMS", label: "BMS" },
  ];

  const utilitiesOptions = [
    { value: "water", label: "آب" },
    { value: "electricity", label: "برق" },
    { value: "gas", label: "گاز" },
    { value: "phone", label: "تلفن" },
  ];

  const amenitiesOptions = [
    { value: 1, label: "استخر" },
    { value: 2, label: "سالن ورزشی" },
    { value: 3, label: "نگهبانی" },
    { value: 4, label: "سونا" },
    { value: 5, label: "روف گاردن" },
  ];

  const propertyTypeOptions = [
    { value: 1, label: "آپارتمان" },
    { value: 2, label: "ویلا" },
    { value: 3, label: "مغازه" },
    { value: 4, label: "دفتر کار" },
    { value: 5, label: "زمین" },
    { value: 6, label: "پاساژ" },
    { value: 7, label: "مجتمع" },
  ];

  const [formData, setFormData] = useState<FormData>({
    property_type_id: 1,
    title: "",
    description: "",
    property_category: "residential",
    transaction_type: "sale",
    cooling_heating_systems: [],
    building_amenities: [],
    utilities: [],
    amenities: [],
    province: "",
    city: "",
    address: "",
    status: "pending",
    images: [],
  });

  const [showDetails, setShowDetails] = useState(false); // State for toggling details section

  // Province and city dropdown state
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  // Handle province change to update city options
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    setFormData((prev) => ({ ...prev, province: selectedProvince, city: "" }));
    const found = iranProvinces.find((p) => p.استان === selectedProvince);
    setCityOptions(found ? found.شهرها : []);
    setErrors((prev) => ({ ...prev, province: undefined, city: undefined }));
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, city: e.target.value }));
    setErrors((prev) => ({ ...prev, city: undefined }));
  };

  // Initialize city options if province is pre-filled (edit mode)
  useEffect(() => {
    if (formData.province) {
      const found = iranProvinces.find((p) => p.استان === formData.province);
      setCityOptions(found ? found.شهرها : []);
    } else {
      setCityOptions([]);
    }
  }, [formData.province]);

  const [mapSelection, setMapSelection] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "عنوان آگهی الزامی است";
    if (!formData.province.trim()) newErrors.province = "استان الزامی است";
    if (!formData.city.trim()) newErrors.city = "شهر الزامی است";
    // if (!formData.address.trim()) newErrors.address = "آدرس الزامی است";
    if (!formData.property_type_id)
      newErrors.property_type_id = "شناسه نوع ملک الزامی است";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const digitFields = [
      "total_price",
      "mortgage_price",
      "rent_price",
      "daily_rent_price",
      "land_area",
      "building_area",
      "rooms_count",
      "floor_number",
      "total_floors",
      "unit_number",
      "total_units_in_floor",
      "wc_count",
      "shop_front_area",
      "shop_floor_area",
      "frontage_area",
    ];
    setFormData({
      ...formData,
      [name]: digitFields.includes(name)
        ? formatNumberWithCommas(value)
        : value,
    });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field:
      | "cooling_heating_systems"
      | "building_amenities"
      | "utilities"
      | "amenities"
  ) => {
    const { value, checked } = e.target;
    const currentArray = formData[field] as string[] | number[];
    const isAmenities = field === "amenities";
    const parsedValue = isAmenities ? parseInt(value) : value;

    if (checked) {
      setFormData({ ...formData, [field]: [...currentArray, parsedValue] });
    } else {
      setFormData({
        ...formData,
        [field]: currentArray.filter((item) => item !== parsedValue),
      });
    }
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const onSelectedImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 20);
      setSelectedImages((prev) => {
        // Filter out duplicates by name and size
        const existing = new Set(prev.map((f) => f.name + f.size));
        const newFiles = files.filter((f) => !existing.has(f.name + f.size));
        return [...prev, ...newFiles].slice(0, 20); // Limit to 20 total
      });
    }
  };

  const handleImageUpload = async (propertyId: number): Promise<string[]> => {
    if (!token) {
      errorToast("لطفاً ابتدا وارد شوید.");
      return [];
    }

    const imageUrls: string[] = [];
    for (const [index, file] of selectedImages.entries()) {
      if (file.size > 5 * 1024 * 1024) {
        errorToast("حجم تصویر بیش از ۵ مگابایت است.");
        continue;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("is_primary", index === 0 ? "true" : "false");
      formData.append("display_order", (index + 1).toString());

      try {
        const response = await fetch(
          url_v1(`/user/properties/${propertyId}/images`),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const result = await response.json();
        if (!response.ok) {
          if (response.status === 400) {
            errorToast("حداکثر ۲۰ تصویر برای هر ملک مجاز است.");
            break;
          } else if (response.status === 422) {
            errorToast(result.errors?.image?.[0] || "خطا در بارگذاری تصویر");
            continue;
          } else if (response.status === 401) {
            errorToast("احراز هویت ناموفق - لطفاً دوباره وارد شوید.");
            signOut();
            return [];
          } else {
            errorToast(result.message || "خطا در بارگذاری تصویر");
            continue;
          }
        }

        imageUrls.push(result.data.image.image_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        errorToast("خطا در بارگذاری تصویر");
      }
    }

    return imageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated" || !token) {
      errorToast("لطفاً ابتدا وارد شوید.");
      signOut();
      return;
    }

    if (!validateForm()) {
      errorToast("لطفاً فیلدهای الزامی را پر کنید.");
      return;
    }

    if (selectedImages.length === 0) {
      errorToast("لطفاً حداقل یک تصویر انتخاب کنید.");
      return;
    }

    setIsSubmitting(true);

    // Transform FormData to API payload
    const payload: ApiPayload = {
      property_type_id: Number(formData.property_type_id) || 1,
      title: formData.title,
      description: formData.description,
      property_category: formData.property_category,
      transaction_type: formData.transaction_type,
      total_price: formData.total_price
        ? parseInt(formData.total_price.replace(/,/g, ""))
        : undefined,
      mortgage_price: formData.mortgage_price
        ? parseInt(formData.mortgage_price.replace(/,/g, ""))
        : undefined,
      rent_price: formData.rent_price
        ? parseInt(formData.rent_price.replace(/,/g, ""))
        : undefined,
      daily_rent_price: formData.daily_rent_price
        ? parseInt(formData.daily_rent_price.replace(/,/g, ""))
        : undefined,
      land_area: formData.land_area
        ? parseInt(formData.land_area.replace(/,/g, ""))
        : undefined,
      building_area: formData.building_area
        ? parseInt(formData.building_area.replace(/,/g, ""))
        : undefined,
      rooms_count: formData.rooms_count
        ? parseInt(formData.rooms_count.replace(/,/g, ""))
        : undefined,
      floor_number: formData.floor_number
        ? parseInt(formData.floor_number.replace(/,/g, ""))
        : undefined,
      total_floors: formData.total_floors
        ? parseInt(formData.total_floors.replace(/,/g, ""))
        : undefined,
      unit_number: formData.unit_number
        ? parseInt(formData.unit_number.replace(/,/g, ""))
        : undefined,
      total_units_in_floor: formData.total_units_in_floor
        ? parseInt(formData.total_units_in_floor.replace(/,/g, ""))
        : undefined,
      construction_year: formData.construction_year
        ? parseInt(formData.construction_year)
        : undefined,
      completion_date: formData.completion_date,
      document_status: formData.document_status,
      property_direction: formData.property_direction,
      unit_direction: formData.unit_direction,
      corner_count: formData.corner_count
        ? parseInt(formData.corner_count)
        : undefined,
      view_type: formData.view_type,
      flooring_type: formData.flooring_type,
      kitchen_type: formData.kitchen_type,
      cabinet_type: formData.cabinet_type,
      closet_type: formData.closet_type,
      wc_type: formData.wc_type,
      wc_count: formData.wc_count
        ? parseInt(formData.wc_count.replace(/,/g, ""))
        : undefined,
      has_bathtub: formData.has_bathtub,
      has_jacuzzi: formData.has_jacuzzi,
      has_separate_access: formData.has_separate_access,
      shop_front_area: formData.shop_front_area
        ? parseInt(formData.shop_front_area.replace(/,/g, ""))
        : undefined,
      shop_floor_area: formData.shop_floor_area
        ? parseInt(formData.shop_floor_area.replace(/,/g, ""))
        : undefined,
      frontage_area: formData.frontage_area
        ? parseInt(formData.frontage_area.replace(/,/g, ""))
        : undefined,
      land_usage: formData.land_usage,
      entrance_type: formData.entrance_type,
      cooling_heating_systems: formData.cooling_heating_systems.length
        ? formData.cooling_heating_systems
        : undefined,
      building_amenities: formData.building_amenities.length
        ? formData.building_amenities
        : undefined,
      utilities: formData.utilities.length ? formData.utilities : undefined,
      amenities: formData.amenities.length ? formData.amenities : undefined,
      province: formData.province || undefined,
      city: formData.city || undefined,
      address: formData.address || undefined,
      sector: mapSelection[0],
      status: formData.status,
      images: formData.images,
      is_featured: false,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    try {
      // Step 1: Create the property
      const response = await fetch(url_v1("/user/properties"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedPayload),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          errorToast("احراز هویت ناموفق - لطفاً دوباره وارد شوید.");
          signOut();
          return;
        } else if (response.status === 422) {
          errorToast(
            "داده‌های ورودی نامعتبر است: " + (result.message || "خطای ناشناخته")
          );

          Object.entries(result.errors as Record<string, string[]>).forEach(
            ([field, messages]) => {
              messages.forEach((msg) => {
                errorToast(`${msg}`);
              });
            }
          );
          return;
        } else {
          errorToast(result.message || "خطا در ثبت آگهی");
          return;
        }
      }

      const propertyId = result.data?.id;
      if (!propertyId) {
        errorToast("شناسه ملک دریافت نشد.");
        return;
      }

      // Step 2: Upload images
      const imageUrls = await handleImageUpload(propertyId);
      if (imageUrls.length === 0) {
        errorToast("هیچ تصویری با موفقیت بارگذاری نشد.");
        return;
      }

      successToast("آگهی با موفقیت ثبت شد.");
      setFormData({
        property_type_id: 1,
        title: "",
        description: "",
        property_category: "residential",
        transaction_type: "sale",
        cooling_heating_systems: [],
        building_amenities: [],
        utilities: [],
        amenities: [],
        province: "",
        city: "",
        address: "",
        status: "pending",
        images: [],
      });
      setSelectedImages([]);
      setMapSelection([]);
    } catch (error) {
      console.error("Error:", error);
      errorToast(
        "خطا در ثبت آگهی: " +
          (error instanceof Error ? error.message : "خطای ناشناخته")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isResidentialOrOffice = ["residential", "office"].includes(
    formData.property_category
  );
  const isCommercial = formData.property_category === "commercial";
  const isLand = formData.property_category === "land";
  const isPresale = formData.property_category === "presale";

  return (
    <div
      dir="rtl"
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg font-morabba">
      <ImageUploader
        onSelectedImages={onSelectedImages}
        onUpload={() => Promise.resolve()}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">نوع ملک</label>
            <select
              name="property_category"
              value={formData.property_category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
              <option value="residential">مسکونی</option>
              <option value="commercial">تجاری</option>
              <option value="office">اداری</option>
              <option value="land">زمین/کلنگی</option>
              <option value="garden_villa">ویلا/باغ</option>
              <option value="presale">پیش‌فروش</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              شناسه نوع ملک
            </label>
            <select
              name="property_type_id"
              value={formData.property_type_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
              <option value="">انتخاب کنید</option>
              {propertyTypeOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.property_type_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.property_type_id}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            عنوان آگهی
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="عنوان آگهی را وارد کنید"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium mb-1">نوع معامله</label>
          <div className="flex flex-wrap gap-4">
            {[
              { value: "sale", label: "فروش" },
              { value: "rent_mortgage", label: "رهن و اجاره" },
              { value: "daily_rent", label: "اجاره روزانه" },
              { value: "construction_partnership", label: "مشارکت در ساخت" },
              { value: "presale", label: "پیش‌فروش" },
              { value: "exchange", label: "معاوضه" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center">
                <input
                  type="radio"
                  name="transaction_type"
                  value={value}
                  checked={formData.transaction_type === value}
                  onChange={handleInputChange}
                  className="ml-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Price Fields */}
        {["sale", "construction_partnership", "presale", "exchange"].includes(
          formData.transaction_type
        ) && (
          <div>
            <label
              htmlFor="total_price"
              className="block text-sm font-medium mb-1">
              قیمت کل (تومان)
            </label>
            <input
              id="total_price"
              name="total_price"
              type="text"
              value={formData.total_price || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="مثال: 1,000,000,000"
            />
          </div>
        )}

        {formData.transaction_type === "rent_mortgage" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="mortgage_price"
                className="block text-sm font-medium mb-1">
                قیمت ودیعه (تومان)
              </label>
              <input
                id="mortgage_price"
                name="mortgage_price"
                type="text"
                value={formData.mortgage_price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="مثال: 500,000,000"
              />
            </div>
            <div>
              <label
                htmlFor="rent_price"
                className="block text-sm font-medium mb-1">
                قیمت اجاره (تومان)
              </label>
              <input
                id="rent_price"
                name="rent_price"
                type="text"
                value={formData.rent_price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="مثال: 15,000,000"
              />
            </div>
          </div>
        )}
        {formData.transaction_type === "daily_rent" && (
          <div>
            <label
              htmlFor="daily_rent_price"
              className="block text-sm font-medium mb-1">
              قیمت اجاره روزانه (تومان)
            </label>
            <input
              id="daily_rent_price"
              name="daily_rent_price"
              type="text"
              value={formData.daily_rent_price || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="مثال: 1,000,000"
            />
          </div>
        )}

        {/* Location Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium mb-1">
              استان
            </label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleProvinceChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
              <option value="">انتخاب استان</option>
              {iranProvinces.map((prov) => (
                <option key={prov.استان} value={prov.استان}>
                  {prov.استان}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-sm mt-1">{errors.province}</p>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              شهر
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              disabled={!formData.province}>
              <option value="">
                {formData.province
                  ? "انتخاب شهر"
                  : "ابتدا استان را انتخاب کنید"}
              </option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              آدرس کامل <span className="text-yellow-600">( اختیاری )</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 mb-5"
              placeholder="مثال: خیابان سعادت آباد، خیابان کاج، پلاک 15"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
            <MapComponent
              mapSelection={mapSelection}
              setMapSelection={setMapSelection}
            />
          </div>
        </div>

        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="land_area"
              className="block text-sm font-medium mb-1">
              متراژ زمین (متر)
            </label>
            <input
              id="land_area"
              name="land_area"
              type="text"
              value={formData.land_area || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="مثال: 200"
            />
          </div>
          {(isResidentialOrOffice || isCommercial) && (
            <div>
              <label
                htmlFor="building_area"
                className="block text-sm font-medium mb-1">
                متراژ زیربنا (متر)
              </label>
              <input
                id="building_area"
                name="building_area"
                type="text"
                value={formData.building_area || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                placeholder="مثال: 150"
              />
            </div>
          )}
        </div>

        {/* Residential & Office Fields */}
        {(isResidentialOrOffice || isCommercial) && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">مشخصات ملک</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rooms_count"
                  className="block text-sm font-medium mb-1">
                  تعداد اتاق
                </label>
                <input
                  id="rooms_count"
                  name="rooms_count"
                  type="text"
                  value={formData.rooms_count || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="مثال: 3"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="floor_number"
                    className="block text-sm font-medium mb-1">
                    طبقه
                  </label>
                  <input
                    id="floor_number"
                    name="floor_number"
                    type="text"
                    value={formData.floor_number || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="مثال: 3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="total_floors"
                    className="block text-sm font-medium mb-1">
                    کل طبقات
                  </label>
                  <input
                    id="total_floors"
                    name="total_floors"
                    type="text"
                    value={formData.total_floors || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="مثال: 5"
                  />
                </div>
              </div>
              {isResidentialOrOffice && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="unit_number"
                      className="block text-sm font-medium mb-1">
                      شماره واحد
                    </label>
                    <input
                      id="unit_number"
                      name="unit_number"
                      type="text"
                      value={formData.unit_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                      placeholder="مثال: 3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="total_units_in_floor"
                      className="block text-sm font-medium mb-1">
                      تعداد کل واحد ها
                    </label>
                    <input
                      id="total_units_in_floor"
                      name="total_units_in_floor"
                      type="text"
                      value={formData.total_units_in_floor || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                      placeholder="مثال: 4"
                    />
                  </div>
                </div>
              )}
              {isPresale ? (
                <div>
                  <label
                    htmlFor="completion_date"
                    className="block text-sm font-medium mb-1">
                    تاریخ تکمیل
                  </label>
                  <input
                    id="completion_date"
                    name="completion_date"
                    type="date"
                    value={formData.completion_date || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="مثال: 1405-06-01"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="construction_year"
                    className="block text-sm font-medium mb-1">
                    سال ساخت
                  </label>
                  <select
                    id="construction_year"
                    name="construction_year"
                    value={formData.construction_year || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                    <option value="">انتخاب کنید</option>
                    {Array.from({ length: 1404 - 1300 + 1 }, (_, i) => 1300 + i)
                      .reverse()
                      .map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="document_status"
                className="block text-sm font-medium mb-1">
                وضعیت سند
              </label>
              <select
                id="document_status"
                name="document_status"
                value={formData.document_status || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                <option value="">انتخاب کنید</option>
                <option value="single_deed">سند تک‌برگ</option>
                <option value="six_dangs">۶ دانگ</option>
                <option value="promissory">قولنامه</option>
                <option value="attorney">وکالتی</option>
                <option value="endowment">وقفی</option>
                <option value="transferring">در حال انتقال</option>
                <option value="rental_right">سرقفلی</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="property_direction"
                  className="block text-sm font-medium mb-1">
                  جهت ملک
                </label>
                <select
                  id="property_direction"
                  name="property_direction"
                  value={formData.property_direction || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                  <option value="">انتخاب کنید</option>
                  <option value="north">شمالی</option>
                  <option value="south">جنوبی</option>
                  <option value="east">شرقی</option>
                  <option value="west">غربی</option>
                  <option value="corner">دونبش</option>
                </select>
              </div>
              {isResidentialOrOffice && (
                <div>
                  <label
                    htmlFor="unit_direction"
                    className="block text-sm font-medium mb-1">
                    جهت واحد
                  </label>
                  <select
                    id="unit_direction"
                    name="unit_direction"
                    value={formData.unit_direction || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                    <option value="">انتخاب کنید</option>
                    <option value="north">شمالی</option>
                    <option value="south">جنوبی</option>
                    <option value="east">شرقی</option>
                    <option value="west">غربی</option>
                    <option value="middle">میانی</option>
                  </select>
                </div>
              )}
              <div>
                <label
                  htmlFor="corner_count"
                  className="block text-sm font-medium mb-1">
                  تعداد نبش
                </label>
                <select
                  id="corner_count"
                  name="corner_count"
                  value={formData.corner_count || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                  <option value="">انتخاب کنید</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                امکانات ساختمان
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {buildingAmenitiesOptions.map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={value}
                      checked={formData.building_amenities.includes(value)}
                      onChange={(e) =>
                        handleCheckboxChange(e, "building_amenities")
                      }
                      className="ml-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {formData.property_category === "residential" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mb-4">
                  {showDetails ? "مخفی کردن جزئیات" : "نمایش جزئیات بیشتر"}
                </button>
                <div
                  className={`space-y-4 transition-all duration-300 ease-in-out ${
                    showDetails
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}>
                  <div>
                    <label
                      htmlFor="view_type"
                      className="block text-sm font-medium mb-1">
                      نوع ویو
                    </label>
                    <select
                      id="view_type"
                      name="view_type"
                      value={formData.view_type || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                      <option value="">انتخاب کنید</option>
                      <option value="street">خیابان</option>
                      <option value="alley">کوچه</option>
                      <option value="garden_view">حیاط</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="flooring_type"
                      className="block text-sm font-medium mb-1">
                      نوع کفپوش
                    </label>
                    <select
                      id="flooring_type"
                      name="flooring_type"
                      value={formData.flooring_type || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                      <option value="">انتخاب کنید</option>
                      <option value="ceramic">سرامیک</option>
                      <option value="parquet">پارکت</option>
                      <option value="stone">سنگ</option>
                      <option value="mosaic">موزاییک</option>
                      <option value="cement">سیمان</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="kitchen_type"
                        className="block text-sm font-medium mb-1">
                        نوع آشپزخانه
                      </label>
                      <select
                        id="kitchen_type"
                        name="kitchen_type"
                        value={formData.kitchen_type || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                        <option value="">انتخاب کنید</option>
                        <option value="open">اپن</option>
                        <option value="island">جزیره</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="cabinet_type"
                        className="block text-sm font-medium mb-1">
                        نوع کابینت
                      </label>
                      <select
                        id="cabinet_type"
                        name="cabinet_type"
                        value={formData.cabinet_type || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                        <option value="">انتخاب کنید</option>
                        <option value="mdf">ام دی اف</option>
                        <option value="wood">چوب</option>
                        <option value="metal">فلزی</option>
                        <option value="high_gloss">هایگلاس</option>
                        <option value="vacuum">وکیوم</option>
                        <option value="membrane">ممبران</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="closet_type"
                      className="block text-sm font-medium mb-1">
                      نوع کمد
                    </label>
                    <select
                      id="closet_type"
                      name="closet_type"
                      value={formData.closet_type || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                      <option value="">انتخاب کنید</option>
                      <option value="mdf">ام دی اف</option>
                      <option value="wood">چوب</option>
                      <option value="metal">فلزی</option>
                      <option value="high_gloss">هایگلاس</option>
                      <option value="vacuum">وکیوم</option>
                      <option value="membrane">ممبران</option>
                      <option value="none">ندارد</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      سرویس بهداشتی
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { value: "iranian", label: "ایرانی" },
                        { value: "western", label: "فرنگی" },
                        { value: "both", label: "هر دو" },
                      ].map(({ value, label }) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="radio"
                            name="wc_type"
                            value={value}
                            checked={formData.wc_type === value}
                            onChange={handleInputChange}
                            className="ml-2"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                    <div>
                      <label
                        htmlFor="wc_count"
                        className="block text-sm font-medium mb-1">
                        تعداد سرویس بهداشتی
                      </label>
                      <input
                        id="wc_count"
                        name="wc_count"
                        type="text"
                        value={formData.wc_count || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                        placeholder="مثال: 2"
                      />
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="has_bathtub"
                          checked={formData.has_bathtub || false}
                          onChange={handleBooleanChange}
                          className="ml-2"
                        />
                        وان
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="has_jacuzzi"
                          checked={formData.has_jacuzzi || false}
                          onChange={handleBooleanChange}
                          className="ml-2"
                        />
                        جکوزی
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      امکانات ملک
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {amenitiesOptions.map(({ value, label }) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="checkbox"
                            value={value}
                            checked={formData.amenities.includes(value)}
                            onChange={(e) =>
                              handleCheckboxChange(e, "amenities")
                            }
                            className="ml-2"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Moved: Cooling/Heating Systems */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      سیستم سرمایش و گرمایش
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {coolingHeatingOptions.map(({ value, label }) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="checkbox"
                            value={value}
                            checked={formData.cooling_heating_systems.includes(
                              value
                            )}
                            onChange={(e) =>
                              handleCheckboxChange(e, "cooling_heating_systems")
                            }
                            className="ml-2"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Moved: Utilities */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">تأسیسات</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {utilitiesOptions.map(({ value, label }) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="checkbox"
                            value={value}
                            checked={formData.utilities.includes(
                              value as "water" | "electricity" | "gas" | "phone"
                            )}
                            onChange={(e) =>
                              handleCheckboxChange(e, "utilities")
                            }
                            className="ml-2"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Commercial Fields */}
        {isCommercial && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">مشخصات واحد تجاری</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="shop_front_area"
                  className="block text-sm font-medium mb-1">
                  متراژ بر مغازه (متر)
                </label>
                <input
                  id="shop_front_area"
                  name="shop_front_area"
                  type="text"
                  value={formData.shop_front_area || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="مثال: 10"
                />
              </div>
              <div>
                <label
                  htmlFor="shop_floor_area"
                  className="block text-sm font-medium mb-1">
                  متراژ کف مغازه (متر)
                </label>
                <input
                  id="shop_floor_area"
                  name="shop_floor_area"
                  type="text"
                  value={formData.shop_floor_area || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="مثال: 50"
                />
              </div>
              <div>
                <label
                  htmlFor="entrance_type"
                  className="block text-sm font-medium mb-1">
                  نوع ورودی
                </label>
                <select
                  id="entrance_type"
                  name="entrance_type"
                  value={formData.entrance_type || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
                  <option value="">انتخاب کنید</option>
                  <option value="electric_shutter">کرکره برقی</option>
                  <option value="manual_shutter">کرکره دستی</option>
                  <option value="glass">شیشه‌ای</option>
                  <option value="metal">فلزی</option>
                  <option value="other">سایر</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Land Fields */}
        {isLand && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">مشخصات زمین</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="frontage_area"
                  className="block text-sm font-medium mb-1">
                  متراژ بر (متر)
                </label>
                <input
                  id="frontage_area"
                  name="frontage_area"
                  type="text"
                  value={formData.frontage_area || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="مثال: 20"
                />
              </div>
              <div>
                <label
                  htmlFor="land_usage"
                  className="block text-sm font-medium mb-1">
                  کاربری
                </label>
                <input
                  id="land_usage"
                  name="land_usage"
                  type="text"
                  value={formData.land_usage || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="مثال: مسکونی"
                />
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className={`${showDetails ? "mt-20" : "mt-0"}`}>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1">
            توضیحات
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="توضیحات ملک را وارد کنید"
            rows={4}
          />
        </div>

        <div className="flex sm:flex-row flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => setFormData({ ...formData, status: "pending" })}
            className={`sm:w-3/4 w-full cursor-pointer p-3 rounded-md text-white ${
              isSubmitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}>
            {isSubmitting ? "در حال ثبت..." : "ثبت آگهی"}
          </button>
          <button
            type="submit"
            onClick={() => setFormData({ ...formData, status: "draft" })}
            disabled={isSubmitting}
            className={`sm:w-1/4 w-full cursor-pointer p-3 rounded-md text-white ${
              isSubmitting ? "bg-gray-300" : "bg-gray-500 hover:bg-gray-600"
            }`}>
            {isSubmitting ? "در حال ثبت..." : "پیش نویس"}
          </button>
        </div>
      </form>
    </div>
  );
}
