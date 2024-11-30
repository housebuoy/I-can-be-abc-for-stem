// "use client"
import { BsArrowRightShort } from "react-icons/bs";
import ProductCard from "./ProductCard";
import { productData } from "../components/product-card-data";
import { Poppins } from "next/font/google";
import Image from "next/image";
// import abcImage from '../../public/images/ProductImages/abcbook.jpg';


// Import Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const CategoryCards = () => {
  return (
    <section
      className={`${poppins.className} relative min-h-screen mt-40 md:mt-10 w-[90%] mx-auto 2xl:w-[81%] 2xl:mt-10 pb-10`}
    >
      {/* Header Section */}
      <div
        className="md:flex md:flex-row md:justify-between md:items-center 
        2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center"
      >
        <h1
          className="text-[20px] font-medium text-[#003057] leading-[26px]
          mb-5 2xl:mb-1 md:mb-1 2xl:text-[30px]"
        >
          Shop by Category
        </h1>
        <div
          className="flex flex-row gap-2 items-center text-xs text-indigo-600
          font-semibold tracking-[2px]"
        >
          <button>VIEW ALL PRODUCTS</button>
          <span>
            <BsArrowRightShort className="text-[25px]" />
          </span>
        </div>
      </div>
      <section
        className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 gap-y-7
        md:gap-y-7 md:gap-x-7 xl:grid-cols-4"
      >
        {productData.map((product) => (
          <ProductCard
            image={product.image}
            category={product.category}
            key={product.id}
            className="relative w-full h-[300px]"
          >
            {/* Overlay Content */}
            <div
              className="flex flex-row justify-between items-center
                absolute bottom-4 left-3 w-[90%]"
            >
              <span
                className="text-[20px] text-white font-medium
                  md:text-xl lg:text-lg bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md"   
              > 
                {product.category}
              </span>

              <span>
                <BsArrowRightShort className="text-[36px] text-indigo-600" />
              </span>
            </div>
          </ProductCard>
        ))}
      </section>
      <section className=" mt-24  flex flex-col md:flex-row-reverse  justify-between gap-10" data-aos="fade-up"
     data-aos-anchor-placement="center-bottom">
      <Image 
          src="/images/ProductImages/abcbook.jpg"
          alt="fjfj"
          width={550}
          height={450}
          className="rounded-lg "
        />
        <div>
          <h1 className="text-[#2e3d4a] font-bold md:text-9xl text-7xl sm:text-7xl">
            New <br/> Release
          </h1>
          <p className="text-[#49525a] font-mediium text-2xl">Designed for curious minds, our STEM books cater to creativity and learning.</p>
          <div className="mt-5">
            <div className="text-[#2e3d4a] font-semibold text-md">
              <p>Featuring in this release</p>
            </div>
            <div className="">
              <ul className="list-image-[url(/bullet/check.png)] pl-5 text-gray-700">
                <li className="mb-2">Reading Book</li>
                <li className="mb-2">Coloring Book</li>
                <li>Copying & Activity Book</li>
              </ul>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-md mt-6 font-semibold hover:bg-gray-700 hover:scale-105 transition-transform duration-300">Shop Now</button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default CategoryCards;
