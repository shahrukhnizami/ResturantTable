import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetUserDataQuery } from '../../redux/api/commonApi';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/ColorContext';
import axios from 'axios';
import { BASE_URL, config } from '../../context';



const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const {colors}= useColors();
  

  // const logouts = () => {
  //     logout();
  //     navigate('/login');
  // };


      const logouts = async () => {
          try {
              const response = await axios.post(`${BASE_URL}/user/logout`, {}, config(user?.accessToken));
              if(response.status === 200 || response.status === 201) {
                  logout()
                  navigate('/');
              }
          } catch (error) {
              console.error('Logout error:', error);
          }
      };

  // Fetch user data
  // const user = JSON.parse(localStorage.getItem('user'));
  // const { data: userData } = useGetUserDataQuery(user?.accessToken);
    const { data: userData} = useGetUserDataQuery(user?.accessToken);
  
    // console.log('userDataHeader',userData );

  // State to store user profile data
  const [profileData, setProfileData] = useState({
    name: 'TEAM GAMMA',
    email: 'Teamgamma@example.com',
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjxq6NJzoC0tZU1-AlOwCjVYTNe1Zj6NHkUJwAcJzv_nQTWGi3KBCj1OQsx2F1vVVDszo&usqp=CAU",
  });

  // Update profile data when userData is fetched
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.data.username || 'TEAM GAMMA',
        email: userData.data.email || 'Teamgamma@example.com',
        image: userData.data.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjxq6NJzoC0tZU1-AlOwCjVYTNe1Zj6NHkUJwAcJzv_nQTWGi3KBCj1OQsx2F1vVVDszo&usqp=CAU",
      });
    }
  }, [userData]);


  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
// console.log("ProfileHeader",profileData);

  return (
    <header className="bg-amber-500 border border-gray-200 relative">
      <div style={{ background: colors.primary }}  className="flex items-center justify-between p-4">
        {/* Welcome Heading */}
        <h1 className="text-xl capitalize font-semibold text-white">Welcome, {profileData.name}</h1>

        {/* Notification & Profile */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* <button className="relative sm:default">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button> */}

          {/* Profile with Name and Dropdown */}
          <div className="relative flex items-center gap-2">
            <img
              src={profileData.image}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover border-black border-1"
            />
            <div className="hidden sm:block text-left">
              <p className="font-medium capitalize text-white">{profileData.name}</p>
              <p className="text-sm text-white">Restaurant Manager</p>
            </div>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="focus:outline-none px-2 bg-white cursor-pointer py-1 rounded-lg hover:bg-white  "
            >
              <ChevronDown className="w-5 h-5 text-[#1E3A8A] " />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-40 w-48 bg-white border  border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => navigate('profile')}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-t-lg flex items-center gap-2"
                >
                  <Users className="w-5 h-5" /> Profile
                </button>
               
                <button
                  onClick={logouts}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-b-lg flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;