import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaShippingFast, FaCheckCircle, FaHeadset } from "react-icons/fa";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 mb-6">
            About <span className="text-orange-600">ElectroZone</span>
          </h1>

          {/* <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              ElectroZone is your premier destination for cutting-edge electronics and technology products. 
              Founded with a passion for innovation, we bring you the latest gadgets, gaming gear, and 
              electronic accessories at competitive prices.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              We believe in making technology accessible to everyone, offering a curated selection of 
              high-quality products backed by excellent customer service and fast delivery.
            </p>
          </div> */}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
              <FaShippingFast className="text-orange-600 text-4xl sm:text-5xl mb-2 sm:mb-3 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm sm:text-base">Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
              <FaCheckCircle className="text-orange-600 text-4xl sm:text-5xl mb-2 sm:mb-3 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Quality Products</h3>
              <p className="text-gray-600 text-sm sm:text-base">Authentic products from trusted brands</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
              <FaHeadset className="text-orange-600 text-4xl sm:text-5xl mb-2 sm:mb-3 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm sm:text-base">Always here to help with your queries</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Why Choose Us?</h2>
            <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                Wide range of electronics and gaming products
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                Competitive pricing and regular deals
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                Secure payment options
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                Easy returns and warranty support
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
