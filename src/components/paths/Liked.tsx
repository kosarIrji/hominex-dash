import React from "react";
import LikedProperty from "../UI/LikedProperty";
import { BiLike } from "react-icons/bi";

export default function Liked() {
  // sample data
  const likedProps = [
    {
      id: 1,
      name: "آپارتمان لوکس در زعفرانیه",
      image: "/images/property1.jpg",
      views: 153,
      url: "/properties/1",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
    {
      id: 2,
      name: "ویلای مدرن در لواسان",
      image: "/images/property2.jpg",
      views: 89,
      url: "/properties/2",
    },
  ];

  return (
    <div dir="rtl" className="m-3">
      <div className="flex flex-row items-center justify-between">
        <span className="font-bold text-xl text-gray-600 flex flex-row-reverse justify-center items-center">
          آگهی مورد علاقه <BiLike className="w-5 h-5 mx-2" />
        </span>
      </div>
      <LikedProperty
        likedProperties={likedProps}
        onRemove={(id) => {
          // handle removal logic
          console.log("Remove property with ID:", id);
        }}
      />
    </div>
  );
}
