"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/images/logo/18.png";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";

import {Lora, Poppins, Stoke} from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400',], // Add desired font weights
});

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`${poppins.className} flex items-center justify-between bg-[white] text-black py-2 px-5 sm:px-10 fixed top-0 left-0 w-full z-50 shadow-md font-poppins`}>
      {/* Logo */}
      <div className="flex items-end space-x-1 ml-1 sm:ml-4">
        <Link href="/">
          <Image src={logo} alt="Store Logo" width={70} height={70} priority />
        </Link>
      </div>

      {/* Hamburger Menu for Smaller Screens */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-black">
          {menuOpen ? <HiX size={35} /> : <HiMenuAlt3 size={35} />}
        </button>
      </div>

      {/* Navigation Links and Search Bar */}
      <nav
        className={`${
          menuOpen ? "block" : "hidden"
        } absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent z-40 md:flex items-center space-y-4 md:space-y-0 md:space-x-8 py-4 md:py-0 px-10 md:px-0 shadow-md md:shadow-none fontbold`}
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
        <div className="flex items-center justify-between md:hidden  bg-transparent  font-poppins gap-6">
            <div className="border border-gray-500 p-2 rounded-md flex items-center w-full justify-between bg-transparent ">
                <input
                    type="text"
                    placeholder="Search for products"
                    className="bg-transparent text-gray-700 outline-none placeholder-gray-500 w-full"
                />
                <button className="text-gray-500">
                    <FaSearch />
                </button>
            </div>
            <Link href="/cart" className="border border-gray-500 p-2 rounded-md">
                <FaShoppingCart className="text-gray-500" size={24} />
            </Link>
        </div>
      </nav>

      <div className="hidden items-center justify-between md:flex  bg-transparent  font-poppins gap-6 space-x-5">
            <div className="border border-gray-500 p-2 rounded-md flex items-center w-full space-x-10 justify-between bg-transparent ">
                <input
                    type="text"
                    placeholder="Search for products"
                    className="bg-transparent text-gray-700 outline-none placeholder-gray-500 w-full"
                />
                <button className="text-gray-500">
                    <FaSearch />
                </button>
            </div>
        </div>

      {/* Cart for Desktop */}
      <div className="hidden md:flex items-center text-indigo-600 gap-2">
      <Link href="/account" className="border border-gray-500 p-2 rounded-md">
          <MdAccountCircle size={30} />
        </Link>
        <Link href="/cart" className="border border-gray-500 p-2 rounded-md">
          <FaShoppingCart size={28} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
