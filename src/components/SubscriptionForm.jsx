import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_u4993fe",    // Replace with your Service ID
        "template_fykp8o9",   // Replace with your Template ID
        form.current,
        "RfxS1J7oiiuebzXib"     // Replace with your Public Key
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
          console.log(result.text);
          form.current.reset(); // Reset form
        },
        (error) => {
          alert("Failed to send message. Try again later.");
          console.error(error.text);
        }
      );
  };

  return (
    <div className="container mx-auto sm:px-14 px-5 py-8 pt-28">
      <h1 className="text-center text-4xl font-bold mb-4">Get In Touch With Us</h1>
      <form ref={form} onSubmit={sendEmail} className="space-y-4 shadow-xl rounded-md py-14 border border-gray-200 px-5">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border outline-none border-gray-300 rounded-md p-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full border outline-none border-gray-300 rounded-md p-2"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full border outline-none border-gray-300 rounded-md p-2"
        />
        <textarea
          name="message"
          rows="4"
          placeholder="Your Message"
          className="w-full border outline-none border-gray-300 rounded-md p-2"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
