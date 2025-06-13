// import React, { useEffect, useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// // import Sidebar from '../components/admin/Sidebar';

// import Header from '../components/admin/Header';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'

// function AdminLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
// }, [user, navigate]);

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Sidebar */}
//       {/* <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /> */}
//       <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}  />

//       {/* Main Content */}
//       <div
//         className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
//           isSidebarOpen ? 'ml-64' : 'ml-16'
//         }`}
//       >
//         {/* Header */}
//         <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

//         {/* Page Content */}
//         <main className="p-4 sm:p-6 bg-gray-100 flex-1 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;


import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/admin/Header';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();


  return user ? (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 sm:p-6 bg-white flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  ) : null;
}

export default AdminLayout;
