"use client";
import React, { useState } from "react";
import { useCart } from "@/app/Context/CartProvider";

const Checkout = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingFee = 20; // Flat shipping fee
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (!shippingDetails.fullName || !shippingDetails.address) {
      alert("Please fill in all required shipping details.");
      return;
    }
    alert("Order placed successfully!");
    console.log("Order details:", { cartItems, shippingDetails, paymentMethod });
    // Navigate to a success page or save order details to the database
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Checkout</h1>

        {/* Cart Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Cart Summary</h2>
          {cartItems.length > 0 ? (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.code} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-800 font-semibold">GH¢ {item.price * item.quantity}</p>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => removeFromCart(item.code)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Shipping Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Shipping Details</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={shippingDetails.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingDetails.postalCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </form>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="mobileMoney"
                checked={paymentMethod === "mobileMoney"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Mobile Money
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h2>
          <div className="flex justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="text-gray-800">GH¢ {subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="text-gray-800">GH¢ {shippingFee}</p>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>GH¢ {total}</p>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
