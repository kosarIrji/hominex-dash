/* eslint-disable */
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link"; // assuming you're using Next.js
import { url_v1 } from "@/config/urls";
import { useSession } from "next-auth/react";
import { errorToast, successToast } from "@/config/Toasts";
type Property = {
  id: number;
  name: string;
  image: string;
  views: number;
  url: string;
};

interface Props {
  likedProperties: Property[];
  setUpdate: any;
}

export default function LikedProperty({ likedProperties, setUpdate }: Props) {
  const session = useSession();

  if (likedProperties.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        هیچ ملکی به علاقه‌مندی‌ها اضافه نشده است.
      </div>
    );
  }

  const handleRemove = async (id: number) => {
    try {
      const _personal = await fetch(url_v1(`/user/favorites/${id}`), {
        method: "DELETE", // ✅ method here
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.user?.access_token}`, // ✅ custom auth header
        },
      });

      const { message } = await _personal.json();
      successToast(message);
      setUpdate(true);
    } catch (e) {
      errorToast(e);
    }
  };

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
              <div className=" w-full inset-0 bg-gradient-to-t from-black via-black/50 h-1/3 to-transparent backdrop-blur-sm p-4 flex flex-col justify-end text-white">
                <div className="relative flex flex-row-reverse justify-between items-center">
                  <div className="text-end flex flex-col gap-1">
                    <Link href={property.url}>
                      <h3 className="text-[15px] font-semibold">
                        {property.name}
                      </h3>
                    </Link>
                    <p className="text-sm">بازدید: {property.views} 👁️ </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemove(property.id)}
              className="absolute top-3 left-3 bg-black/80 backdrop-blur-2xl rounded-lg  p-2 text-white hover:text-red-400 transition cursor-pointer">
              <FaRegTrashAlt size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
