import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHeart, FaClock, FaBullhorn } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  return (
    <div className="bg-{#FFFFF0} from-green-400 to-green-600 flex flex-col min-h-screen">
     
      <section
        className="relative text-green flex flex-col justify-center items-center text-center px-6 py-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/path/to/hero-image.jpg')" }}
      >
        <div className="">
        </div>
        <h1 className="text-5xl text-Elegant-Gold sm:text-6xl font-bold mb-4 text-shadow-lg animate__animated animate__fadeIn animate__delay-1s animate__bounceIn">
          Welcome to <span className="text-Elegant-Gold italic">LuxShoppers</span>
          <br />
          <small className="italic text-xl text-Brown animate__animated animate__fadeIn animate__delay-2s">
            Your Personal Assistant in Motion...
          </small> <br />
          <small className="italic text-xl text-Elegant-Gold animate__animated animate__fadeIn animate__delay-2s">
            Powered by LUXENOVA TECHHUB
          </small>
        </h1>
        

        <p className="text-lg sm:text-xl text-Muted-Black mb-10 max-w-2xl mx-auto font-light animate__animated animate__fadeIn animate__delay-3s animate__zoomIn">
         We run your errands, so you can run your life..... <br />
Whether you're swamped at work, prepping for an event, or simply need an extra hand—we’re here to make your day easier. Your convenience, our priority.
        </p>

        <div className="flex gap-6 flex-wrap justify-center animate__animated animate__fadeIn animate__delay-4s">
          <button
            onClick={handleGetStarted}
            className="bg-Brown text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:bg-white hover:text-Brown hover:scale-105 hover:rotate-1 transition duration-300"
          >
            Get Started
          </button>
          <button
            onClick={handleLearnMore}
            className="bg-transparent border-2 border-Brown text-Brown px-8 py-3 rounded-lg hover:bg-Brown hover:text-white hover:scale-105 hover:rotate-1 transition duration-300"
          >
            Learn More
          </button>
        </div>
      </section>

      <section className="py-16 bg-white animate__animated animate__fadeIn animate__delay-5s">
        <h2 className="text-3xl font-extrabold text-center text-Elegant-Gold mb-8 animate__animated animate__zoomIn animate__delay-6s">Why Choose Us?</h2>
        {/* <h4>
         <span className="text-blue text-2xl"> Because your time is valuable, and quality matters.</span> <br />

At LuxShoppers by Luxenova Techhub, we don’t just run errands—we deliver peace of mind. Whether it’s stocking your kitchen with fresh Nigerian foodstuffs, shopping for premium items, or handling personal pickups, we take pride in doing it fast, right, and with a touch of luxury.
        </h4> <br /> */}
        <div className="flex flex-wrap  text-Brown text-bold justify-center gap-10">
          {[
            {
              icon: <FaCheckCircle className="text-4xl text-Elegant-Gold mb-4 animate__animated animate__pulse animate__infinite" />,
              title: " Fresh & Quality-Assured Goods",
              description: "We handpick the best foodstuffs and essentials—fresh from trusted markets and suppliers—ensuring top-notch quality every single time.",
            },
            {
              icon: <FaHeart className="text-4xl text-Elegant-Gold mb-4 animate__animated animate__pulse animate__infinite" />,
              title: "Personalized Shopping Experience",
              description: "Tell us what you need, how you want it—we shop exactly to your preference, just like you would.",
            },
            {
              icon: <FaClock className="text-4xl text-Elegant-Gold mb-4 animate__animated animate__pulse animate__infinite" />,
              title: "Reliable Nationwide & International Delivery",
              description: "Whether you're in Abuja, Nigeria or abroad, we deliver swiftly and safely to your doorstep, using reliable logistics partners for seamless shipping.",
            },
            {
              icon: <FaBullhorn className="text-4xl text-Elegant-Gold mb-4 animate__animated animate__pulse animate__infinite" />,
              title: " Convenience at Your Fingertips",
              description: "Place orders, get updates, and track your errands—our team is trained, respectful, and reliable. You can count on us to handle every request with integrity and care.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 shadow-lg p-8 rounded-lg text-center max-w-xs flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-orange-50 animate__animated animate__fadeIn animate__delay-7s"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white animate__animated animate__fadeIn animate__delay-8s">
        <h2 className="text-3xl font-extrabold text-center text-Elegant-Gold mb-8 animate__animated animate__fadeIn animate__delay-9s">
          What Our Clients Say
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="p-6 border-l-4 border-Elegant-Gold bg-gray-100 transform transition duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-10s">
            <p className="text-lg text-Brown italic">
              "LuxShoppers has made my life so much easier. From grocery shopping to picking up packages, their service is unmatched!"
            </p>
            <span className="block mt-4 text-Brown font-bold">- Jimmy, Apo</span>
          </div>
          <div className="p-6 border-l-4 border-Elegant-Gold bg-gray-100 transform transition duration-500 hover:scale-105 hover:shadow-xl animate__animated animate__fadeIn animate__delay-11s">
            <p className="text-lg text-Brown italic">
              "I trust LuxShoppers with all my errands. They are always punctual and professional, delivering every time."
            </p>
            <span className="block mt-4 text-Brown font-bold">- Sarah, Wuse</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-center animate__animated animate__fadeIn animate__delay-12s">
        <h2 className="text-3xl text-Elegant-Gold font-extrabold mb-6">Ready to Experience Premium Errand & Foodstuff Shopping?</h2>
        <p className="text-lg mb-8 text-Muted-Black max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-13s">
Let LuxShoppers handle your market runs, grocery needs, and lifestyle errands—so you can focus on what truly matters. Get started today and enjoy luxury, convenience, and trust in every delivery.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-Brown  font-semibold px-10 py-4 rounded-lg shadow-lg transform hover:bg-Brown mb-6 hover:text-white transition duration-300"
        >
          Get Started Now
        </button>
        {/* <div className="mt-4 flex justify-center gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-bold text-2xl hover:text-blue transform transition duration-300 hover:scale-110"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-bold text-2xl hover:text-blue transform transition duration-300 hover:scale-110"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-bold text-2xl hover:text-blue transform transition duration-300 hover:scale-110"
            >
              Instagram
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-bold text-2xl hover:text-blue transform transition duration-300 hover:scale-110"
            >
              Linkedin
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-bold text-2xl hover:text-blue transform transition duration-300 hover:scale-110"
            >
              TikTok
            </a>
          </div> */}
      </section>

     <footer className="bg-Brown text-Elegant-Gold font-bold py-6 mt-auto text-center">
        <p>&copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;






