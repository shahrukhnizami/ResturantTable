import {
    UtensilsCrossed,
    LogOut,
    Coffee,
    BarChart3,
    ChevronRight,
    ChevronLeft,
    Hotel,
    ChevronDown,
    Users,
    BookmarkPlus,
    User,
    GitBranch,
  } from 'lucide-react';
  import React, { useState, useEffect } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';
import { useGetSidebarDataQuery } from '../../redux/api/commonApi';
import * as Icons from "lucide-react"; // Lucide React se sare icons import karlo
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../ColorContext';
import axios from 'axios';
import { BASE_URL, config } from '../../context';

  const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState('');
    const [isRestaurantSubOpen, setIsRestaurantSubOpen] = useState(false);
    const [isSubOpen, setIsSubOpen] = useState(false);
    const [sidebar, setSidebar] = useState([]);
    const [openDropdowns, setOpenDropdowns] = useState({});
     const { user, logout } = useAuth();
     const {colors}= useColors();


const toggleDropdown = (label) => {
  setOpenDropdowns((prev) => ({
    ...prev,
    [label]: !prev[label], // Toggle the clicked dropdown
  }));
};
    console.log(data, 'DATA');

    useEffect(() => {
      if(data){
        setSidebar(data?.siderbar);
      }
    })
    useEffect(() => {
      const currentPath = location.pathname;
      const matchedItem = menuItems.find((item) =>
        item.subItems
          ? item.subItems.some((subItem) => subItem.path === currentPath)
          : item.path === currentPath
      );
  
      if (matchedItem) {
        setActive(
          matchedItem.subItems?.find((sub) => sub.path === currentPath)?.label || matchedItem.label
        );
        if (matchedItem.subItems) setIsRestaurantSubOpen(true);
      }
    }, [location.pathname]);
  
   

        const logouts = async () => {
            try {
                const response = await axios.post(`${BASE_URL}/user/logout`, {}, config(user?.accessToken));
                if(response.status === 200 || response.status === 201) {
                    logout()
                    navigate('/login');
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        };
  
    const menuItems = [
      { icon: <BarChart3 className="w-6 h-6" />, label: 'Dashboard', path: '/admin' },
      { icon: <BookmarkPlus  className="w-6 h-6" />, label: 'Add Restaurants', path: '/admin/add-restaurant' },
      { icon: <GitBranch   className="w-6 h-6" />, label: 'Add Branch', path: '/admin/add-branch' },
      { icon: <Users className="w-6 h-6" />, label: 'Users', path: '/admin/users' },
      {
        icon: <Hotel className="w-6 h-6" />,
        label: 'Restaurants',
        subItems: [
          { label: 'Kababjees', path: '/admin/kababjees' },
          { label: 'KFC', path: '/admin/kfc' },
        ],
      },
      { icon: <User  className="w-6 h-6" />, label: 'Profile', path: '/admin/profile' },
    ];
  
    return (
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 
          transition-all duration-500 ease-in-out ${isOpen ? 'w-64' : 'w-16'}`}
      >
        <div className="p-4 border-b  flex justify-between items-center">
          <div className="flex items-center  gap-3">
            <UtensilsCrossed 
              className={`w-8 h-8 text-amber-600  ${isOpen ? '' : 'mx-auto'}`} 
            />
            {isOpen && (
              <div>
                <h2 className="font-bold text-gray-900">Super Admin</h2>
                <p className="text-sm text-gray-600">Management Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white bg-amber-400 border-1 hover:text-white  rounded-full hover:bg-amber-500"
          >
            {isOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </div>
  
        <nav className="p-2 flex-grow space-y-2">
        {menuItems?.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => setIsRestaurantSubOpen(!isRestaurantSubOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg 
                      ${active === item.label ? 'bg-amber-50 text-amber-600' : 'text-gray-600 hover:bg-gray-50'} 
                      ${isOpen ? '' : 'justify-center'}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {isOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        className={`w-4 h-4 transform ${isRestaurantSubOpen ? 'rotate-180' : 'rotate-0'}`}
                      />
                    )}
                  </button>
                  {isRestaurantSubOpen && (
                    <div className="ml-8 space-y-1 mt-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={() => navigate(subItem.path)}
                          className={`w-full flex items-center px-4 py-2 rounded-lg text-left text-sm 
                            ${active === subItem.label ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'} 
                            ${isOpen ? 'justify-start' : 'hidden'}`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                    ${active === item.label ? 'bg-amber-50 text-amber-600' : 'text-gray-600 hover:bg-gray-50'} 
                    ${isOpen ? 'justify-start' : 'justify-center'}`}
                >
                  {item.icon}
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </button>
              )}
            </div>
          ))}







{/* {sidebar?.map((item, index) => {
  const IconComponent = Icons[item.icon] || Icons["Circle"];
  const isDropdown = item.key === "restaurants"; // ✅ Sirf "restaurants" ke liye dropdown
  
  return (
    <div key={index}>
      <button
        onClick={() => { 
          if(item.key !== "restaurants"){
            navigate(item.path)
          }
          setOpenDropdowns((prev) => ({
          ...prev,
          [item.key]: !prev[item.key],
        }))
        }
      }

        className={`w-full flex cursor-pointer items-center justify-between px-4 py-3 rounded-lg 
          ${active === item.label ? "bg-amber-50 text-amber-600" : "text-gray-600 hover:bg-gray-50"} 
          ${isOpen ? "" : "justify-center"}`}
      >
        <div className="flex items-center gap-3">
          <IconComponent className="w-5 h-5" />
          {isOpen && <span className="font-medium">{item.label}</span>}
        </div>
        {isDropdown && isOpen && (
          <ChevronDown
            className={`w-4 h-4 transform ${openDropdowns[item.key] ? "rotate-180" : "rotate-0"}`}
          />
        )}
      </button>

      {isDropdown && openDropdowns[item.key] && (
        <div className="ml-8 space-y-1 mt-2">
          {item.options?.length > 0 ? (
            item.options.map((subItem, subIndex) => (
              <button
                key={subIndex}
                onClick={() => navigate(subItem.path)}
                className={`w-full flex cursor-pointer items-center px-4 py-2 rounded-lg text-left text-sm 
                  ${active === subItem.label ? "bg-amber-100 text-amber-700" : "text-gray-600 hover:bg-gray-100"} 
                  ${isOpen ? "justify-start" : "hidden"}`}
              >
                {subItem.label}
              </button>
            ))
          ) : (
            <p className="text-gray-500 px-4 py-2 text-sm italic">No Restaurants Available</p>
          )}
        </div>
      )}
    </div>
  );
})} */}

          
        </nav>
  
        <div className="p-4 border-t mt-auto">
          <button
            onClick={logouts}
            className={`w-full cursor-pointer flex items-center gap-3 py-2 rounded-lg 
              text-gray-600 hover:bg-gray-50 ${isOpen ? 'justify-start' : 'justify-center'}`}
          >
            <LogOut className="w-6 h-6" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;