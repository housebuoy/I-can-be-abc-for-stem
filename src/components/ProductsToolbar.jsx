'use client';
import { useState, useEffect, useRef } from "react";
import { FiFilter } from "react-icons/fi";
import { IoSettings, IoCloseSharp } from "react-icons/io5";
import { BiSort } from "react-icons/bi";
import { getCategories } from "../sanity/schemaTypes/queries";
import { getProducts } from "../sanity/schemaTypes/queries";
import { client } from "../sanity/lib/client";


const ProductToolbar = ({ products, setProducts, onFilter, filteredProductsCount, resultsPerPage, setResultsPerPage  }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropBarOpen, setIsDropBarOpen] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const toggleDropBar = () => {
    setIsDropBarOpen((prev) => !prev);
  };

  const toggleToolbar = () => {
    setIsToolbarOpen((prev) => !prev);
  };
  
  const handleResultsChange = (e) => setResultsPerPage(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    onFilter(category); // Notify parent to filter products
  };

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts(sortOption);
      setProducts(data);
    }
    fetchProducts();
  }, [sortOption]); // Fetch products on sortOption change

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories(client);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);


  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <section className="pt-2">
      <div className="fixed z-10 w-full">
        <div className="sm:hidden flex flex-wrap items-center justify-between bg-gray-100 py-2 px-4 rounded-md shadow-sm  w-full z-10">
          <button
            className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 border rounded-lg hover:bg-gray-200"
            onClick={toggleToolbar}
          >
            <IoSettings className="text-xl" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <div className="text-gray-700">
            Showing <b>1-{resultsPerPage}</b> of <b>{filteredProductsCount}</b> results
          </div>
        </div>
        {isToolbarOpen && (
        <div className="sm:hidden flex flex-wrap items-center justify-between bg-gray-100 py-2 px-4 rounded-md shadow-sm z-10 w-full">
          <button
            className="flex items-center gap-2 px-2 py-3 bg-white text-gray-700 border rounded-lg hover:bg-gray-200"
            onClick={toggleDropBar}
          >
            {
              !isDropBarOpen 
                ? 
              <FiFilter className="text-xl" />
                : 
              <IoCloseSharp className="text-xl" />
            }
          </button>
          <button
            className="flex items-center gap-2 px-2 py-2 bg-white text-gray-700 border rounded-lg"
          >
            <BiSort className="text-lg" />
            <select
              id="sortOption"
              className="border rounded-lg px-2 py-1 bg-white text-gray-700 outline-none border-none"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Default</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="bestSelling">Best Selling</option>
            </select>
          </button>
          <div className="flex flex-col md:flex-row items-center space-x-2">
            <label htmlFor="resultsPerPage" className="text-gray-700">
              Show
            </label>
            <select
              id="resultsPerPage"
              className="border rounded-lg px-2 py-1 bg-white text-gray-700"
              value={resultsPerPage}
              onChange={handleResultsChange}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
            </select>
          </div>
          {/* Dropdown Menu */}
          {isDropBarOpen && (
            <div
              ref={dropdownRef}
              className="absolute left-0 top-28 z-10 mt-2 w-48 bg-white border rounded-lg shadow-lg"
            >
              <ul className="py-2">
                <li
                  key="all"
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCategorySelect(null)}
                >
                  All Categories
                </li>
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category.title)}
                  >
                    {category.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>)}
      </div> 


      <div className="sm:flex flex-wrap items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm fixed z-10 w-full hidden">
        {/* Filter and View Toggle */}
        <div className="flex items-center space-x-4">
          {/* Filter Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border rounded-lg hover:bg-gray-200"
            onClick={toggleDropdown}
          >
            <FiFilter className="text-xl" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute left-0 top-14 z-10 mt-2 w-48 bg-white border rounded-lg shadow-lg"
            >
              <ul className="py-2">
                <li
                  key="all"
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCategorySelect(null)}
                >
                  All Categories
                </li>
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category.title)}
                  >
                    {category.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pagination Info */}
        <div className="text-gray-700">
          Showing <b>1-{resultsPerPage}</b> of <b>{filteredProductsCount}</b> results
        </div>



        {/* Results per Page and Sort Options */}
        <div className="flex items-center space-x-4">
          {/* Results Per Page */}
          <div className="flex flex-col md:flex-row items-center space-x-2">
            <label htmlFor="resultsPerPage" className="text-gray-700">
              Show
            </label>
            <select
              id="resultsPerPage"
              className="border rounded-lg px-2 py-1 bg-white text-gray-700"
              value={resultsPerPage}
              onChange={handleResultsChange}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col md:flex-row md:items-center space-x-2">
            <label htmlFor="sortOption" className="text-gray-700">
              Sort by
            </label>
            <select
              id="sortOption"
              className="border rounded-lg px-2 py-1 bg-white text-gray-700"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Default</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="bestSelling">Best Selling</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductToolbar;
