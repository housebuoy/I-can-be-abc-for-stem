"use client";
import React, { createContext, useState, useContext } from "react";
import { getProductByCode } from "../../sanity/schemaTypes/queries"; // Sanity query to fetch a product by code

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Store only product codes and quantities
  const [fullName, setFullName] = useState("")
  // Add product to cart
  const addToCart = (productCode, quantity) => {
    setCartItems((prevCartItems) => {
      console.log("Previous Cart Items:", prevCartItems);
      const existingItem = prevCartItems.find((item) => item.code === productCode);
  
      if (existingItem) {
        console.log("Updating quantity for product:", productCode);
        return prevCartItems.map((item) =>
          item.code === productCode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
  
      console.log("Adding new product to cart:", productCode);
      return [...prevCartItems, { code: productCode, quantity: 1 }];
    });
  };
  
  

  // Remove product from cart
  const removeFromCart = (productCode) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.code !== productCode)
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, setFullName, fullName }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
