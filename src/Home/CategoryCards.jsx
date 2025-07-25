"use client";

import { useEffect, useState } from "react";
import { getCategories } from "../sanity/schemaTypes/queries"; // Ensure this path is correct
import ProductCard from "./ProductCard";
import { BsArrowRightShort } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton"


// Define fallback images
const fallbackImages = {
  "STEAM Books": "/images/ProductImages/ABC.JPG",
  "STEAM Kits": "/images/ProductImages/stemkit.jpg",
  "STEAM Wear": "/images/ProductImages/vest.jpg",
  "STEAM Combo": "/images/ProductImages/logo/photo-collage.png",
};

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        console.log("Fetched Categories:", fetchedCategories); 

        // Map fetched categories and apply fallback images
        const formattedCategories = fetchedCategories.map((category) => ({
          id: category._id,
          category: category.title,
          image: category.imageUrl || fallbackImages[category.title] || null 
        }));

        console.log(formattedCategories.image)

        setCategories(formattedCategories);
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetCategories();
  }, []);

if (loading) return (
    <div className="flex items-center space-x-6 mt-40 md:mt-10 w-[90%] mx-auto 2xl:w-[81%] 2xl:mt-10 pb-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-7 md:gap-y-7 md:gap-x-7 xl:grid-cols-4">
        <div className="w-full">
          <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-full">
          <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-full">
          <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-full">
          <Skeleton className="h-32 w-64 rounded-sm mb-2 bg-gray-200" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
            <Skeleton className="h-6 w-64 bg-gray-200 rounded" />
          </div>
        </div>
        
        
      </div>
      
    </div>

  )
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="relative min-h-screen mt-40 md:mt-10 w-[90%] mx-auto 2xl:w-[81%] 2xl:mt-10 pb-10">
      {/* Header Section */}
      <div className="md:flex md:justify-between md:items-center 2xl:justify-between">
        <h1 className="text-[20px] font-medium text-[#003057] leading-[26px] mb-5 2xl:mb-1 md:mb-1 2xl:text-[30px]">
          Shop by Category
        </h1>
        <div className="flex gap-2 items-center text-xs text-indigo-600 font-semibold tracking-[2px]">
          <Link href="/shop">VIEW ALL PRODUCTS</Link>
          <BsArrowRightShort className="text-[25px]" />
        </div>
      </div>

      {/* Categories Grid */}
      <section className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 gap-y-7 md:gap-y-7 md:gap-x-7 xl:grid-cols-4">
        {categories.map((cat) => (
          <Link href={`/shop?category=${encodeURIComponent(cat.category)}`} key={cat.id || index} >
            <ProductCard
              image={cat.image}
              category={cat.category}
              // key={cat.id}
              className="relative w-full h-[300px] shadow-lg border rounded-md"
            >
              {/* Overlay Content */}
              <div className="flex justify-between items-center absolute bottom-0 right-0 left-0 w-full bg-white px-4">
                <span className="text-[20px] text-gray-600 font-medium md:text-xl lg:text-lg px-2 py-4 rounded-md">
                  {cat.category}
                </span>
                <BsArrowRightShort className="text-[42px] text-indigo-600" />
              </div>
            </ProductCard>
          </Link>
        ))}
      </section>

      {/* Featured Section */}
      <section
        className="mt-24 flex flex-col md:flex-row-reverse justify-between gap-10"
        data-aos="fade-up"
        data-aos-anchor-placement="center-bottom"
      >
        <Image
          src="/images/ProductImages/abcbook.jpg"
          alt="abc-book"
          width={550}
          height={450}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-[#2e3d4a] font-bold md:text-9xl text-7xl sm:text-7xl">
            New <br /> Release
          </h1>
          <p className="text-[#49525a] font-medium text-2xl">
            Designed for curious minds, our STEM books cater to creativity and learning.
          </p>
          <div className="mt-5">
            <p className="text-[#2e3d4a] font-semibold text-md">Featuring in this release</p>
            <ul className="list-image-[url(/bullet/check.png)] pl-5 text-gray-700">
              <li className="mb-2">Reading Book</li>
              <li className="mb-2">Coloring Book</li>
              <li>Copying & Activity Book</li>
            </ul>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-md mt-6 font-semibold hover:bg-gray-700 hover:scale-105 transition-transform duration-300">
              <Link prefetch href="/shop?category=STEAM%20Books">Shop Now</Link>
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default CategoryCards;
