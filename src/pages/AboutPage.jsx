import React from "react";
import { Link } from "react-router-dom";


const AboutPage = () => {
  return (
    <div className="bg-{#FFFFF0} from-green-400 to-green-600 flex flex-col min-h-screen">     
      <section className="py-16 text-center">
      <h1 className="text-5xl text-Elegant-Gold font-bold mb-4">
          About Us
        </h1>
        <p className="text-xl max-w-4xl mx-auto text-Muted-Black leading-relaxed">
        <span className="italic font-bold text-Elegant-Gold">LuxShoppers</span> is a premium errand and foodstuff shopping concierge proudly powered by <span className="italic font-bold text-Brown">Luxenova Techhub Limited (RC 8203978)</span>. We specialize in sourcing and delivering fresh, quality foodstuffs and lifestyle essentials to individuals, families, and businesses—within Nigeria and across the globe.
From market runs and grocery shopping to special requests and luxury errands, we offer a seamless, personalized experience built on trust, speed, and reliability. Whether you're a busy professional, a diaspora client, or a homemaker, LuxShoppers is your go-to solution for hassle-free, top-tier shopping.
        </p>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-16">
        <section className="bg-gray-100 shadow-lg rounded-xl p-8 md:p-12 transition-transform duration-500 transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-4xl font-semibold text-Elegant-Gold mb-6">Who We Are</h2>
          <p className="text-lg text-Muted-Black leading-relaxed">
             We are more than just errand runners—we are your personal shopping partners committed to delivering quality, convenience, and peace of mind. Powered by Luxenova Techhub Ltd (RC 8203978), we offer premium foodstuff sourcing, personal errands, and lifestyle concierge services tailored to meet the needs of busy professionals, homemakers, and clients abroad.

Whether you need fresh market items, doorstep delivery, or custom shopping, we handle every task with speed, integrity, and attention to detail. Our mission is to make your life easier—one errand at a time.

Let LuxShoppers do the running while you focus on what truly matters.
          </p>
        </section>

        <section className="bg-gray-100 shadow-lg rounded-xl p-8 md:p-12 transition-transform duration-500 transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-4xl font-semibold text-Elegant-Gold mb-6">Our Mission</h2>
          <p className="text-lg text-Muted-Black leading-relaxed">
At <span className="font-semibold text-Elegant-Gold">LuxShoppers</span>, our mission is to provide seamless, reliable, and personalized shopping and errand services that bring ease and excellence to everyday life. We are committed to sourcing fresh, quality-assured goods, delivering them promptly, and supporting our clients—locally and globally—with trustworthy concierge support that frees up their time and enhances their lifestyle.          </p>
          <p className="mt-4 text-Muted-Black leading-relaxed">
            <strong className="text-Elegant-Gold">LuxShoppers</strong> is dedicated to redefining everyday convenience for busy individuals by providing tailored foodstuff shopping and errand solutions that fit seamlessly into your unique lifestyle—locally and globally.
          </p>
        </section>

        <section className="bg-gray-100 shadow-lg rounded-xl p-8 md:p-12 transition-transform duration-500 transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-4xl font-semibold text-Elegant-Gold mb-6">Why Choose Us?</h2>
          <ul className="space-y-4 text-lg text-Muted-Black">
            <li>
              <strong className="text-Brown">Unmatched Reliability:</strong> We take the stress off your plate by delivering every item and completing every errand on time—exactly as promised.
            </li>
            <li>
              <strong className="text-Brown">Premium Professionalism:</strong> Our trained team personal shoppers and errand runners carry out each task with class, discretion, and attention to details.
            </li>
            <li>
              <strong className="text-Brown">Market-Smart Local Expertise:</strong> From bustling markets to exclusive sources, we know where to find the freshest foodstuffs and premium items at the best value.
            </li>
            <li>
              <strong className="text-Brown"> Tailored to Your Lifestyle:</strong> Whether you're a busy professional, homemaker, or expat—we customize every shopping experience to suit your unique preferences.
            </li>
             <li>
              <strong className="text-Brown"> Convenient, Luxurious Experience:</strong> From order to doorstep, enjoy an effortless journey. With just a few taps, LuxShoppers makes errands feel like a luxury.
            </li>
          </ul>
        </section>

        <section className="bg-Elegant-Gold text-Brown text-center py-20 rounded-xl shadow-lg">
          <h2 className="text-5xl font-extrabold mb-6 animate__animated animate__fadeIn">
            Let Us Handle Your Errands
          </h2>
          <p className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto animate__animated animate__fadeIn">
At LuxShoppers, we simplify your day with seamless, reliable errand solutions tailored to your lifestyle. Focus on your goals — we’ll take care of the rest with the excellence you deserve.          </p>
          <Link
            to="/contact"
            className="bg-white text-Brown font-bold py-3 px-8 rounded-xl shadow-lg transform hover:bg-Brown hover:text-white transition duration-300"
          >
            Get in Touch
          </Link>
        </section>

        <section className="bg-gray-100 shadow-lg rounded-xl p-8 md:p-12 space-y-8">
          <h2 className="text-3xl font-extrabold text-center text-Elegant-Gold mb-8 animate__animated animate__fadeIn animate__delay-9s">What Our Clients Say</h2>
          <div className="space-y-8">
            <div className="p-6 border-l-4 border-Elegant-Gold bg-white transform transition duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-10s">
              <p className="text-Brown italic">
                "LuxShoppers has completely transformed how I manage my schedule. Their efficiency and professionalism are unmatched."
              </p>
              <span className="block mt-4 text-Brown font-semibold">- Monica, Citec Estate Mbora</span>
            </div>
            <div className="p-6 border-l-4 border-Elegant-Gold bg-white transform transition duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-10s">
              <p className="text-Brown italic">
                "Their attention to detail and ability to adapt to my needs make them an indispensable part of my week."
              </p>
              <span className="block mt-4 text-Brown font-semibold">- Victory, Kado Estate</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-Brown text-Elegant-Gold font-bold py-6 mt-auto text-center">
        <p>&copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;


