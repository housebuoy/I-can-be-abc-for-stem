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

const Shop = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState(null); // Selected category
  const [displayProducts, setDisplayProducts] = useState([]); 
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart } = useCart();


  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data); // Initialize filtered products with all products
      setDisplayProducts(data.slice(0, resultsPerPage)); 
    }
    fetchProducts();
  }, [resultsPerPage]);

  useEffect(() => {
    // Apply sorting when sortOption or selectedCategory changes
    const sortAndFilterProducts = () => {
      // Sort the products
      const sortedProducts = [...products].sort((a, b) => {
        switch (sortOption) {
          case "priceLowHigh":
            return a.price - b.price;
          case "priceHighLow":
            return b.price - a.price;
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          default:
            return 0;
        }
      });

      

      // Filter products if a category is selected
      const updatedFilteredProducts = selectedCategory
        ? sortedProducts.filter((product) => product.category?.title === selectedCategory)
        : sortedProducts;

      setFilteredProducts(updatedFilteredProducts); // Update filtered products
    };

    sortAndFilterProducts();
  }, [sortOption, selectedCategory, products]); // Re-run when sortOption, category, or products change

  // Function to filter products based on the selected category
  const handleFilter = (category) => {
    console.log("Selected Category:", category);
  console.log("All Products:", products);
    const filtered =
      category === null
        ? products
        : products.filter((product) => product.category?.title === category);
    setFilteredProducts(filtered);
    console.log("Filtered Products:", filtered);
    setCurrentPage(1);
    setDisplayProducts(filtered.slice(0, resultsPerPage)); // Reset to page 1
  };

  useEffect(() => {
    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
  
    // Update the displayProducts based on the current page
    setDisplayProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, resultsPerPage]); // Re-run when filteredProducts, currentPage, or resultsPerPage changes
  
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };

  return (
    <section className="pt-20 pb-10 min-h-screen">
      {/* Pass the filter function to ProductToolbar */}
      <ProductToolbar 
        onFilter={handleFilter} 
        filteredProductsCount={filteredProducts.length}
        products={products}
        setProducts={setProducts}
        setResultsPerPage={setResultsPerPage}
        resultsPerPage={resultsPerPage}
        sortOption={sortOption}
        setSortOption={setSortOption} // Pass sortOption setter
      />
      <div className="pt-24 px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.code}
              className="relative group bg-white border rounded-lg shadow-lg overflow-hidden transition hover:shadow-lg" data-aos="zoom-in"
            data-aos-duration="500"
            >
              <div className="relative">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  layout="responsive"
                  objectFit="cover"
                  width={400} // specify the width
                  height={224} // specify the height
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
                  <button className="px-3 py-2 bg-white text-gray-800 text-2xl rounded shadow-md hover:bg-gray-100 mx-1">
                    <FaShareAlt />
                  </button>
                  <button className="px-3 py-2 bg-white text-gray-800 text-2xl rounded shadow-md hover:bg-gray-100 mx-1">
                    <Link href={`/shop/${product.code}`} >
                      <FaEye />
                      {/* <a href={`/shop/${product.code}`}></a> */}
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
                <p className="text-sm text-gray-600 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    {product.discountedPrice ? (
                      <>
                        <p className="text-lg font-bold text-red-600">
                          {product.discountedPrice}
                        </p>
                        <p className="text-sm line-through text-gray-500">
                          {product.price}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-gray-800">
                        GH¢ {product.price}
                      </p>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-blue-600" onClick={() => addToCart(product.code)}>
                    Add to Cart
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      <Pagination
        filteredProducts={filteredProducts}
        itemsPerPage={resultsPerPage}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default Shop;
