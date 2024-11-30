import Image from "next/image"
import React from 'react'
  
  const ProductCard = (props) => {
    return (
        <div className={props.className}>
          <Image
            src={props.image}
            alt={props.category}
            fill
            // width={100}
            className="object-fit w-[100%] h-[100%] rounded-lg"
            data-aos="zoom-in"
            data-aos-duration="500"
          />
          {props.children}
        </div>
      )
  }
  
  export default ProductCard