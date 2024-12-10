"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/app/Context/CartProvider";
import { getProductByCode, getCouponByCode } from "../../sanity/schemaTypes/queries";
import { auth } from "../../../firebase";
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";

const Checkout = () => {
  const { cartItems, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    landmark: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discountedProduct, setdiscountedProduct] = useState("");
  const [discount, setDiscount] = useState(0); // Discount percentage
  const [discountPercent, setDiscountPercent] = useState(0); // Discount percentage
//   const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = products.reduce((total, item) => total + item.quantity * item.price, 0);
  const discountAmount = (subtotal * discount) / 100;
  const shippingFee = 20;
  const total = subtotal - discountAmount + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      alert("Please enter a coupon code.");
      return;
    }
  
    try {
      const coupon = await getCouponByCode(couponCode);
      console.log("Fetched coupon details:", coupon);
  
      if (!coupon) {
        alert("Invalid coupon code.");
        return;
      }
  
      if (coupon.status === "inactive" || new Date(coupon.expiryDate) < new Date()) {
        alert("This coupon is either expired or inactive.");
        return;
      }
  
      let applicableProducts = [];
  
      if (coupon.applyTo === "all") {
        applicableProducts = products;
        setdiscountedProduct("all products")
      } else if (coupon.applyTo === "category") {
        applicableProducts = products.filter(
            (item) => String(item.category?._id) === String(coupon.category?._id)
          );
          console.log("Applicable products for category:", applicableProducts);          
          console.log("category:", coupon.category?._id);
          setdiscountedProduct(`${coupon.category?.title} category`)          
      } else if (coupon.applyTo === "product") {
        applicableProducts = products.filter(
          (item) => String(item.code) === String(coupon.product?.code)
        );
        setdiscountedProduct(`product with code ${coupon.product?.code}`)
      } else {
        console.error("Coupon does not have a valid scope:", coupon); 
        alert("Coupon is improperly configured.");
        return;
      }
  
      if (applicableProducts.length > 0) {
        // Calculate discount for eligible products
        const discountAmount = applicableProducts.reduce(
          (total, item) => total + (item.price * item.quantity * coupon.discount) / 100,
          0
        );
        setDiscount(discountAmount);
        setDiscountPercent(coupon.discount) // Store discount amount
        alert(`Coupon applied! Discount: ${coupon.discount}%`);
      } else {
        alert("This coupon is not valid for your cart.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert("Failed to apply coupon. Please try again.");
    }
  };
  
  
  
  
  

  const handlePlaceOrder = () => {
    if (!shippingDetails.fullName || !shippingDetails.address) {
      alert("Please fill in all required shipping details.");
      return;
    }
    alert(`Order placed successfully! Total amount: GH¢ ${total.toFixed(2)}`);
    console.log("Order details:", { products, shippingDetails, paymentMethod });
  };

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchCartProducts = async () => {
      const fetchedProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await getProductByCode(item.code);
          return { ...product, quantity: item.quantity };
        })
      );
      setProducts(fetchedProducts);
    };
    fetchCartProducts();
  }, [cartItems, user]);

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Checkout</h1>

        {/* Cart Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 sm:mb-4">Cart Summary</h2>
          {products.length === 0 ? (
            <p className="sm:text-center font-semibold text-indigo-600 sm:text-gray-600 sm:text-2xl">
              Your cart is empty.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((item) => (
                <div key={item.code} className="flex items-start gap-4 border-b pb-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="rounded border"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-800">
                      Price: GH¢ {item.price * item.quantity}
                    </p>
                  </div>
                  <button
                    className="text-red-600 text-2xl"
                    onClick={() => removeFromCart(item.code)}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coupon Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Apply Coupon</h2>
          <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
                />
                <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                    Apply
                </button>
          </div>
          {discount > 0 && (
            <p className="text-sm text-green-600 mt-2">
              {discountPercent}% discount applied on {discountedProduct}!
            </p>
          )}
        </div>

        {/* Shipping Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Shipping Details</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" autoComplete="on">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                value={shippingDetails.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Phone <span className="text-red-600">*</span></label>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="address"
                autoComplete="street-address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Landmark <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="landmark"
                value={shippingDetails.landmark}
                autoComplete="address-line2"
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Post Code</label>
              <input
                type="text"
                name="postalCode"
                autoComplete="postal-code"
                value={shippingDetails.postalCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
                required
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h2>
            <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-800">GH¢ {subtotal.toFixed(2)}</p>
            </div>
            {discount > 0 && (
                <div className="flex justify-between text-green-600">
                <p>Discount</p>
                <p>- GH¢ {discount.toFixed(2)}</p>
                </div>
            )}
            <div className="flex justify-between">
                <p className="text-gray-600">Shipping Fee</p>
                <p className="text-gray-800">GH¢ {shippingFee.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>GH¢ {(subtotal - discount + shippingFee).toFixed(2)}</p>
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
