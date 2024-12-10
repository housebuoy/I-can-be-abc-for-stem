"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth listener
import { auth } from "../../../firebase"; // Your Firebase config

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState(null); // Firebase userId

  // Fetch the cart from MongoDB
  const fetchCart = async (userId) => {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      console.log(userId)
  
      const data = await response.json();
      setCartItems((prevCartItems) => {
        // Merge local cart with database cart
        const dbCartItems = data.cartItems || [];
        const mergedCart = [...prevCartItems];
  
        dbCartItems.forEach((dbItem) => {
          const existingItem = mergedCart.find((item) => item.code === dbItem.code);
          if (existingItem) {
            existingItem.quantity = Math.max(existingItem.quantity, dbItem.quantity);
          } else {
            mergedCart.push(dbItem);
          }
        });
  
        return mergedCart;
      });
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  };
  
  // Save the cart to MongoDB
  const saveCart = async (cartItems) => {
    try {
      await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cartItems }),
      });
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  // Add item to cart
  const addToCart = (productCode) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((item) => item.code === productCode);
      if (existingItem) {
        return prevCartItems.map((item) =>
          item.code === productCode ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCartItems, { code: productCode, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productCode) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.code !== productCode)
    );
  };

  // Listen for Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set Firebase userId
        setFullName(user.displayName || ""); // Optional: Set user's display name
        fetchCart(user.uid); // Fetch cart for this userId
      } else {
        setUserId(null); // Clear userId on logout
        setCartItems([]); // Clear cart on logout
      }
    });

    return () => unsubscribe();
  }, []);

  // Save cart to MongoDB whenever it changes
  useEffect(() => {
    let saveTimeout;
    if (userId) {
      saveTimeout = setTimeout(() => {
        saveCart(cartItems);
      }, 500); // Save cart after 500ms delay
    }
  
    return () => clearTimeout(saveTimeout); // Cleanup timeout
  }, [cartItems, userId]);
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        setFullName,
        fullName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
