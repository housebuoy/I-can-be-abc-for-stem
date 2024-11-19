const ContactSupport = () => {
  return (
    <section className="mt-5">
    <div className="text-center my-8" data-aos="fade-in">
      <h2 className="text-3xl font-bold text-gray-800">Why Choose Here?</h2>
      <p className="text-gray-600 mt-2">Here’s why we’re the best in what we do.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 w-full mt-5">
      <div className="flex flex-col items-center justify-center bg-blue-500 text-white p-6 h-40" data-aos="fade-up"
            data-aos-duration="1000">
        <h3 className="text-xl font-bold mb-2">Easy Access</h3>
        <p className="text-sm text-center">Our platform is easy to navigate for everyone.</p>
      </div>

      
      <div className="flex flex-col items-center justify-center bg-blue-600 text-white p-6 h-40"
            data-aos="fade-up"
            data-aos-duration="1500">
        <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
        <p className="text-sm text-center">We ensure timely delivery of all products.</p>
      </div>

      
      <div className="flex flex-col items-center justify-center bg-blue-700 text-white p-6 h-40"
            data-aos="fade-up"
            data-aos-duration="2000">
        <h3 className="text-xl font-bold mb-2">24/7 Customer Service</h3>
        <p className="text-sm text-center">Get support whenever you need it.</p>
      </div>

    
      <div className="flex flex-col items-center justify-center bg-blue-800 text-white p-6 h-40"
            data-aos="fade-up"
            data-aos-duration="2500">
        <h3 className="text-xl font-bold mb-2">Affordable Prices</h3>
        <p className="text-sm text-center">Enjoy great deals and competitive prices.</p>
      </div>
    </div>
    <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-gray-800">Need Help?</p>
        <p className="text-gray-600">We’re here for you. <a href="/contact" className="text-blue-500 underline">Contact Support</a>.</p>
    </div>
    </section>
  )
}

export default ContactSupport