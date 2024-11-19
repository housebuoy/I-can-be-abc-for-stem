import Image from 'next/image'
import React from 'react'
import logo from '../../public/images/logo/logo.png'

const Footer = () => {
  return (
    <footer className="bg-[url(../../public/images/product.svg)] bg-cover bg-center h-56 bg-white border-t border-[#d6e1ff] px-14 text-gray-700 pt-14 grid grid-cols-3">
        <div className=''>
            <Image 
                src={logo}
                width={70} 
                height={70} 
                alt="logo"
                priority
            />
        </div>
        <div className="">
            <h2 className=''>
                Website Map
            </h2>
        </div>
    </footer>
  )
}

export default Footer