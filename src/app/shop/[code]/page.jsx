"use client";

import React, { useState, useEffect } from "react";
import { getProductByCode, getRelatedProductsByCategoryTitle } from "@/sanity/schemaTypes/queries";
import Image from "next/image";
import { useCart } from "@/app/Context/CartProvider";
import Link from "next/link";

const ProductPage = ({ params: paramsPromise }) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([])
  const [params, setParams] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Use React.use() to unwrap the params Promise
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    };
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (params?.code) {
        const data = await getProductByCode(params.code); // Fetch product by code
        setProduct(data);

        // Fetch related products after main product is fetched
        if (data.category?.title) {
          const related = await getRelatedProductsByCategoryTitle(data.category.title, data.code);
          setRelatedProducts(related);
        }

        const related = await getRelatedProductsByCategoryTitle(data.category.title, data.code);
        setRelatedProducts(related);

      }
      
    };

    

    fetchProduct();
  }, [params]);

  
  
  


  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (!params) {
    return <p>Loading parameters...</p>;
  }

  if (!product) {
    return <p>Loading product...</p>;
  }

  const isSizeAvailable = (size) => product.sizes?.includes(size);
  const isColorAvailable = (color) => product.colors?.includes(color);

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href; // Get the current page URL
      await navigator.clipboard.writeText(currentUrl); // Copy the URL to clipboard
      alert("Link copied to clipboard!"); // Notify the user
    } catch (error) {
      console.error("Failed to copy the link: ", error);
      alert("Failed to copy the link. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-10 pt-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-center">
        {/* Product Image */}
        <div className="p-0">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={500}
            height={500}
            className="rounded border shadow-2xl"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <p className="text-gray-600 my-4">{product.description}</p>
          <p className="text-gray-600 my-4">{product.comments}</p>
          <p className="text-gray-600 my-4 font-semibold">Category: {product.category.title}</p>
          <p className="text-xl font-bold text-indigo-600">GH¢ {product.price}</p>
          
          <div className="md:flex items-end gap-8">
            {/* Size Selector */}
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-600">Size</p>
              <div className="flex gap-2">
                {["L", "XL", "2XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => isSizeAvailable(size) && setSelectedSize(size)}
                    disabled={!isSizeAvailable(size)}
                    className={`px-4 py-2 rounded border font-semibold ${
                      isSizeAvailable(size)
                        ? "border-indigo-600 text-indigo-600 bg-transparent"
                        : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                    } ${selectedSize === size ? "bg-indigo-600 text-white" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-2">
              <p className="text-lg font-medium text-gray-600">Color</p>
              <div className="flex gap-2">
                {["red", "blue", "green"].map((color) => (
                  <button
                    key={color}
                    onClick={() => isColorAvailable(color) && setSelectedColor(color)}
                    disabled={!isColorAvailable(color)}
                    className={`px-5 py-5 rounded ${
                      isColorAvailable(color)
                        ? `${color === "red" ? "bg-red-600" : ""} ${
                            color === "blue" ? "bg-blue-600" : ""
                          } ${color === "green" ? "bg-green-600" : ""}`
                        : "bg-gray-100 cursor-not-allowed"
                    } ${selectedColor === color ? "ring-2 ring-indigo-600" : ""}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
          

          {/* Quantity and Actions */}
          <div className="flex items-center justify-center md:justify-start mt-4 gap-4">
            <div className="flex items-center border border-indigo-600 rounded overflow-hidden">
              <button
                className="px-4 py-2 hover:bg-indigo-600 hover:text-white border-r text-lg font-bold text-indigo-600"
                onClick={() => handleQuantityChange("decrease")}
              >
                -
              </button>
              <div className="px-4 py-2 text-lg text-indigo-600 font-bold">{quantity}</div>
              <button
                className="px-4 py-2 hover:bg-indigo-600 hover:text-white border-l text-lg font-bold text-indigo-600"
                onClick={() => handleQuantityChange("increase")}
              >
                +
              </button>
            </div>
            <button
              className="bg-indigo-600 text-white px-4 sm:px-2 lg:px-4 py-2 rounded hidden md:block"
              // disabled={!selectedSize || !selectedColor}
              onClick={() =>                
                addToCart(product.code, quantity)
              }
            >
              Add to Cart
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded" onClick={handleCopyLink}>
              Share
            </button>
          </div>
          <button
            className="bg-indigo-600 text-white px-24 w-full lg:px-4 py-2 rounded block md:hidden mt-2"
            // disabled={!selectedSize || !selectedColor}
            onClick={() =>                
              addToCart(product.code, quantity)
            }
          >
            Add to Cart
          </button>
          <Link href="/Checkout">
            <button className="w-full md:w-auto md:px-36 bg-indigo-600 text-white py-2 rounded mt-2 md:mt-4">
              Checkout            
            </button>
          </Link>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-20">
        <h2 className="text-3xl font-semibold">Related Products</h2>
        <p className="text-lg font-medium text-gray-600">Discover more books like &apos;{product.title}&apos; </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {relatedProducts.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="border p-4 rounded-lg">
                <Image
                  src={relatedProduct.imageUrl}
                  alt={relatedProduct.title}
                  width={250}
                  height={250}
                  className="rounded"
                />
                <h3 className="mt-4 text-lg font-semibold">{relatedProduct.title}</h3>
                <p className="text-gray-600">{relatedProduct.description.slice(0, 100)}...</p>
                <div className="flex flex-wrap items-center justify-between">
                  <p className="text-xl font-bold text-indigo-600 mt-2">GH¢ {relatedProduct.price}</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded">
                    <Link href={`/shop/${relatedProduct.code}`}>
                      View Product
                    </Link>
                  </button>                  
                </div>
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
