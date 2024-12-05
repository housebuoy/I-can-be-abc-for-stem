"use client"
import Image from "next/image";
import { useEffect} from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {Poppins} from 'next/font/google'
import Link from "next/link";
// import heroimage1 from '../../public/images/heroimages/hero-02.png'
// import heroimage2 from '../../public/images/heroimages/hero-01.png'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], 
});



const HeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1200 }); // Initialize AOS with a duration of 1200ms
  }, []);
  return (
    <>
      <div className={`${poppins.className}bg-white w-full min-h-screen flex flex-col md:flex-row sm:mt-20 sm:pt-16 md:justify-between  md:pr-4 pt-40 sm:24 relative bg-gradient-to-r from-blue-50 to-indigo-50 `}>
        <div className="pl-6 sm:pl-10 lg:pl-14" data-aos="fade-right">
          <h1 className={`${poppins.className} animate-fadeIn font-medium text-[#2e3d4a] text-7xl tracking-tight sm:text-8xl leading-[1em]`}>
            Your <br />
            Ultimate <br />
            Stop to <br /> 
            <span className="text-red-600 font-bold">S</span>
            <span className="text-yellow-600 font-bold">T</span>
            <span className="text-blue-600 font-bold">E</span>
            <span className="text-blue-900 font-bold">A</span>
            <span className="text-green-600 font-bold">M</span>
          </h1>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-md mt-6 font-semibold hover:bg-gray-700 hover:scale-105 transition-transform duration-300"> <Link href="/shop">Shop Now</Link> </button>
        </div>
        {/* <div className="flex flex-row md:flex-col"> */}
          {/* Floating Images */}
          <div className="flex flex-row sm:flex-col">
          <div className="flex flex-wrap pl-5 sm:items-end sm:flex-col gap-1 mt-6 sm:mt-28 sm:absolute right-5 bottom-28" data-aos="zoom-in">
          {["Science", "Technology", "Engineering", "Arts", "Mathematics"].map(
            (label, idx) => (
              <div
                key={idx}
                className={`relative shadow-2xl rounded-md px-4 py-1 text-white font-medium 
                            hover:translate-x-[-10px] transition-transform duration-300 ease-in-out ${
                  label === "Science"
                    ? "bg-red-600"
                    : label === "Technology"
                    ? "bg-yellow-600"
                    : label === "Engineering"
                    ? "bg-blue-600"
                    : label === "Arts"
                    ? "bg-blue-800"
                    : "bg-green-600"
                }`}
              >
                {label}
              </div>
            )
          )}
        </div>
            {/* Second Image */}
            <div
              className="absolute shadow-2xl rounded-full hidden md:block
              right-5 bottom-48 
              md:right-10 md:bottom-72
              lg:right-20 lg:bottom-96
              xl:right-40 xl:bottom-100" data-aos="zoom-in"
            >
              <Image
                src="/images/heroimages/hero-02.png"
                width={170}
                height={170} 
                // full
                alt="image"
                className="rounded-full w-32 md:w-48 lg:w-52"
              />
            </div>
            {/* First Image */}
            <div
              className="absolute shadow-2xl rounded-full hidden md:block 
              right-24 bottom-0
              md:right-36 md:bottom-20
              lg:right-56 lg:bottom-54
              xl:right-72 xl:bottom-32" data-aos="zoom-in"
            >
              <Image
                src="/images/heroimages/hero-01.png"
                width={300}
                height={300} 
                // full
                alt="image"
                className="rounded-full w-56 md:w-72 lg:w-80"
              />
            </div>
            
          </div>

        {/* </div> */}
      </div>
      
    </>
  )
}

export default HeroSection