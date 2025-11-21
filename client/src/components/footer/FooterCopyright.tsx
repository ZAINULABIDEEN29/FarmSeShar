import React from "react";
import { cn } from "@/lib/utils";
import Container from "../container/Container";
interface FooterCopyrightProps {
  text?: string;
  className?: string;
}
const FooterCopyright: React.FC<FooterCopyrightProps> = ({
  text = "© 2025 FarmSeGhar. All rights reserved.",
  className,
}) => {
  return (
    <div className={cn("py-6", className)}>
      <Container>
        <p className="text-sm text-gray-400 text-center">{text}</p>
      </Container>
    </div>
  );
};
export default FooterCopyright;
