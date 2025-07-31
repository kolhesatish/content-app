import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/instagram", label: "Instagram" },
    { path: "/linkedin", label: "LinkedIn" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
            <span className="text-xl font-bold gradient-text">ContentCraft</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link text-gray-300 hover:text-white transition-colors ${
                  location === item.path ? "active text-primary" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button className="gradient-bg px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
          
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-card border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    location === item.path
                      ? "text-primary"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button className="w-full mt-4 gradient-bg px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
