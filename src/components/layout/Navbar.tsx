
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  ClipboardList, 
  Settings,
  Menu,
  X,
  LogIn,
  User,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          // Fetch the user profile
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) throw error;
            setUserProfile(data);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        // Fetch the user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
              return;
            }
            
            setUserProfile(data);
          });
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format role for display
  const formatRole = (role: string) => {
    if (!role) return '';
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={16} />
                  <span className="max-w-[100px] truncate">
                    {userProfile?.first_name || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{userProfile?.first_name} {userProfile?.last_name}</span>
                    <span className="text-xs text-muted-foreground">{formatRole(userProfile?.role)}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            {isAuthenticated && userProfile && (
              <div className="p-3 border border-border rounded-md mb-2">
                <div className="font-medium">{userProfile?.first_name} {userProfile?.last_name}</div>
                <div className="text-sm text-muted-foreground">{formatRole(userProfile?.role)}</div>
              </div>
            )}
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
                  <LogOut size={18} className="mr-2" />
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
