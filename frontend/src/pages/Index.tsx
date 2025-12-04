import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Solutions from "@/components/Solutions";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import CostCalculator from "@/components/CostCalculator";
import ProductTour from "@/components/ProductTour";
import NotificationSystem from "@/components/NotificationSystem";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <Hero />
      <Features />
      <Solutions />
      <ProductTour />
      <CostCalculator />
      <NotificationSystem />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;