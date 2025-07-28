"use client";
import { useState } from "react";
import MapComponent from "./map";
import axios from "axios";
import Image from "next/image";
import { alt } from "joi";

interface FormData {
  propertyType:
    | "residential"
    | "commercial"
    | "administrative"
    | "land"
    | "villa"
    | "presale";
  adTitle: string;
  transactionType: "sale" | "rent" | "daily_rent" | "partnership";
  totalPrice?: string;
  depositPrice?: string;
  rentPrice?: string;
  // Residential & Administrative
  landArea?: string;
  builtArea?: string;
  rooms?: "1" | "2" | "3" | "more";
  floor?: string;
  totalFloors?: string;
  unit?: string;
  totalUnits?: string;
  buildYear?: string;
  completionDate?: string;
  deedStatus?:
    | "single_leaf"
    | "six_dang"
    | "qowlname"
    | "proxy"
    | "waqf"
    | "transferring"
    | "sarqofl"
    | "other";
  propertyDirection?: "north" | "south" | "east" | "west";
  unitDirection?: "north" | "south" | "east" | "west" | "middle";
  corners?: "1" | "2" | "3" | "4";
  view?: "street" | "alley" | "garden";
  flooring?: "ceramic" | "parquet" | "stone" | "mosaic" | "cement";
  kitchen?: "open" | "island";
  cabinets?: "mdf" | "wood" | "metal" | "highgloss" | "vacuum" | "membrane";
  closet?:
    | "mdf"
    | "wood"
    | "metal"
    | "highgloss"
    | "vacuum"
    | "membrane"
    | "none";
  bathroomType?: "iranian" | "western" | "both";
  bathroomCount?: string;
  hasBathtub?: boolean;
  hasJacuzzi?: boolean;
  coolingHeating: (
    | "water_cooler"
    | "gas"
    | "fan_coil"
    | "duct_split"
    | "chiller"
    | "floor_heating"
    | "package"
    | "radiator"
  )[];
  amenities: (
    | "elevator"
    | "parking"
    | "storage"
    | "balcony"
    | "terrace"
    | "remote_door"
    | "video_intercom"
    | "emergency_power"
    | "trash_chute"
    | "central_vacuum"
    | "bms"
  )[];
  // Commercial
  shopFrontage?: string;
  shopFloorArea?: string;
  entrance?:
    | "electric_shutter"
    | "manual_shutter"
    | "glass"
    | "metal"
    | "other";
  utilities: ("water" | "electricity" | "gas" | "phone")[];
  balconyArea?: string;
  // Land
  landWidth?: string;
  landUse?: string;
  hasSeparateRoad?: boolean;
}

export default function SubmitPropertyPage() {
  // Utility to format numbers with commas
  function formatNumberWithCommas(value: string): string {
    // Remove non-digit characters except dot
    const num = value.replace(/[^\d.]/g, "");
    if (!num) return "";
    // Split integer and decimal
    const [integer, decimal] = num.split(".");
    const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt;
  }
  const commercialAmenitiesOptions = [
    { value: "storage", label: "انبار" },
    { value: "balcony", label: "بالکن" },
    { value: "terrace", label: "تراس" },
    { value: "remote_door", label: "درب ریموتی" },
    { value: "video_intercom", label: "آیفون تصویری" },
    { value: "emergency_power", label: "برق اضطراری" },
    { value: "trash_chute", label: "شوتینگ زباله" },
    { value: "central_vacuum", label: "جارو مرکزی" },
    { value: "bms", label: "BMS" },
  ];
  const coolingHeatingOptions = [
    { value: "water_cooler", label: "کولر آبی" },
    { value: "gas", label: "گازی" },
    { value: "fan_coil", label: "فن کویل" },
    { value: "duct_split", label: "داکت اسپیلت" },
    { value: "chiller", label: "چیلر" },
    { value: "floor_heating", label: "گرمایش از کف" },
    { value: "package", label: "پکیج" },
    { value: "radiator", label: "شوفاژ" },
  ];

  const amenitiesOptions = [
    { value: "elevator", label: "آسانسور" },
    { value: "parking", label: "پارکینگ" },
    { value: "storage", label: "انباری" },
    { value: "balcony", label: "بالکن" },
    { value: "terrace", label: "تراس" },
    { value: "remote_door", label: "درب ریموتی" },
    { value: "video_intercom", label: "آیفون تصویری" },
    { value: "emergency_power", label: "برق اضطراری" },
    { value: "trash_chute", label: "شوتینگ زباله" },
    { value: "central_vacuum", label: "جارو مرکزی" },
    { value: "bms", label: "BMS" },
  ];

  const [formData, setFormData] = useState<FormData>({
    propertyType: "residential",
    adTitle: "",
    transactionType: "sale",
    coolingHeating: [],
    amenities: [],
    utilities: [],
  });

  const [mapSelection, setMapSelection] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    // List of fields that should be formatted
    const digitFields = [
      "totalPrice",
      "depositPrice",
      "rentPrice",
      "landArea",
      "builtArea",
      "shopFrontage",
      "shopFloorArea",
      "balconyArea",
      "landWidth",
      "totalUnits",
      "unit",
      "floor",
      "totalFloors",
      "bathroomCount",
    ];
    if (digitFields.includes(name)) {
      setFormData({ ...formData, [name]: formatNumberWithCommas(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "coolingHeating" | "amenities" | "utilities"
  ) => {
    const { value, checked } = e.target;
    const currentArray = formData[field] as string[];
    if (checked) {
      setFormData({ ...formData, [field]: [...currentArray, value] });
    } else {
      setFormData({
        ...formData,
        [field]: currentArray.filter((item) => item !== value),
      });
    }
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // TODO: Integrate with API (e.g., POST /properties)
  };

  const isResidentialOrAdministrative = [
    "residential",
    "administrative",
  ].includes(formData.propertyType);
  const isCommercial = formData.propertyType === "commercial";
  const isLand = formData.propertyType === "land";
  const isPresale = formData.propertyType === "presale";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg font-morabba">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">نوع ملک</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md">
              <option value="residential">واحد مسکونی</option>
              <option value="commercial">واحد تجاری</option>
              <option value="administrative">واحد اداری</option>
              <option value="land">زمین/خانه کلنگی</option>
              <option value="villa">باغ/ویلا</option>
              <option value="presale">واحد پیش‌فروش</option>
            </select>
          </div>
          <div>
            <label htmlFor="adTitle" className="block text-sm font-medium mb-1">
              عنوان آگهی
            </label>
            <input
              id="adTitle"
              name="adTitle"
              type="text"
              value={formData.adTitle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="عنوان آگهی را وارد کنید"
            />
          </div>
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium mb-1">نوع معامله</label>
          <div className="flex flex-wrap gap-4">
            {[
              { value: "sale", label: "فروش" },
              { value: "rent", label: "رهن و اجاره" },
              { value: "daily_rent", label: "اجاره روزانه" },
              { value: "partnership", label: "مشارکت در ساخت" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center">
                <input
                  type="radio"
                  name="transactionType"
                  value={value}
                  checked={formData.transactionType === value}
                  onChange={handleInputChange}
                  className="ml-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Price Fields */}
        {formData.transactionType === "sale" && (
          <div>
            <label
              htmlFor="totalPrice"
              className="block text-sm font-medium mb-1">
              قیمت کل (تومان)
            </label>
            <input
              id="totalPrice"
              name="totalPrice"
              type="text"
              value={formData.totalPrice || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="مثال: 1,234,567,890"
            />
          </div>
        )}
        {["rent", "daily_rent"].includes(formData.transactionType) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="depositPrice"
                className="block text-sm font-medium mb-1">
                قیمت ودیعه (تومان)
              </label>
              <input
                id="depositPrice"
                name="depositPrice"
                type="text"
                value={formData.depositPrice || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="مثال: 100,000,000"
              />
            </div>
            <div>
              <label
                htmlFor="rentPrice"
                className="block text-sm font-medium mb-1">
                قیمت اجاره (تومان)
              </label>
              <input
                id="rentPrice"
                name="rentPrice"
                type="text"
                value={formData.rentPrice || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="مثال: 5,000,000"
              />
            </div>
          </div>
        )}

        {/* Residential & Administrative Fields */}
        {isResidentialOrAdministrative && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">مشخصات ملک</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="landArea"
                  className="block text-sm font-medium mb-1">
                  متراژ زمین (متر)
                </label>
                <input
                  id="landArea"
                  name="landArea"
                  type="text"
                  value={formData.landArea || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: 200"
                />
              </div>
              <div>
                <label
                  htmlFor="builtArea"
                  className="block text-sm font-medium mb-1">
                  متراژ بنا (متر)
                </label>
                <input
                  id="builtArea"
                  name="builtArea"
                  type="text"
                  value={formData.builtArea || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: 150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  تعداد اتاق
                </label>
                <select
                  name="rooms"
                  value={formData.rooms || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md">
                  <option value="">انتخاب کنید</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="more">بیشتر</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="floor"
                    className="block text-sm font-medium mb-1">
                    طبقه
                  </label>
                  <input
                    id="floor"
                    name="floor"
                    type="text"
                    value={formData.floor || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: 2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="totalFloors"
                    className="block text-sm font-medium mb-1">
                    از
                  </label>
                  <input
                    id="totalFloors"
                    name="totalFloors"
                    type="text"
                    value={formData.totalFloors || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: 5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium mb-1">
                    واحد
                  </label>
                  <input
                    id="unit"
                    name="unit"
                    type="text"
                    value={formData.unit || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: 3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="totalUnits"
                    className="block text-sm font-medium mb-1">
                    از
                  </label>
                  <input
                    id="totalUnits"
                    name="totalUnits"
                    type="text"
                    value={formData.totalUnits || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: 10"
                  />
                </div>
              </div>
              {isPresale ? (
                <div>
                  <label
                    htmlFor="completionDate"
                    className="block text-sm font-medium mb-1">
                    تاریخ تکمیل
                  </label>
                  <input
                    id="completionDate"
                    name="completionDate"
                    type="text"
                    value={formData.completionDate || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: 1405/06/01"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    سال ساخت
                  </label>
                  <select
                    name="buildYear"
                    value={formData.buildYear || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md">
                    <option value="">انتخاب کنید</option>
                    {Array.from(
                      { length: 1405 - 1340 + 1 },
                      (_, i) => 1340 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                وضعیت سند
              </label>
              <select
                name="deedStatus"
                value={formData.deedStatus || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
                <option value="">انتخاب کنید</option>
                <option value="single_leaf">سند تک‌برگ</option>
                <option value="six_dang">6 دانگ</option>
                <option value="qowlname">قولنامه</option>
                <option value="proxy">وکالتی</option>
                <option value="waqf">وقفی</option>
                <option value="transferring">در حال انتقال</option>
                <option value="sarqofl">سرقفلی</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  جهت ملک
                </label>
                <select
                  name="propertyDirection"
                  value={formData.propertyDirection || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md">
                  <option value="">انتخاب کنید</option>
                  <option value="north">شمالی</option>
                  <option value="south">جنوبی</option>
                  <option value="east">شرقی</option>
                  <option value="west">غربی</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  جهت واحد
                </label>
                <select
                  name="unitDirection"
                  value={formData.unitDirection || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md">
                  <option value="">انتخاب کنید</option>
                  <option value="north">شمالی</option>
                  <option value="south">جنوبی</option>
                  <option value="east">شرقی</option>
                  <option value="west">غربی</option>
                  <option value="middle">میانی</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  تعداد نبش
                </label>
                <select
                  name="corners"
                  value={formData.corners || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md">
                  <option value="">انتخاب کنید</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">دید ملک</label>
              <select
                name="view"
                value={formData.view || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
                <option value="">انتخاب کنید</option>
                <option value="street">خیابان</option>
                <option value="alley">کوچه</option>
                <option value="garden">باغ/ویو ابد</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">کف‌پوش</label>
              <select
                name="flooring"
                value={formData.flooring || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
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
                <label className="block text-sm font-medium mb-1">
                  آشپزخانه
                </label>
                <select
                  name="kitchen"
                  value={formData.kitchen || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md">
                  <option value="">انتخاب کنید</option>
                  <option value="open">اپن</option>
                  <option value="island">جزیره</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">کابینت</label>
                <select
                  name="cabinets"
                  value={formData.cabinets || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md">
                  <option value="">انتخاب کنید</option>
                  <option value="mdf">ام دی اف</option>
                  <option value="wood">چوب</option>
                  <option value="metal">فلزی</option>
                  <option value="highgloss">هایگلاس</option>
                  <option value="vacuum">وکیوم</option>
                  <option value="membrane">ممبران</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">کمد</label>
              <select
                name="closet"
                value={formData.closet || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
                <option value="">انتخاب کنید</option>
                <option value="mdf">ام دی اف</option>
                <option value="wood">چوب</option>
                <option value="metal">فلزی</option>
                <option value="highgloss">هایگلاس</option>
                <option value="vacuum">وکیوم</option>
                <option value="membrane">ممبران</option>
                <option value="none">ندارد</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">سرویس بهداشتی</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: "iranian", label: "ایرانی" },
                  { value: "western", label: "فرنگی" },
                  { value: "both", label: "هر دو" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="bathroomType"
                      value={value}
                      checked={formData.bathroomType === value}
                      onChange={handleInputChange}
                      className="ml-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div>
                <label
                  htmlFor="bathroomCount"
                  className="block text-sm font-medium mb-1">
                  تعداد سرویس بهداشتی
                </label>
                <input
                  id="bathroomCount"
                  name="bathroomCount"
                  type="text"
                  value={formData.bathroomCount || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: 2"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasBathtub"
                    checked={formData.hasBathtub || false}
                    onChange={handleBooleanChange}
                    className="ml-2"
                  />
                  وان
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasJacuzzi"
                    checked={formData.hasJacuzzi || false}
                    onChange={handleBooleanChange}
                    className="ml-2"
                  />
                  جکوزی
                </label>
              </div>
            </div>

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
                      checked={formData.coolingHeating.includes(value as any)}
                      onChange={(e) =>
                        handleCheckboxChange(e, "coolingHeating")
                      }
                      className="ml-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">امکانات</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {amenitiesOptions.map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={value}
                      checked={formData.amenities.includes(value as any)}
                      onChange={(e) => handleCheckboxChange(e, "amenities")}
                      className="ml-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Commercial Fields */}
        {isCommercial && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">مشخصات واحد تجاری</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="shopFloorArea"
                  className="block text-sm font-medium mb-1">
                  متراژ کف مغازه (متر)
                </label>
                <input
                  id="shopFloorArea"
                  name="shopFloorArea"
                  type="text"
                  value={formData.shopFloorArea || ""}
                  onChange={handleInputChange}
                  className="w-full text-right p-2 border rounded-md"
                  placeholder="مثال: 50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="floor"
                    className="block text-sm font-medium mb-1">
                    طبقه
                  </label>
                  <input
                    id="floor"
                    name="floor"
                    type="text"
                    value={formData.floor || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: 2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="totalFloors"
                    className="block text-sm font-medium mb-1">
                    از
                  </label>
                  <input
                    id="totalFloors"
                    name="totalFloors"
                    type="text"
                    value={formData.totalFloors || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: 3"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                وضعیت سند
              </label>
              <select
                name="deedStatus"
                value={formData.deedStatus || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
                <option value="">انتخاب کنید</option>
                <option value="single_leaf">سند تک‌برگ</option>
                <option value="six_dang">6 دانگ</option>
                <option value="qowlname">قولنامه</option>
                <option value="proxy">وکالتی</option>
                <option value="waqf">وقفی</option>
                <option value="transferring">در حال انتقال</option>
                <option value="sarqofl">سرقفلی</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                تعداد نبش
              </label>
              <select
                name="corners"
                value={formData.corners || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
                <option value="">انتخاب کنید</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ورودی</label>
              <select
                name="entrance"
                value={formData.entrance || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
                <option value="">انتخاب کنید</option>
                <option value="electric_shutter">کرکره برقی</option>
                <option value="manual_shutter">کرکره دستی</option>
                <option value="glass">شیشه‌ای</option>
                <option value="metal">فلزی</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">کف‌پوش</label>
              <select
                name="flooring"
                value={formData.flooring || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md">
                <option value="">انتخاب کنید</option>
                <option value="ceramic">سرامیک</option>
                <option value="parquet">پارکت</option>
                <option value="stone">سنگ</option>
                <option value="mosaic">موزاییک</option>
                <option value="cement">سیمان</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">سرویس بهداشتی</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: "iranian", label: "ایرانی" },
                  { value: "western", label: "فرنگی" },
                  { value: "both", label: "هر دو" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="bathroomType"
                      value={value}
                      checked={formData.bathroomType === value}
                      onChange={handleInputChange}
                      className="ml-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div>
                <label
                  htmlFor="bathroomCount"
                  className="block text-sm font-medium mb-1">
                  تعداد سرویس
                </label>
                <input
                  id="bathroomCount"
                  name="bathroomCount"
                  type="text"
                  value={formData.bathroomCount || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: 1"
                />
              </div>
            </div>

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
                      checked={formData.coolingHeating.includes(value as any)}
                      onChange={(e) =>
                        handleCheckboxChange(e, "coolingHeating")
                      }
                      className="ml-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">امکانات</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {commercialAmenitiesOptions.map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={value}
                      checked={formData.amenities.includes(value as any)}
                      onChange={(e) => handleCheckboxChange(e, "amenities")}
                      className="ml-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div>
                {formData.amenities.includes("balcony") && (
                  <div>
                    <label
                      htmlFor="balconyArea"
                      className="block text-sm font-medium mb-1">
                      متراژ بالکن (متر)
                    </label>
                    <input
                      id="balconyArea"
                      name="balconyArea"
                      type="text"
                      value={formData.balconyArea || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="مثال: 10"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">امتیازات</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {formData.utilities.includes("water") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="water"
                      checked={formData.utilities.includes("water")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    آب
                  </label>
                )}
                {formData.utilities.includes("electricity") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="electricity"
                      checked={formData.utilities.includes("electricity")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    برق
                  </label>
                )}
                {formData.utilities.includes("gas") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="gas"
                      checked={formData.utilities.includes("gas")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    گاز
                  </label>
                )}
                {formData.utilities.includes("phone") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="phone"
                      checked={formData.utilities.includes("phone")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    تلفن
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Land Fields */}
        {isLand && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">پصات زمین</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="landArea"
                  className="block text-sm font-medium mb-1">
                  متراژ زمین (متر)
                </label>
                <input
                  id="landArea"
                  name="landArea"
                  type="text"
                  value={formData.landArea || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: 1000"
                />
              </div>
              <div>
                <label
                  htmlFor="landWidth"
                  className="block text-sm font-medium mb-1">
                  متراژ بر (متر)
                </label>
                <input
                  id="landWidth"
                  name="landWidth"
                  type="text"
                  value={formData.landWidth || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: 20"
                />
              </div>
              <div>
                <label
                  htmlFor="landUse"
                  className="block text-sm font-medium mb-1">
                  کاربری
                </label>
                <input
                  id="landUse"
                  name="landUse"
                  type="text"
                  value={formData.landUse || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="مثال: مسکونی"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  راه جدا
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasSeparateRoad"
                      checked={formData.hasSeparateRoad || false}
                      onChange={handleBooleanChange}
                      className="ml-2"
                    />
                    دارد
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">امکانات</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {formData.utilities.includes("water") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="water"
                      checked={formData.utilities.includes("water")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    آب
                  </label>
                )}
                {formData.utilities.includes("electricity") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="electricity"
                      checked={formData.utilities.includes("electricity")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    برق
                  </label>
                )}
                {formData.utilities.includes("gas") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="gas"
                      checked={formData.utilities.includes("gas")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    گاز
                  </label>
                )}
                {formData.utilities.includes("phone") && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="phone"
                      checked={formData.utilities.includes("phone")}
                      onChange={(e) => handleCheckboxChange(e, "utilities")}
                      className="ml-2"
                    />
                    تلفن
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* map */}
        <MapComponent
          mapSelection={mapSelection}
          setMapSelection={setMapSelection}
        />
        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
          ثبت آگهی
        </button>
      </form>
    </div>
  );
}
