import React from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import Container from "../container/Container";
import Logo from "./Logo";
import NavMenu, { NAV_ITEMS } from "./NavMenu";
import SearchBar from "./SearchBar";
import AccountCart from "./AccountCart";
import TopInfoBar from "./TopInfoBar";
import { useAppSelector } from "@/store/hooks";
import { useLogoutUser, useLogoutFarmer } from "@/hooks/useAuth";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, farmer, isAuthenticated, userType } = useAppSelector(
    (state) => state.auth
  );
  const logoutUserMutation = useLogoutUser();
  const logoutFarmerMutation = useLogoutFarmer();

  // Get user name based on authentication type
  const getUserName = (): string | undefined => {
    if (user && user.fullName) {
      // For users, combine first and last name
      const { firstName, lastName } = user.fullName;
      return `${firstName} ${lastName}`.trim();
    }
    if (farmer && farmer.fullName) {
      // For farmers, combine first and last name
      const { firstName, lastName } = farmer.fullName;
      return `${firstName} ${lastName}`.trim();
    }
    return undefined;
  };

  // Handle logout based on user type
  const handleLogout = () => {
    if (userType === "user") {
      logoutUserMutation.mutate();
    } else if (userType === "farmer") {
      logoutFarmerMutation.mutate();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-gray-100">
        <Container>
          <div className="flex flex-col gap-4 py-4 md:py-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-purple-600 md:hidden"
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
                <Logo onClick={onLogoClick} className="shrink-0" />
              </div>
              <TopInfoBar className="hidden lg:flex flex-1 justify-center text-sm font-medium text-gray-500" />
              <div className="hidden sm:block">
                <AccountCart
                  cartCount={cartCount}
                  onAccountClick={onAccountClick}
                  onCartClick={onCartClick}
                  onLogout={handleLogout}
                  userName={getUserName()}
                  isLoggedIn={isAuthenticated}
                />
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-purple-600 sm:hidden"
                onClick={onCartClick}
                aria-label="View cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="sr-only">Cart items: {cartCount}</span>
                )}
              </button>
            </div>
            <TopInfoBar className="flex items-center justify-center text-sm font-medium text-gray-500 lg:hidden" />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <NavMenu className="md:flex-1" />
              <SearchBar
                onSearch={onSearch}
                className="w-full md:w-auto md:ml-auto"
                inputClassName="w-full md:w-80 lg:w-[420px]"
              />
            </div>
          </div>
        </Container>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white">
          <Container>
            <nav className="flex flex-col gap-1 py-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={handleMobileNavClick}
                  className="rounded-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Header;

