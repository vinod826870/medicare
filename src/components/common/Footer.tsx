import { Link } from "react-router-dom";
import { Pill, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 xl:px-6">
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">MediCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted online pharmacy for quality medicines and healthcare products. 
              Committed to providing safe, affordable, and convenient healthcare solutions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/medicines" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Browse Medicines
              </Link>
              <Link to="/wishlist" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                My Wishlist
              </Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shopping Cart
              </Link>
              <Link to="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                My Orders
              </Link>
              <Link to="/reminders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Medicine Reminders
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              <Link to="/medicines?category=prescription" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Prescription Medicines
              </Link>
              <Link to="/medicines?category=otc" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Over-the-Counter
              </Link>
              <Link to="/medicines?category=supplements" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Health Supplements
              </Link>
              <Link to="/medicines?category=personal-care" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Personal Care
              </Link>
              <Link to="/medicines?category=devices" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Medical Devices
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Health Blog
              </Link>
              <Link to="/calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Health Calculator
              </Link>
              <Link to="/compare" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Compare Medicines
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Support
              </Link>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                My Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col @md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {currentYear} MediCare Online Pharmacy
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@medicare.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-MEDICARE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
