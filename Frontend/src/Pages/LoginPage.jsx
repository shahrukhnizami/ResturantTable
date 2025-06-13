import { useState } from "react";
import { Droplet, Mail, Lock, EyeOff, Eye, Fullscreen } from "lucide-react";
import React from "react";
import LoginForm from "../components/Login/LoginForm";
import { useColors } from "../context/ColorContext";
import loginimg from "../assets/free-photo-of-outdoor-cafe-chairs-and-tables-in-spain.jpeg"
// import LoginForm from "./loginForm";

function LoginPage() {
   const {colors}= useColors();
  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left side - Image and Info */}
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br  to-[#1E3A8A]/80 z-10" />
              <img
                src={loginimg}
                alt="Smart Table Restaurant Management"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-20 p-8 h-full flex flex-col justify-between text-white">
                <div  className="flex w-full  justify-center h-full items-center gap-2">
                  <Fullscreen className="w-full h-full " />
                  {/* <span className="text-xl font-bold">SMRT</span> */}
                </div>
                <div   className="space-y-4">
                  <h2 className="text-2xl font-bold">Welcome Smart Table Restaurant Management</h2>
                  <p   className="text-white/90">
                  Access your restaurant dashboard.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <h3 className="font-semibold">15M+</h3>
                      <p className="text-sm text-white/80">
                      Restaurant
                      </p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <h3 className="font-semibold">24/7</h3>
                      <p  className="text-sm text-white/80">Support Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 style={{color :colors.primary}} className="text-2xl font-bold text-gray-900">
                    Welcome Restaurant
                  </h1>
                  <p className="text-sm text-gray-600 mt-2">
                  Access your restaurant dashboard
                  </p>
                </div>
                <LoginForm/>
                

                <div style={{background :colors.primary}} className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Account Features
                  </h3>
                  <ul className="text-sm text-white space-y-1">
                    <li>• View your restaurant history</li>
                    <li>• Schedule and manage appointments</li>
                    <li>• Access your restaurant records</li>
                    {/* <li>• Get personalized donation reminders</li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;