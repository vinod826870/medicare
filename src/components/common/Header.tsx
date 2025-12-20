import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Settings, Package, Menu, X, Pill, Heart, ChevronDown, Stethoscope, AlertTriangle, FileText, TrendingDown, LayoutDashboard, Users, BarChart3, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { cartApi } from "@/db/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();

  // Load cart count
  const loadCartCount = () => {
    if (user) {
      cartApi.getCartItems(user.id).then(items => {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      });
    } else {
      setCartCount(0);
    }
  };

  // Load wishlist count
  const loadWishlistCount = () => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        const wishlist = JSON.parse(saved);
        setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
      } catch {
        setWishlistCount(0);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();
    loadWishlistCount();
  }, [user, location.pathname]);

  // Listen for custom events to update counters
  useEffect(() => {
    const handleCartUpdate = () => loadCartCount();
    const handleWishlistUpdate = () => loadWishlistCount();

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Medicines', path: '/medicines' },
    { name: 'Health Blog', path: '/blog' },
    { name: 'Reminders', path: '/reminders' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Compare', path: '/compare' },
  ];

  const toolsMenu = [
    { name: 'Symptom Checker', path: '/symptom-checker', icon: Stethoscope },
    { name: 'Interaction Checker', path: '/interaction-checker', icon: AlertTriangle },
    { name: 'Prescriptions', path: '/prescriptions', icon: FileText },
    { name: 'Find Substitutes', path: '/substitutes', icon: TrendingDown },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 xl:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Pill className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                MediCare
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Tools
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {toolsMenu.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <DropdownMenuItem key={tool.path} asChild>
                        <Link to={tool.path} className="flex items-center gap-2 cursor-pointer">
                          <Icon className="h-4 w-4" />
                          {tool.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Admin Panel
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => navigate('/admin')}>
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/medicines')}>
                            <Pill className="w-4 h-4 mr-2" />
                            Medicines
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/orders')}>
                            <Package className="w-4 h-4 mr-2" />
                            Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                            <Users className="w-4 h-4 mr-2" />
                            Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate('/admin/symptoms')}>
                            <Stethoscope className="w-4 h-4 mr-2" />
                            Symptoms
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/interactions')}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Interactions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/substitutes')}>
                            <TrendingDown className="w-4 h-4 mr-2" />
                            Substitutes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/prescriptions')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Prescriptions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/reviews')}>
                            <Star className="w-4 h-4 mr-2" />
                            Reviews
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate('/admin/blog')}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Blog
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/analytics')}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} size="sm">
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tools
              </div>
              {toolsMenu.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {tool.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
