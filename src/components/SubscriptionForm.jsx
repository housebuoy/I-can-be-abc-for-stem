"use client";
import { TiChevronRightOutline } from "react-icons/ti";
import axios from "axios"; // Import Axios

const SubscriptionForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value; // Get the email from the form

    try {
      const BREVO_API_KEY = process.env.NEXT_PUBLIC_BREVO_API_KEY;
      const BREVO_URL = "https://api.brevo.com/v3/contacts";

      // Make the POST request to Brevo
      await axios.post(
        BREVO_URL,
        {
          email: email, // Email address to subscribe
          listIds: [2], // Replace 123 with your Brevo contact list ID
          updateEnabled: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": BREVO_API_KEY,
          },
        }
      );

      alert("Subscription successful! Thank you for signing up.");
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("There was an issue with your subscription. Please try again.");
    }
  };

  return (
    <div className="mt-16">
      <div className="">
        <h2 className="font-bold text-xl">Stay ahead with STEAM</h2>
        <p className="text-sm">Subscribe to get Discounts and Updates</p>
      </div>
      <form
        className="mt-4 flex items-center justify-between gap-4 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300 w-full md:w-5/6"
        onSubmit={handleSubmit} // Add submit handler
      >
        <input
          type="email"
          name="email" // Add a name attribute for easier access
          placeholder="Enter your email"
          className="w-full px-4 py-2 outline-none"
          required
        />
        <button
          type="submit"
          className="px-2 py-2 text-white text-2xl bg-indigo-600 rounded-r-md hover:bg-indigo-700 transition-all duration-300"
        >
          <TiChevronRightOutline />
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
