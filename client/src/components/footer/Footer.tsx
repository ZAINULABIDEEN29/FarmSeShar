import React from "react";
import Container from "../container/Container";
import FooterLogo from "./FooterLogo";
import FooterSocial from "./FooterSocial";
import FooterLinks from "./FooterLinks";
import type { FooterLink } from "./FooterLinks";
import FooterContact from "./FooterContact";
import FooterCopyright from "./FooterCopyright";
interface FooterProps {
  onLogoClick?: () => void;
  onLinkClick?: (link: FooterLink) => void;
  quickLinks?: FooterLink[];
  customerServiceLinks?: FooterLink[];
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
}
const defaultQuickLinks: FooterLink[] = [
  { label: "Shop Products", href: "/products" },
  { label: "Our Farmers", href: "/farmers" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Delivery Info", href: "/delivery" },
];
const defaultCustomerServiceLinks: FooterLink[] = [
  { label: "Support", href: "/support" },
  { label: "Returns", href: "/returns" },
  { label: "Join Our Platform", href: "/join" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];
const Footer: React.FC<FooterProps> = ({
  onLogoClick,
  onLinkClick,
  quickLinks = defaultQuickLinks,
  customerServiceLinks = defaultCustomerServiceLinks,
  email = "admin@localharvest.com",
  phone = "(0)-2347-1008",
  address = "Lahore, Punjab, Pakistan",
  description = "Connecting communities with local organic farmers fresh, sustainable produce without intermediaries",
}) => {
  return (
    <footer className="w-full bg-[#1A202C] text-white relative">
      <Container>
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 py-12">
          {}
          <div className="md:col-span-2 lg:col-span-1">
            <FooterLogo description={description} onClick={onLogoClick} />
            <div className="mt-6">
              <FooterSocial />
            </div>
          </div>
          {}
          <div className="md:col-span-1 lg:col-span-1">
            <FooterLinks
              title="Quick Links"
              links={quickLinks}
              onLinkClick={onLinkClick}
            />
          </div>
          {}
          <div className="md:col-span-1 lg:col-span-1">
            <FooterLinks
              title="Customer Service"
              links={customerServiceLinks}
              onLinkClick={onLinkClick}
            />
          </div>
          {}
          <div className="md:col-span-2 lg:col-span-1">
            <FooterContact
              email={email}
              phone={phone}
              address={address}
            />
          </div>
        </div>
      </Container>
      {}
      <div className="border-t border-gray-600"></div>
      {}
      <FooterCopyright />
      {}
      <div className="h-0.5 bg-blue-500"></div>
    </footer>
  );
};
export default Footer;
