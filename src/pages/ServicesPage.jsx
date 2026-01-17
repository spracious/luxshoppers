import React from "react";
import { Link } from "react-router-dom";
import shop1 from "../images/shoppin1.jpg";
import shop2 from "../images/shop2.jpg";
import shop3 from "../images/shop 3.jpeg";
import shop4 from "../images/shop4.jpeg";
import shop5 from "../images/meat.jpg";
import shop6 from "../images/lunch.jpg";
import shop7 from "../images/shop7.jpg";
import shop8 from "../images/shop8.jpg";
import shop9 from "../images/shop9.jpg";

const ServiceCard = ({ title, description, image, altText }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition hover:scale-105 hover:shadow-lg max-w-sm">
    <img
      src={image}
      alt={altText}
      className="w-full h-48 object-cover"
    />
    <div className="p-6 ">
      <h3 className="text-2xl font-semibold text-Brown mb-3">{title}</h3>
      <p className="text-Muted-Black">{description}</p>
    </div>
  </div>
);

const ServicesPage = () => {
 const services = [ 
  {
    title: "Local Market Treasures",
    description: "Celebrate community and freshness with handpicked goods from trusted neighborhood markets. We deliver the best of local produce, artisanal crafts, and daily essentials — straight to your doorstep.",
    image: shop1,
    altText: "Local Market Goods",
  },
  {
    title: "Fresh Fruits & Vegetables",
    description: "Elevate your nutrition with farm-fresh fruits and vegetables, carefully selected for quality and delivered with care for a healthier, balanced lifestyle.",
    image: shop2,
    altText: "Fresh Fruits and Vegetables",
  },
  {
    title: "Grocery Delivery, Redefined",
    description: "Experience effortless shopping with our personalized grocery delivery service. From pantry staples to premium selections, we bring the store to your door — fresh and on time.",
    image: shop3,
    altText: "Grocery Shopping",
  },
  {
    title: "Trusted Pharmaceutical Delivery",
    description: "Access essential medications with confidence. We ensure secure, discreet, and timely delivery — prioritizing your health and well-being at every step.",
    image: shop4,
    altText: "Pharmaceuticals Delivery",
  },
  {
    title: "Premium Meats & Seafood",
    description: "Indulge in top-quality fresh meats, frozen selections, and seafood — sourced for excellence and delivered in perfect condition, every single time.",
    image: shop5,
    altText: "Meat and Seafood",
  },
  {
    title: "Midday Meal Concierge",
    description: "Make lunchtime effortless with freshly prepared meals delivered punctually. Whether at home or work, enjoy flavorful dishes made for your busy day.",
    image: shop6,
    altText: "Lunch Delivery",
  },
  {
    title: "Global Shipping",
    description: "Shop the world with ease. We handle international procurement and shipping, ensuring your global orders arrive safely, swiftly, and stress-free.",
    image: shop7,
    altText: "Global Shipping Service",
  },
  {
    title: "Curated Gift Sourcing",
    description: "From birthdays to corporate gestures, we source thoughtful, premium gifts that leave a lasting impression — beautifully wrapped and delivered with care.",
    image: shop8,
    altText: "Luxury Gift Sourcing",
  },
  {
    title: "Bespoke Luxury Fashion Shopping",
    description: "Access exclusive fashion pieces tailored to your style. We source and deliver high-end clothing and accessories with concierge-level service and elegance.",
    image: shop9,
    altText: "Luxury Fashion Shopping",
  },
];


  return (
    <div className="bg-{#FFFFF0} from-green-400 to-green-600 flex flex-col min-h-screen">  
      <section className=" text-Muted-Black py-16 text-center">
        <h1 className="text-5xl text-Elegant-Gold font-bold mb-4">Our Services</h1>
        <p className="text-xl max-w-3xl mx-auto">
Discover a curated range of premium lifestyle solutions designed to simplify your daily routine. From fresh grocery shopping and personal errands to reliable pharmaceutical deliveries and bespoke gift sourcing — LuxShoppers ensures every task is handled with care, discretion, and efficiency.
<br />
<small className="font-bold">Your convenience is our priority.</small>        </p>
      </section>

      
      <section className="py-16 px-6">
        <Link to="/login">
        <div className="container  mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                image={service.image}
                altText={service.altText}
              />
            ))}
          </div>
        </div>
        </Link>
      </section>

     <footer className="bg-Brown text-Elegant-Gold font-bold py-6 mt-auto text-center">
        <p>&copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ServicesPage;


