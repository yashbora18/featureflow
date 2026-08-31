import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/hero/Hero";
import TrustedTeams from "../components/landing/TrustedTeams";
import Features from "../components/landing/Features";
import ProductShowcase from "../components/landing/ProductShowcase";
import Workflow from "../components/landing/Workflow";
import Architecture from "../components/landing/Architecture";
import TechStack from "../components/landing/TechStack";
import PremiumShowcase from "../components/landing/PremiumShowcase";
import Statistics from "../components/landing/Statistics";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";


function Landing() {
  return (
    <div className="landing-page">

      <LandingNavbar />

      <Hero />

      <TrustedTeams />

      <Features />

      <ProductShowcase />

      <Workflow />

      <Architecture />

      <TechStack />

      <PremiumShowcase />

      <Statistics />

      <CTA />

      <Footer />

    </div>
  );
}

export default Landing;
