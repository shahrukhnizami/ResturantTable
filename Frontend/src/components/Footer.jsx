import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Button from './Button';
import { useColors } from '../context/ColorContext';

function Footer() {
   const {colors}= useColors();
  return (
    <footer style={{background :colors.primary}}  className="bg-[#1E3A8A] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-black transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-black transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-black transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white">
                <Mail className="w-5 h-5" />
                <a href="mailto:info@restaurant.com" className="hover:text-black transition-colors">
                  info@restaurant.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white">
                <Phone className="w-5 h-5" />
                <a href="tel:+1234567890" className="hover:text-black transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                <span>123 Culinary Street, Foodville</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button
                type="submit"
                className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-white">
          <p>&copy; {new Date().getFullYear()} Smart Table Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;