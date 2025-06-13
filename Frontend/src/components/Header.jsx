import { Menu, X } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useColors } from '../context/ColorContext';
import Button from './Button';

export default function Header() {

  const {colors}= useColors();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleReserveClick = () => {
    navigate("/");
  };

  const logoclick = () => {
    navigate("/");
  };

  const handleLinkClick = (path) => {
    navigate(path); // Navigate to the given path
    setIsMobileMenuOpen(false); // Close the mobile menu
  };

  return (
    <header style={{background :colors.primary}} className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div onClick={logoclick} className="text-2xl font-bold text-white cursor-pointer">
          <span className="text-white">Smart</span>Table
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-amber-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Menu (Desktop) */}
        <nav className="hidden md:flex space-x-8">
          <button className="text-white cursor-pointer hover:text-[#1E3A8A] hover:bg-white rounded-xl p-2  transition-colors" onClick={() => handleLinkClick("/")}>
            Home
          </button>
          <button className="text-white cursor-pointer hover:text-[#1E3A8A] hover:bg-white rounded-xl p-2 " onClick={() => handleLinkClick("/about")}>
            About
          </button>
          <button className="text-white cursor-pointer hover:text-[#1E3A8A] hover:bg-white rounded-xl p-2 " onClick={() => handleLinkClick("/restaurant-menu")}>
            Menu
          </button>
          <button className="text-white cursor-pointer hover:text-[#1E3A8A] hover:bg-white rounded-xl p-2 " onClick={() => handleLinkClick("/restaurant-contact")}>
            Contact
          </button>
         
        </nav>

        {/* Reserve Table Button */}
        <Button
          onClick={handleReserveClick}
          className="px-6 py-2 cursor-pointer bg-amber-500 hidden self-center md:block   text-white   rounded-full font-semibold hover:bg-amber-600 transition-colors focus:outline-none"
        >
          Sign In
        </Button>

      
</div>
      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col space-y-4 p-4">
            <button className="text-white cursor-pointer hover:text-amber-600 transition-colors" onClick={() => handleLinkClick("/")}>
              Home
            </button>
            <button className="text-white hover:text-amber-600 cursor-pointer transition-colors" onClick={() => handleLinkClick("/about")}>
              About
            </button>
            <button className="text-white hover:text-amber-600 transition-colors cursor-pointer" onClick={() => handleLinkClick("/restaurant-menu")}>
              Menu
            </button>
            <button className="text-white hover:text-amber-600 transition-colors cursor-pointer" onClick={() => handleLinkClick("/restaurant-contact")}>
              Contact
            </button>
            {/* <button className="text-gray-700 hover:text-amber-600 transition-colors" onClick={() => handleLinkClick("/test")}>
              Test
            </button> */}
            <button
              onClick={handleReserveClick}
              className="px-6 py-2 bg-amber-500 md:hidden w-sm cursor-pointer self-center text-white rounded-full font-semibold hover:bg-amber-600 transition-colors focus:outline-none"
            >
              Reserve a Table
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
