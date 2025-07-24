import React from "react";

type Property = {
  id: number;
  name: string;
  image: string;
  views: number;
  url: string;
};

interface Props {
  likedProperties: Property[];
  onRemove: (id: number) => void;
}

export default function LikedProperty({ likedProperties, onRemove }: Props) {
  if (likedProperties.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        هیچ ملکی به علاقه‌مندی‌ها اضافه نشده است.
      </div>
    );
  }

  const handleRemove = (id: number) => {
    console.log("Remove property with ID:", id);
    onRemove(id); // Call the parent function
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">لیست علاقه‌مندی‌ها</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {likedProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white shadow rounded-xl overflow-hidden flex flex-col"
            dir="rtl">
            <img
              src={
                "https://cdn.nody.ir/files/2021/09/21/nody-%D8%B9%DA%A9%D8%B3-%D8%AE%D8%A7%D9%86%D9%87-%D8%AA%DB%8C%D9%85%DB%8C-%D8%B2%D8%B9%D9%81%D8%B1%D8%A7%D9%86%DB%8C%D9%87-1632176841.jpg"
              }
              alt={property.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{property.name}</h3>
                <p className="text-gray-500 text-sm">
                  👁️ بازدید: {property.views}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={property.url}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-center py-1 px-3 rounded">
                  مشاهده ملک
                </a>
                <button
                  onClick={() => handleRemove(property.id)}
                  className="bg-red-500 cursor-pointer hover:bg-red-600 text-white py-1 px-3 rounded">
                  حذف از علاقه‌مندی‌ها
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
