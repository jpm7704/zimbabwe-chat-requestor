
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  ClipboardList, 
  Settings,
  Menu,
  X,
  LogIn
} from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // For demo purposes - in a real app, this would be handled by a proper auth system
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "py-2 glass dark:glass-dark shadow-sm" 
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold">BGF</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block">BGF Zimbabwe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link to="/chat" className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>Chat</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/requests" className="flex items-center gap-2">
              <ClipboardList size={18} />
              <span>Requests</span>
            </Link>
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass dark:glass-dark animate-fade-in p-4">
          <div className="flex flex-col space-y-3">
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/chat" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <MessageSquare size={18} />
                <span>Chat</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/requests" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <ClipboardList size={18} />
                <span>Requests</span>
              </Link>
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/settings" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
              </Button>
            )}
            <div className="pt-2 border-t border-border">
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign Out
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    asChild
                    className="w-full justify-start"
                  >
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn size={18} className="mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    className="w-full"
                  >
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
