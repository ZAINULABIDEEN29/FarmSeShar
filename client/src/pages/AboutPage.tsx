import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AboutHero, OurImpact, OurStory, OurValues, JoinOurTeam } from "@/components/about";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItemCount = useAppSelector(selectCartItemCount);

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        cartCount={cartItemCount}
        onAccountClick={handleAccountClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1 w-full">
        <AboutHero />
        <OurImpact />
        <OurStory />
        <OurValues />
        <JoinOurTeam />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

