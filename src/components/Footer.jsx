import Image from 'next/image'
import React from 'react'
import Link from "next/link";
// import logo from '/public/images/logo/logo.png'
// import kidsathome from '../../public/images/logo/KIDSATHOME-02.png'
// import kidsathome from '../../public/images/logo/KIDSATHOME-01.png'
import SubscriptionForm from './SubscriptionForm';
import { FaFacebookF, FaTiktok, FaGlobeAfrica } from 'react-icons/fa';
import { BsInstagram, BsDribbble, BsLinkedin } from 'react-icons/bs';

const socialIcons = [
    { id: 1, icon: <FaGlobeAfrica />, link: 'https://dribbble.com' },    
    { id: 2, icon: <BsLinkedin />, link: 'https://linkedin.com' },
    { id: 3, icon: <BsInstagram />, link: 'https://instagram.com' },
    { id: 4, icon: <FaFacebookF />, link: 'https://facebook.com' },
    { id: 5, icon: <FaTiktok /> , link: 'https://behance.net' },    
];

const currentYear = new Date().getFullYear(); 

const Footer = () => {
  return (
    <footer className="bg-[url(../../public/images/product.svg)] bg-cover bg-center min-h-96 bg-white border-t border-[#d6e1ff] px-14 text-gray-700 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        <div className="flex flex-col items-center md:items-start">
            <Image 
                src="/images/logo/logo.png"
                width={140} 
                height={140} 
                alt="logo"
                priority
            />
            <SubscriptionForm />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="font-semibold text-2xl">Website Map</h2>
            <div className="flex md:flex-col gap-x-5 flex-row gap-y-3 mt-2">
                <Link href="/" className="block md:inline hover:underline font-poppins">
                    Home
                </Link>
                <Link href="/shop" className="block md:inline hover:underline">
                    Shop
                </Link>
                <Link href="/contact" className="block md:inline hover:underline">
                    Contact
                </Link>
            </div>
            <div className="mt-16 flex flex-col items-center md:items-start">
                <div className="gap-2 items-end">
                        <div className='items-start'>
                            <p className="font-semibold">Powered by</p>
                            {/* <p>Kidsathome Educational Centre</p> */}
                        </div> 
                    <Image 
                        src="/images/logo/KIDSATHOME-01.png"
                        width={200} 
                        height={60} 
                        alt="logo"
                        priority
                    />
                    <div className='items-start'>
                        {/* <p className="font-semibold">Powered by</p> */}
                        {/* <p>Kidsathome Educational Centre</p> */}
                    </div>                
                </div>  
                <div className="flex justify-center items-center mt-5">
                    <p>All rights reserved © {currentYear}</p>
                </div> 
            </div>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="font-semibold text-2xl">Contacts</h2>
            <ul className="flex flex-col gap-y-3 mt-2">
                <li>kidsathomesp@gmail.com</li>
                <li>+233 54 489 9713</li>
                <li>www.kidsathomesp.com</li>
            </ul>
            <div className="flex justify-center items-center gap-4 mt-16 flex-wrap">
                {socialIcons.map((item) => (
                    <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 border border-gray-800 rounded-md hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                    {item.icon}
                    </a>
                ))}
            </div>
        </div>
    </footer>
  );
};

export default Footer;
