import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Header = () => (
  <div className="bg-gray-500 text-white py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">KFC</h1>
      <p className="mt-2 text-lg">Delicious food, cozy atmosphere</p>
    </div>
  </div>
);

const Tabs = ({ tabs, activeTab, onTabClick }) => (
  <div className="flex gap-4  ">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabClick(tab)}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === tab.id
            ? 'border-b-2 border-amber-500 text-amber-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const Kfc = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', link: '/admin/kfc' }, // Matches the index route
    { id: 'contact', label: 'Contact', link: '/admin/kfc/contact' },
    { id: 'branches', label: 'Branches', link: '/admin/kfc/branches' },
    { id: 'users', label: 'Users', link: '/admin/kfc/users' },
  ];

  const handleTabClick = (tab) => {
    if(tab.id !== 'tables'){
      navigate(tab.link); // Navigate to the associated route
    }
  };

  const activeTab = tabs.find((tab) => location.pathname.includes(tab.link))?.id || 'home';

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

        <div className="mt-6 bg-white rounded-lg shadow-sm  min-h-[350px]">
          {/* Render nested routes */}
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Kfc;
