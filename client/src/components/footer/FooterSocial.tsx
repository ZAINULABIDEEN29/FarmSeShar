import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
}
interface FooterSocialProps {
  className?: string;
  socialLinks?: SocialLink[];
}
const defaultSocialLinks: SocialLink[] = [
  {
    name: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    href: "https://facebook.com",
  },
  {
    name: "Twitter",
    icon: <Twitter className="h-5 w-5" />,
    href: "https://twitter.com",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    href: "https://instagram.com",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://linkedin.com",
  },
];
const FooterSocial: React.FC<FooterSocialProps> = ({
  className,
  socialLinks = defaultSocialLinks,
}) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-500 transition-colors duration-200"
          aria-label={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};
export default FooterSocial;
