import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Container from "@/components/container/Container";
import {
  ContactHero,
  ContactInfoCard,
  SocialLinks,
  ContactForm,
} from "@/components/contact";
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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@farmers.com",
      subContent: "We'll respond within 24 hours",
      color: "blue" as const,
    },
    {
      icon: Phone,
      title: "Phone",
      content: "(0)-2347-1008",
      subContent: "Mon-Fri 9am-6pm",
      color: "green" as const,
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Farm Street",
      subContent: "Lahore, Pakistan 54000",
      color: "purple" as const,
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Monday - Friday",
      subContent: "9:00 AM - 6:00 PM",
      color: "orange" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        cartCount={cartItemCount}
        onAccountClick={handleAccountClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1 w-full">
        <ContactHero />

        {/* Contact Content */}
        <section className="py-12 sm:py-16 lg:py-20 -mt-8 sm:-mt-12 lg:-mt-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {/* Contact Information Cards */}
              <div className="lg:col-span-1 space-y-5 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <ContactInfoCard
                    key={index}
                    icon={info.icon}
                    title={info.title}
                    content={info.content}
                    subContent={info.subContent}
                    color={info.color}
                  />
                ))}

                <SocialLinks />
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm />
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
