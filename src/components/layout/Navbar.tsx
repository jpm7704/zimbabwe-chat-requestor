
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserProfileDropdown from "./UserProfileDropdown";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { isAuthenticated, userProfile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`sticky top-0 z-40 w-full transition-shadow duration-200 ${
      scrolled ? 'bg-background/95 backdrop-blur shadow-sm' : 'bg-background'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">BGF</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavLinks isAuthenticated={isAuthenticated} />
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <NotificationCenter />
              <UserProfileDropdown userProfile={userProfile} />
            </>
          )}
          <MobileMenu 
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            userProfile={userProfile}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
