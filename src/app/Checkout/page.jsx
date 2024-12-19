"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/app/Context/CartProvider";
import { getProductByCode, getCouponByCode } from "../../sanity/schemaTypes/queries";
import { auth } from "../../../firebase";
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";

const Checkout = () => {
  const { cartItems, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const notify = (transactionId) => 
    toast.info(`Order placed successfully! Transaction ID: ${transactionId}`);  
  const user = auth.currentUser;
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.displayName || "",
    address: "",
    landmark: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountedProduct, setdiscountedProduct] = useState("");
  const [discount, setDiscount] = useState(0); // Discount percentage
  const [discountPercent, setDiscountPercent] = useState(0); // Discount percentage
//   const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = products.reduce((total, item) => total + item.quantity * item.price, 0);
  const discountAmount = (subtotal * discount) / 100;
  const shippingFee = 0;
  const total = subtotal - discountAmount + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
        document.body.removeChild(script);
    };
}, []);

const generateTransactionId = (userId) => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random alphanumeric
  return `${userId ? userId.slice(0, 4).toUpperCase() : "GUEST"}-${timestamp}-${randomString}`;
};

const transactionId = generateTransactionId(user?.uid || "guest");

const handlePaystackPayment = () => {
  const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Your public key
      email: user?.email || "guest@example.com", // Customer's email
      amount: Math.round(total * 100), // Amount in kobo
      currency: "GHS", // Currency (default is NGN)
      ref: transactionId, // Reference number
      callback: (response) => {
          // Handle successful payment
          console.log("Payment successful:", response);
          saveOrder(response.reference); // Save order details to backend
      },
      onClose: () => {
          console.log("Payment popup closed");
          alert("Payment was not completed.");
      },
  });

  handler.openIframe(); // Open Paystack payment popup
};



  // const initializePayment = usePaystackPayment(config);

  // const handlePayment = () => {
  //   if (!user?.email) {
  //     alert("User email is required for payment.");
  //     return;
  //   }
  //   if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
  //     alert("Please fill in all required shipping details.");
  //     return;
  //   }
  
  //   setLoading(true); // Start the loading state
  
  //   initializePayment(
  //     (response) => {
  //       console.log("Payment Successful", response);
  //       setLoading(false); // End loading state
  //       // saveOrder(response.reference); // Save order details after successful payment
  //     },
  //     (error) => {
  //       console.error("Payment Failed", error);
  //       setLoading(false); // End loading state
  //       alert("Payment failed. Please try again.");
  //     }
  //   );
  // };
  
  
  // Save order details to the backend
  const saveOrder = async (paymentReference) => {
    try {
      console.log(transactionId)
        // const transactionId = generateTransactionId(user?.uid || "guest");
        const orderDetails = {
            userId: user?.uid || "guest",
            transactionId,
            shippingDetails,
            cartItems: products,
            total,
            status: "Pending",
            paymentReference,
        };

        console.log("Sending order details:", orderDetails);

        const response = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderDetails),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save order.");
        }

        const responseData = await response.json();
        console.log("Order saved successfully:", responseData);

        notify(transactionId)
    } catch (error) {
        console.error("Error saving order:", error.message);
        alert("Failed to save order. Please contact support.");
    }
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
      <ToastContainer />
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
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                autoComplete="postal-code"
                value={shippingDetails.postalCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">City/Country <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
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
            <div className="col-span-2 sm:col-span-1">
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
                <p className="text-gray-800">Payment on delivery</p>
            </div>
            <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>GH¢ {(subtotal - discount + shippingFee).toFixed(2)}</p>
            </div>
            </div>


        {/* Place Order Button */}
        <button
            onClick={handlePaystackPayment}
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-md ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            >
            {loading ? "Processing..." : "Pay with Paystack"}
        </button>
        {/* <PaystackButton {...componentProps} /> */}
      </div>
    </div>
  );
};

export default Checkout;
