"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AccountDropdown from "@/components/AccountDropdown";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";
import { useCart } from "@/app/Context/CartProvider";
import { auth } from "../../firebase";
import { useSearch } from "@/app/Context/SearchContext";
import {Lora, Poppins, Stoke} from 'next/font/google'
import ShoppingCart from "./ShoppingCart";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400',], // Add desired font weights
});

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems, removeFromCart, isCartUpdated } = useCart();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    console.log(localSearch) // Update the global search query
  };

  const handleSearch = () => {
    console.log("handleSearchSubmit")
  }
  

  useEffect(() => {
    // Listen to Firebase Auth changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSideMenuOpen = () => {
    setSideMenuOpen(!sideMenuOpen)
  }

  isCartUpdated && console.log("hey why should we wait")

  return (
    <header className={`${poppins.className} flex items-center justify-between bg-[white] text-black py-2 px-5 sm:px-10 fixed top-0 left-0 w-full z-50 shadow-md font-poppins`}>
      {/* Logo */}
      <div className="flex items-end space-x-1 ml-1 sm:ml-4">
        <Link href="/">
          <Image src="/images/logo/18.png" alt="Store Logo" width={70} height={70} priority />
        </Link>
      </div>

      {/* Hamburger Menu for Smaller Screens */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className={`relative p-1 rounded-sm border-2 border-transparent transition-all duration-300
            ${isCartUpdated ? "animate-border-gradient" : "border-gray-300"}
          `}
        >
          <span
            className={`
              absolute inset-0 rounded-sm p-[1px] 
              bg-gradient-to-r from-purple-500 to-indigo-500 
              ${isCartUpdated ? "opacity-100" : "opacity-0"} transition-opacity duration-300
            `}
          ></span>
          <span className="relative flex items-center justify-center bg-white rounded-sm z-10">
            {menuOpen ? <HiX size={35} /> : <HiMenuAlt3 size={35} />}
          </span>
        </button>
      </div>





      {/* Navigation Links and Search Bar */}
      <nav
        className={`${
          menuOpen ? "block" : "hidden"
        } absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent z-40 md:flex items-center space-y-4 md:space-y-0 md:space-x-8 py-4 md:py-0 px-5 md:px-0 shadow-md md:shadow-none fontbold`}
      >
        <Link href="/" className="block md:inline hover:underline font-poppins">
          Home
        </Link>
        <Link href="/shop" className="block md:inline hover:underline">
          Shop
        </Link>
        <Link href="/contact" className="block md:inline hover:underline">
          Contact
        </Link>

        {/* Search Bar and Cart for Mobile */}
        <div className="flex items-center justify-between md:hidden  bg-transparent  font-poppins gap-2">
            <form onSubmit={handleSearchSubmit} className="border border-gray-500 p-2 rounded-md flex items-center w-full justify-between bg-transparent ">
                <input
                  type="text"
                  placeholder="Search for products"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="bg-transparent text-gray-700 outline-none placeholder-gray-500 w-full"
                />
                <button
                  type="submit"
                  className="text-gray-500 text-lg"
                >
                  <FaSearch />
                </button>
            </form>
            <div className="flex gap-2">
              <div className="relative">
                <button onClick={toggleSideMenuOpen} className="border border-gray-500 p-2 rounded-md">
                  <FaShoppingCart className="text-indigo-600" size={26} />
                </button>
                <p className="absolute -top-1 right-0 bg-indigo-600 text-white rounded-full px-1 text-xs font-bold">{cartItems.length}</p>
              </div>
              <AccountDropdown user={user} size={30} />
            </div>
            
        </div>
      </nav>

      <div className="hidden items-center justify-between md:flex  bg-transparent  font-poppins gap-2 space-x-5">
            <form onSubmit={handleSearchSubmit} className="border border-gray-500 p-2 rounded-md flex items-center w-full space-x-3 justify-between bg-transparent ">
                <input
                    type="text"
                    placeholder="Search for products"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="bg-transparent text-gray-700 outline-none placeholder-gray-500 w-full"
                />
                <button className="text-gray-500" type="submit">
                    <FaSearch />
                </button>
            </form>
        </div>

      {/* Cart for Desktop */}
      <div className="hidden md:flex items-center text-indigo-600 gap-2">
      {/* <Link href="/signup" className="border border-gray-500 p-2 rounded-md">
          <MdAccountCircle size={30} />
        </Link> */}
        <div className="relative">
          <button className="border border-gray-500 py-2 rounded-md px-2 relative" onClick={toggleSideMenuOpen}>
            <FaShoppingCart size={28} />
          </button>
          <p className="absolute -top-1 right-0 bg-indigo-600 text-white rounded-full px-1 text-xs font-bold">{cartItems.length}</p>
        </div>
        <AccountDropdown user={user} size={36}/>
      </div>
      {sideMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40">
          <ShoppingCart onClose={toggleSideMenuOpen} /> {/* Close button handling */}
        </div>
      )}
    </header>
  );
};

export default Header;
