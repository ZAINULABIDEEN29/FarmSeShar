import React from "react";
import { Menu, ShoppingCart, X, User } from "lucide-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
  const navigate = useNavigate();
  const { user, farmer, isAuthenticated, userType } = useAppSelector(
    (state) => state.auth
  );
  const logoutUserMutation = useLogoutUser();
  const logoutFarmerMutation = useLogoutFarmer();
  const isFarmerLoggedIn = isAuthenticated && userType === "farmer";
  const getUserName = (): string | undefined => {
    if (user && user.fullName) {
      const { firstName, lastName } = user.fullName;
      return `${firstName} ${lastName}`.trim();
    }
    if (farmer && farmer.fullName) {
      const { firstName, lastName } = farmer.fullName;
      return `${firstName} ${lastName}`.trim();
    }
    return undefined;
  };
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
              <div className="hidden sm:flex items-center gap-3">
                <AccountCart
                  cartCount={cartCount}
                  onAccountClick={onAccountClick}
                  onCartClick={onCartClick}
                  onLogout={handleLogout}
                  onDashboardClick={() => navigate("/farmer-dashboard")}
                  userName={getUserName()}
                  isLoggedIn={isAuthenticated}
                  isFarmer={isFarmerLoggedIn}
                />
              </div>
              {/* Mobile account and cart buttons */}
              <div className="flex items-center gap-2 sm:hidden">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-purple-600"
                    aria-label="Account menu"
                  >
                    <User className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAccountClick}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-purple-600"
                    aria-label="Account"
                  >
                    <User className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-purple-600"
                  onClick={onCartClick}
                  aria-label="View cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs font-medium flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            <TopInfoBar className="flex items-center justify-center text-sm font-medium text-gray-500 lg:hidden" />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3 lg:gap-6">
              <NavMenu className="md:flex-1 md:min-w-0 md:max-w-none" />
              <div className="w-full md:w-auto md:shrink-0 md:ml-auto">
                <SearchBar
                  onSearch={onSearch}
                  className="w-full md:w-[220px] lg:w-[380px] xl:w-[420px]"
                  inputClassName="w-full"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white">
          <Container>
            <nav className="flex flex-col gap-1 py-3">
              {/* Account section for mobile */}
              {isAuthenticated ? (
                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {getUserName() || "Account"}
                  </p>
                  <div className="flex flex-col gap-2">
                    {isFarmerLoggedIn && (
                      <button
                        onClick={() => {
                          navigate("/farmer-dashboard");
                          handleMobileNavClick();
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                      >
                        <span>Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        handleMobileNavClick();
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAccountClick?.();
                    handleMobileNavClick();
                  }}
                  className="rounded-full hidden px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200 text-left"
                >
                  Account
                </button>
              )}
              {NAV_ITEMS.map((item) => (
                <RouterLink
                  key={item.path}
                  to={item.path}
                  onClick={handleMobileNavClick}
                  className="rounded-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200"
                >
                  {item.label}
                </RouterLink>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};
export default Header;
