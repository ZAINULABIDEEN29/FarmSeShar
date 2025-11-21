import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
export interface ContactItem {
  icon: React.ReactNode;
  text: string;
  href?: string;
}
interface FooterContactProps {
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  className?: string;
}
const FooterContact: React.FC<FooterContactProps> = ({
  title = "Contact Us",
  email = "admin@farmseghar.com",
  phone = "(111)-2347-1968",
  address = "Lahore, Punjab, Pakistan",
  className,
}) => {
  const contactItems: ContactItem[] = [
    {
      icon: <Mail className="h-5 w-5 shrink-0" />,
      text: email,
      href: `mailto:${email}`,
    },
    {
      icon: <Phone className="h-5 w-5 shrink-0" />,
      text: phone,
      href: `tel:${phone}`,
    },
    {
      icon: <MapPin className="h-5 w-5 shrink-0" />,
      text: address,
    },
  ];
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h3 className="text-white font-bold text-base">{title}</h3>
      <ul className="flex flex-col gap-3">
        {contactItems.map((item, index) => {
          const content = (
            <div className="flex items-start gap-3">
              <span className="text-white mt-0.5">{item.icon}</span>
              <span className="text-sm text-gray-400">{item.text}</span>
            </div>
          );
          return (
            <li key={index}>
              {item.href ? (
                <a
                  href={item.href}
                  className="hover:text-green-500 transition-colors duration-200 [&_span]:hover:text-green-500"
                >
                  {content}
                </a>
              ) : (
                <div>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default FooterContact;
