import React from "react";
import LikedProperty from "../UI/LikedProperty";

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
  ];

  return (
    <LikedProperty
      likedProperties={likedProps}
      onRemove={(id) => {
        // handle removal logic
        console.log("Remove property with ID:", id);
      }}
    />
  );
}
