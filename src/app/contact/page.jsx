import React from "react";

const ContactUs = () => {
  return (
    <div className="container mx-auto sm:px-14 px-5 py-8 pt-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="flex flex-col sm:justify-center">
            <div className="">
                <h1 className="text-center text-4xl font-bold mb-4">Get In Touch With Us</h1>
                <p className="text-center text-gray-600 mb-8">
                    For more information about our products & services, please feel free to reach us.
                </p>
            </div >
            <div className="sm:grid sm:grid-cols-2 grid-cols-1 gap-x-3 gap-y-3 hidden">
                <div className=" bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">            
                    <h3 className="font-semibold text-lg text-white ">Address</h3>
                    <p className="text-white text-sm ">Police Street, Teshie-Nungua</p>
                </div>
                <div className=" bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
                    <h3 className="font-semibold text-lg text-white ">Phone</h3>
                    <p className="text-white text-sm ">Mobile: + (233) 544-899-713</p>
                    <p className="text-white text-sm ">Hotline: + (233) 502-702-441</p>
                </div>
                <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
                    <h3 className="font-semibold text-lg text-white ">Working Time</h3>
                    <p className="text-white text-sm ">Monday–Friday: 9:00–22:00</p>
                    <p className="text-white text-sm ">Saturday–Sunday: 9:00–21:00</p>
                </div>
                <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
                    <h3 className="font-semibold text-lg text-white ">Working Time</h3>
                    <p className="text-white text-sm ">Monday–Friday: 9:00–22:00</p>
                    <p className="text-white text-sm ">Saturday–Sunday: 9:00–21:00</p>
                </div>
            </div>
        </div>
        {/* Contact Form */}
        <form className="space-y-4 shadow-xl rounded-md py-14 border border-gray-200 px-5">
            <div className="md:flex items-center justify-between gap-4">
                <div className="w-full">
                    <label className="block text-lg  font-bold text-gray-700" htmlFor="name">
                    Name
                    </label>
                    <input
                    type="text"
                    id="name"
                    className="w-full border outline-none border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
                    placeholder="Your name"
                    />
                </div>
                <div className="w-full">
                    <label className="block text-lg  font-bold text-gray-700" htmlFor="email">
                    Email address
                    </label>
                    <input
                    type="email"
                    id="email"
                    className="w-full border outline-none border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
                    placeholder="Your email"
                    />
                </div>
            </div>
          <div>
            <label className="block text-lg  font-bold text-gray-700" htmlFor="subject">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full border outline-none border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
              placeholder="This is optional"
            />
          </div>
          <div>
            <label className="block text-lg  font-bold text-gray-700" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full border outline-none border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:ring-1 focus:border-indigo-500"
              placeholder="Hi! I'd like to ask about..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-800"
          >
            Submit
          </button>
        </form>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-3 gap-y-3 sm:hidden">
                <div className=" bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">            
                    <h3 className="font-semibold text-lg text-white ">Address</h3>
                    <p className="text-white text-sm ">Police Street, Teshie-Nungua</p>
                </div>
                <div className=" bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
                    <h3 className="font-semibold text-lg text-white ">Phone</h3>
                    <p className="text-white text-sm ">Mobile: + (233) 544-899-713</p>
                    <p className="text-white text-sm ">Hotline: + (233) 502-702-441</p>
                </div>
                <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
                    <h3 className="font-semibold text-lg text-white ">Working Time</h3>
                    <p className="text-white text-sm ">Monday–Friday: 9:00–22:00</p>
                    <p className="text-white text-sm ">Saturday–Sunday: 9:00–21:00</p>
                </div>
                <div className="bg-indigo-600 flex flex-col items-center justify-center py-3 rounded">
                    <h3 className="font-semibold text-lg text-white ">Working Time</h3>
                    <p className="text-white text-sm ">Monday–Friday: 9:00–22:00</p>
                    <p className="text-white text-sm ">Saturday–Sunday: 9:00–21:00</p>
                </div>
            </div>
      </div>
    </div>
  );
};

export default ContactUs;
