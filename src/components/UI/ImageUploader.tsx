"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { VscCloudUpload } from "react-icons/vsc";

interface ImageUploaderProps {
  onSelectedImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => Promise<void>;
}

export default function ImageUploader({
  onSelectedImages,
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files).slice(0, 20); // Limit to 20 images
    console.log("ImageUploader selected files:", filesArray); // Debug log
    const imageUrls = filesArray.map((file) => URL.createObjectURL(file));

    // Append new images and files
    setImages((prev) => [...prev, ...imageUrls]);
    setSelectedFiles((prev) => [...prev, ...filesArray]);

    // Trigger onSelectedImages to sync with parent
    onSelectedImages(e);
  };

  const removeImage = (src: string) => {
    setImages((prev) => prev.filter((img) => img !== src));
    setSelectedFiles((prev) =>
      prev.filter((_, idx) => URL.createObjectURL(prev[idx]) !== src)
    );
    URL.revokeObjectURL(src); // Cleanup memory
  };

  // Cleanup URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((url) => URL.revokeObjectURL(url));
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
        {images.map((src, idx) => (
          <div key={idx} className="w-32 h-32 relative group">
            <Image
              width={100}
              height={100}
              src={src}
              alt={`preview ${idx}`}
              className="w-full h-full object-cover rounded-lg shadow"
            />
            <button
              type="button"
              onClick={() => removeImage(src)}
              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {selectedFiles.length} تصویر انتخاب شده است (حداکثر ۵ مگابایت برای هر
        تصویر)
      </p>
    </div>
  );
}
