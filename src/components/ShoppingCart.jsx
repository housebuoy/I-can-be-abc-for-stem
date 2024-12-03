"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../app/Context/CartProvider";
import { getProductByCode } from "../sanity/schemaTypes/queries";
import Image from "next/image";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase"


const ShoppingCart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push("/login"); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchCartProducts = async () => {
      const fetchedProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await getProductByCode(item.code);
          return { ...product, quantity: item.quantity }; // Include quantity in product details
        })
      );
      setProducts(fetchedProducts);
    };
    fetchCartProducts();
  },  [cartItems, user]);

  
  const cartTotal = products.reduce((total, item) => total + item.price * item.quantity, 0);
  if (!user) return null;
  return (
    // isOpen && (
      <div className="fixed top-0 right-0 w-96 md:w-2/5  bg-white shadow-lg h-full z-50 px-6 overflow-y-auto">
        <span className="flex items-center justify-between absolute top-0 right-0 bg-white w-full px-6">
            <h2 className="text-xl font-bold my-5 pb-5 border-b">Shopping Cart</h2>
            <button onClick={onClose}>
                < IoMdCloseCircleOutline className="text-3xl text-indigo-600"/>
            </button>
            
        </span>
        
        {products.length === 0 ? (
          <p className="pt-24 font-semibold text-gray-600 text-2xl">Your cart is empty</p>
        ) : (
          <div className="pb-32 pt-24">
            {products.map((item) => (
              <div key={item.code} className="flex items-end justify-between py-4 mb-2 border gap-4">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                //   layout="responsive"
                  objectFit="cover"
                  width={100} // specify the width
                  height={100}
                  quality={100}
                  className="object-cover rounded border-r mr-4"
                />
                <div>
                  <h3 className="font-semibold text-base">{item.title}</h3>
                  <p className="text-sm font-semibold text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold text-gray-600">Price: GH¢ {item.price * item.quantity}</p>
                </div>
                <button
                  className="text-indigo-600 text-3xl"
                  onClick={() => removeFromCart(item.code)}
                >
                  < MdDeleteForever />
                </button>
              </div>
            ))}
            <div className="border-t pt-4 fixed pb-5 w-full mx-auto bottom-[env(safe-area-inset-bottom)] bg-white">
              <h3 className="text-lg font-semibold">
                Subtotal: GH¢ {cartTotal.toFixed(2)}
              </h3>
              <button className="px-36 bg-indigo-600 text-white py-2 rounded mt-4">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    )
//   );
};

export default ShoppingCart;
