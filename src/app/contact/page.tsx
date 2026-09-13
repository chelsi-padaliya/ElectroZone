"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
          <h1 className="mb-6 text-left text-3xl font-bold sm:mb-8 sm:text-4xl">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Get In Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-orange-700 transition text-sm sm:text-base"
                >
                  Send Message
                </button>
                {status && (
                  <p className="text-green-600 text-center">{status}</p>
                )}
              </form>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <MdLocationOn className="text-orange-600 text-2xl mr-3 mt-1" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Address</p>
                      <p className="text-gray-600 text-sm sm:text-base">123 Tech Street, Digital City, DC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MdEmail className="text-orange-600 text-2xl mr-3 mt-1" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Email</p>
                      <p className="text-gray-600 text-sm sm:text-base">support@electrozone.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MdPhone className="text-orange-600 text-2xl mr-3 mt-1" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Phone</p>
                      <p className="text-gray-600 text-sm sm:text-base">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-700 text-sm sm:text-base">
                  <p><span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                  <p><span className="font-semibold">Saturday:</span> 10:00 AM - 4:00 PM</p>
                  <p><span className="font-semibold">Sunday:</span> Closed</p>
                </div>
              </div> */}

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Follow Us</h3>
                <div className="flex gap-3 sm:gap-4">
                  <a href="#" className="text-gray-600 hover:text-orange-600 text-xl sm:text-2xl transition"><FaFacebook /></a>
                  <a href="#" className="text-gray-600 hover:text-orange-600 text-xl sm:text-2xl transition"><FaTwitter /></a>
                  <a href="#" className="text-gray-600 hover:text-orange-600 text-xl sm:text-2xl transition"><FaInstagram /></a>
                  <a href="#" className="text-gray-600 hover:text-orange-600 text-xl sm:text-2xl transition"><FaLinkedin /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
