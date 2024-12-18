"use client"; // Next.js directive
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_u4993fe", // Your Service ID
        "template_fykp8o9", // Your Template ID
        form.current,
        "RfxS1J7oiiuebzXib" // Your Public Key
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
          console.log(result.text);
          form.current.reset(); // Reset form fields
        },
        (error) => {
          alert("Failed to send message. Please try again.");
          console.error(error.text);
        }
      );
  };

  return (
    <div className="container mx-auto sm:px-14 px-5 py-8 pt-28" data-aos="fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="flex flex-col sm:justify-center">
          <h1 className="text-center text-4xl font-bold mb-4">Get In Touch With Us</h1>
          <p className="text-center text-gray-600 mb-8">
            For more information about our products & services, please feel free to reach us.
          </p>

          {/* Contact Details Grid */}
          <div className="sm:grid grid-cols-1 gap-3 hidden">
            {/* Address */}
            <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
              <h3 className="font-semibold text-lg text-white">Address</h3>
              <p className="text-white text-sm">Police Street, Teshie-Nungua</p>
            </div>
            {/* Phone */}
            <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
              <h3 className="font-semibold text-lg text-white">Phone</h3>
              <p className="text-white text-sm">Mobile: + (233) 544-899-713</p>
              <p className="text-white text-sm">Hotline: + (233) 502-702-441</p>
            </div>
            {/* Working Hours */}
            <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
              <h3 className="font-semibold text-lg text-white">Working Time</h3>
              <p className="text-white text-sm">Monday–Friday: 9:00–22:00</p>
              <p className="text-white text-sm">Saturday–Sunday: 9:00–21:00</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form ref={form} onSubmit={sendEmail} className="space-y-4 shadow-xl rounded-md py-14 border border-gray-200 px-5">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border outline-none border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full border outline-none border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full border outline-none border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Your Message"
            className="w-full border outline-none border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition duration-300"
          >
            Submit
          </button>
        </form>
        <div className="sm:hidden grid-cols-1 gap-3 grid">
            {/* Address */}
            <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
              <h3 className="font-semibold text-lg text-white">Address</h3>
              <p className="text-white text-sm">Police Street, Teshie-Nungua</p>
            </div>
            {/* Phone */}
            <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
              <h3 className="font-semibold text-lg text-white">Phone</h3>
              <p className="text-white text-sm">Mobile: + (233) 544-899-713</p>
              <p className="text-white text-sm">Hotline: + (233) 502-702-441</p>
            </div>
            {/* Working Hours */}
            <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
              <h3 className="font-semibold text-lg text-white">Working Time</h3>
              <p className="text-white text-sm">Monday–Friday: 9:00–17:00</p>
              <p className="text-white text-sm">Saturday–Sunday: 12:00–16:00</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ContactUs;
