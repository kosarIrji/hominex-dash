import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link"; // assuming you're using Next.js

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
  const handleRemove = (id: number) => {
    onRemove(id);
  };

  if (likedProperties.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        هیچ ملکی به علاقه‌مندی‌ها اضافه نشده است.
      </div>
    );
  }

  return (
    <div className="p-4" dir="ltr">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-3">
        {likedProperties.map((property, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden relative group transition-all shadow-md">
            <div
              className="aspect-[4/3] bg-cover bg-center flex content-end"
              style={{
                backgroundImage: `url(https://cdn.nody.ir/files/2021/09/21/nody-%D8%B9%DA%A9%D8%B3-%D8%AE%D8%A7%D9%86%D9%87-%D8%AA%DB%8C%D9%85%DB%8C-%D8%B2%D8%B9%D9%81%D8%B1%D8%A7%D9%86%DB%8C%D9%87-1632176841.jpg)`,
              }}>
              <div className=" w-full inset-0 bg-gradient-to-t from-black via-black/40 h-1/3 to-transparent backdrop-blur-sm p-4 flex flex-col justify-end text-white">
                <div className="flex flex-row-reverse justify-between items-center">
                  <div className="text-end flex flex-col gap-1">
                    <Link href={property.url}>
                      <h3 className="text-lg font-semibold">{property.name}</h3>
                    </Link>
                    <p className="text-sm">بازدید: {property.views} 👁️ </p>
                  </div>
                  <button
                    onClick={() => handleRemove(property.id)}
                    className="hover:text-red-400 transition cursor-pointer">
                    <FaRegTrashAlt size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
