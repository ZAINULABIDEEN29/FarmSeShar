import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SupportHero, ConnectWithUs, GetInTouch } from "@/components/contact";
import { useAppSelector } from "@/store/hooks";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
const ContactPage: React.FC = () => {
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
        <SupportHero />
        <ConnectWithUs />
        <GetInTouch />
      </main>
      <Footer />
    </div>
  );
};
export default ContactPage;
