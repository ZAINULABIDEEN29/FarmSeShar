import React from "react";
import Container from "../container/Container";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import SearchBar from "./SearchBar";
import AccountCart from "./AccountCart";
import TopInfoBar from "./TopInfoBar";

interface HeaderProps {
  cartCount?: number;
  onSearch?: (value: string) => void;
  onAccountClick?: () => void;
  onCartClick?: () => void;
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  onSearch,
  onAccountClick,
  onCartClick,
  onLogoClick,
}) => {
  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* Top Information Bar - Light Gray Background */}
      <div className="w-full bg-white ">
        <Container>
          <div className="flex items-center justify-between py-2.5">
            <TopInfoBar className="hidden sm:flex" />
            <div className="sm:ml-auto">
              <AccountCart
                cartCount={cartCount}
                onAccountClick={onAccountClick}
                onCartClick={onCartClick}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar - White Background */}
      <div className="w-full bg-white">
        <Container>
          <div className="flex items-center gap-4 md:gap-6 py-4">
            {/* Left: Logo */}
            <Logo onClick={onLogoClick} className="shrink-0" />

            {/* Center: Navigation Menu - Hidden on mobile, visible on md+ */}
            <div className="flex-1 flex justify-center">
              <NavMenu />
            </div>

            {/* Right: Search Bar */}
            <div className="flex items-center shrink-0">
              <SearchBar onSearch={onSearch} />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;

