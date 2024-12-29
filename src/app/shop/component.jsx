'use client';
import ProductToolbar from "@/components/ProductsToolbar";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { getProducts } from "@/sanity/schemaTypes/queries";
import { FaShareAlt, FaEye } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import Image from "next/image";
import { useCart } from "@/app/Context/CartProvider";
import Link from "next/link";
import { useSearch } from "@/app/Context/SearchContext"; // Import SearchContext
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"; 
import { ToastContainer, toast } from 'react-toastify';
import { isArray } from "sanity";

const ShopComponent = () => {
  const { searchQuery } = useSearch(); // Access the global search query
  const [products, setProducts] = useState([]); // All products
  const [loading, setLoading] = useState(true); // Loading state for skeleton
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [displayProducts, setDisplayProducts] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const notify = () => toast.info("Item added to your cart! Click the cart icon in the header to view.");
  const [isCartUpdated, setIsCartUpdated] = useState(false);

  const { addToCart } = useCart();
  const category = searchParams.get("category");

  const cartFunctionality = (product) => {
    addToCart(product.code)
    notify()
    setIsCartUpdated(true);
    // Reset animation state after 1 second (match animation duration in CSS)
    setTimeout(() => setIsCartUpdated(false), 1000);
  }

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

  // Fetch all products when the component mounts
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts(); // Avoid shadowing state
        console.log("Fetched products:", data);
        setProducts(data);
        if (Array.isArray(data)) {
          console.log("fetchedProducts is an array:");
        }
        console.log("products:", data);
        if (Array.isArray(data)) {
          console.log("Products is an array 1:", data);
        }
        setFilteredProducts(data); // Initialize filtered products
        setDisplayProducts(data?.slice(0, resultsPerPage)); // Paginate products
        setLoading(false); // Mark as loaded
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [resultsPerPage]);
  

  // Filter products based on the search query
  useEffect(() => {
    console.log("products 23:", products);
    if (!Array.isArray(products)) {
      console.log("Products is not an array 23:", products);
    }
    const searchResults = products.filter((product) =>
      product?.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
    setFilteredProducts(searchResults);
    setCurrentPage(1); // Reset to the first page after a new search
  }, [searchQuery, products]);
  

  useEffect(() => {
    if (category) {
      const filteredByCategory = products?.filter(
        (product) => product?.category?.title.toLowerCase() === category?.toLowerCase()
      );
      setFilteredProducts(filteredByCategory); // Set filtered products to the filtered category products
    } else {
      setFilteredProducts(products); // No category selected, show all products
    }
  }, [category, products]);

  // Update the displayed products based on pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setDisplayProducts(filteredProducts?.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, resultsPerPage]);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };

  return (
    <section className="pt-20 pb-10 min-h-screen">
      {/* Pass the filter function to ProductToolbar */}
      
      <ProductToolbar
        onFilter={(category) => setFilteredProducts(products?.filter((product) => product?.category?.title === category))}
        filteredProductsCount={filteredProducts?.length}
        products={products}
        setProducts={setProducts}
        setResultsPerPage={setResultsPerPage}
        resultsPerPage={resultsPerPage}
        currentPage={currentPage}
      />
      <ToastContainer className="top-24"/>
      <div className="pt-24 px-10">
        {/* Show Skeleton Loader if the data is still loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative group bg-white border rounded-lg shadow-lg overflow-hidden transition hover:shadow-lg">
                <Skeleton className="h-56 w-full mb-4" />
                <div className="p-4 border-t">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-32 mb-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-xl text-gray-600 pt-24">
            No products found for <span className="text-indigo-600">&quot;{searchQuery}&quot;.</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div key={product.code} className="relative group bg-white border rounded-lg shadow-lg overflow-hidden transition hover:shadow-lg" data-aos="zoom-in" data-aos-duration="500">
                <div className="relative">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    layout="responsive"
                    objectFit="cover"
                    width={400}
                    height={224}
                    className="w-full h-56 object-cover"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                  {product.isNew && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      New
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity h-[100%] w-[100%] top-[0%] left-[0%]">
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <button className="px-3 py-2 bg-white text-gray-800 text-2xl rounded shadow-md hover:bg-gray-100 mx-1" onClick={handleCopyLink}>
                        <FaShareAlt />
                      </button>
                      <button className="px-3 py-2 bg-white text-gray-800 text-2xl rounded shadow-md hover:bg-gray-100 mx-1">
                        <Link href={`/shop/${product.code}`}>
                          <FaEye />
                        </Link>
                      </button>
                      <button className="px-3 py-2 bg-white text-gray-800 text-2xl rounded shadow-md hover:bg-gray-100 mx-1">
                        <AiOutlineLike />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discountedPrice ? (
                        <>
                          <p className="text-lg font-bold text-red-600">{product.discountedPrice}</p>
                          <p className="text-sm line-through text-gray-500">{product.price}</p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-800">GH¢ {product.price}</p>
                      )}
                    </div>
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-blue-600"
                      onClick={() => cartFunctionality(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination filteredProducts={filteredProducts} itemsPerPage={resultsPerPage} onPageChange={handlePageChange} />
    </section>
  );
};

export default ShopComponent;
