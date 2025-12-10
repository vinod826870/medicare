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
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shopping Cart
              </Link>
              <Link to="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                My Orders
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Prescription Medicines</span>
              <span className="text-sm text-muted-foreground">Over-the-Counter</span>
              <span className="text-sm text-muted-foreground">Health Supplements</span>
              <span className="text-sm text-muted-foreground">Personal Care</span>
              <span className="text-sm text-muted-foreground">Medical Devices</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">support@medicare.com</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">1-800-MEDICARE</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Available 24/7 for your healthcare needs
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {currentYear} MediCare Online Pharmacy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
