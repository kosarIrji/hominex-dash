"use client";
import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import Image from "next/image";
import { VscCloudUpload } from "react-icons/vsc";

interface ImageUploaderProps {
  onSelectedImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => Promise<void>;
}

export default function ImageUploader({
  onSelectedImages,
}: ImageUploaderProps) {
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files).slice(0, 20); // limit 20
    const newImages = filesArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    // pass event back to parent
    onSelectedImages(e);
  };

  const removeImage = (url: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.url !== url);
      return updated;
    });

    URL.revokeObjectURL(url); // cleanup
  };

  // cleanup when unmounting
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  return (
    <div className="mb-10" dir="rtl">
      <label
        htmlFor="land-images"
        className="w-full h-40 mb-5 flex-col border cursor-pointer border-dashed text-gray-500 border-gray-500 rounded-sm flex justify-center items-center">
        <VscCloudUpload className="w-8 h-8" />
        بارگذاری تصاویر (حداکثر ۲۰ تصویر)
      </label>

      <input
        type="file"
        id="land-images"
        accept="image/*"
        multiple
        onChange={handleImageSelection}
        className="hidden"
      />

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {images.map((img, idx) => (
          <div key={idx} className="w-32 h-32 relative group">
            <Image
              width={100}
              height={100}
              src={img.url}
              alt={`preview ${idx}`}
              className="w-full h-full object-cover rounded-lg shadow"
            />
            <button
              type="button"
              onClick={() => removeImage(img.url)}
              className="absolute top-1 right-1 cursor-pointer bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={() => removeImage(img.url)}
              className="absolute bottom-1 cursor-pointer left-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
              <Star size={16} />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {images.length} تصویر انتخاب شده است (حداکثر ۵ مگابایت برای هر تصویر)
      </p>
    </div>
  );
}
