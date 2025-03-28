
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserProfileDropdown from "./UserProfileDropdown";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redirect authenticated users if they try to access login/register pages
  useEffect(() => {
    const path = window.location.pathname;
    if (isAuthenticated && (path === '/login' || path === '/register')) {
      navigate('/requests');
    }
  }, [isAuthenticated, navigate]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      <div 
        className={`container mx-auto px-4 transition-all duration-300 ${
          scrolled 
            ? "glass dark:glass-dark shadow-md rounded-full max-w-5xl py-2 border-none" 
            : "py-4 bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a6e9fa53-7698-4f06-bf5e-8103cd940032.png" 
              alt="Bridging Gaps Foundation Logo" 
              className={`transition-all duration-300 ${
                scrolled ? "h-12 w-auto" : "h-16 sm:h-20 w-auto"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <NavLinks isAuthenticated={isAuthenticated} />

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && !loading ? (
              <UserProfileDropdown userProfile={userProfile} />
            ) : (!loading && (
              <>
                <Button 
                  variant="outline" 
                  asChild
                  className="rounded-full"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button 
                  asChild
                  className="rounded-full"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        userProfile={userProfile}
        isAuthenticated={isAuthenticated}
      />
    </nav>
  );
};

export default Navbar;
