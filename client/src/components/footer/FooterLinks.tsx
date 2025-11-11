import React from "react";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinksProps {
  title: string;
  links: FooterLink[];
  className?: string;
  onLinkClick?: (link: FooterLink) => void;
}

const FooterLinks: React.FC<FooterLinksProps> = ({
  title,
  links,
  className,
  onLinkClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: FooterLink) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(link);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h3 className="text-white font-bold text-base">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => handleClick(e, link)}
              className="text-sm text-gray-400 hover:text-green-500 transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;

