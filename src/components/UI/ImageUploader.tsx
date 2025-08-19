"use client";
import { useState } from "react";
import { X } from "lucide-react"; // using lucide-react icons (shadcn uses it too)
import Image from "next/image";
export default function ImageUploader() {
  const [images, setImages] = useState<string[]>([]);

  const onSelectedImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const imageUrls = filesArray.map((file) => URL.createObjectURL(file));

    // ✅ Append new images instead of replacing
    setImages((prev) => [...prev, ...imageUrls]);

    // ⚠️ Don’t revoke URLs immediately or the preview will break
    // Instead, revoke when deleting or on unmount
  };

  const removeImage = (src: string) => {
    setImages((prev) => prev.filter((img) => img !== src));
    URL.revokeObjectURL(src); // cleanup memory
  };

  return (
    <div className="mb-10">
      <label
        htmlFor="land-images"
        className="w-full h-40 mb-5 border cursor-pointer border-dashed text-gray-500 border-gray-500 rounded-sm flex justify-center items-center">
        بارگذاری تصاویر
      </label>

      <input
        type="file"
        id="land-images"
        accept="image/*"
        multiple
        onChange={onSelectedImages}
        className="hidden"
      />

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {images.map((src, idx) => (
          <div key={idx} className="w-32 h-32 relative group">
            <Image
              width={100}
              height={100}
              src={src}
              alt={`preview ${idx}`}
              className="w-full h-full object-cover rounded-lg shadow"
            />
            {/* Delete button */}
            <button
              type="button"
              onClick={() => removeImage(src)}
              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
