import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { AuthProvider, useAuth } from "../context/AuthContext";
import InterceptorWrapper from "../hooks/InterceptorWrapper";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../Pages/LoginPage";
import Dashboard from "../Pages/Dashboard";
import Reservations from "../Pages/admin/Reservations";
import Restaurants from "../Pages/admin/Resturants";
import TableManagement from "../Pages/admin/TableManangement";
import Users from "../Pages/admin/Users";
import Kababjees from "../Pages/admin/Kababjees";
import AddResturant from "../Pages/admin/AddResturant";
import HomeTab from "../components/admin/Tabs/HomeTab";
import ContactsTab from "../components/admin/Tabs/ContactsTab";
import BranchesTab from "../components/admin/Tabs/BranchesTab";
import ProfilePage from "../components/admin/ProfilePage";
import UsersTab from "../components/admin/Tabs/UsersTab";
import AddBranchesForm from "../Pages/admin/AddBranchesForm";
import OurClients from "../Pages/admin/OurClients";
import ResturantDetail from "../components/admin/ResturantDetail";
import AddAdminResturant from "../Pages/admin/AddAdminResturant";
import Branches from "../Pages/admin/Branches";
import Camera from "../Pages/admin/Camera";
import NotFound from "../components/NotFound";

const AppRouter = () => {
  const { user } = useAuth();


  return (
    <AuthProvider>
      <InterceptorWrapper>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={user ? <Navigate to={"/admin"}/> : <LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/admin"
                element={<AdminLayout />}
              >
                <Route index element={<Dashboard />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="table-management" element={<TableManagement />} />
                <Route path="restaurants" element={<Restaurants />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="add-branch" element={<AddBranchesForm />} />
                <Route path="add-admin" element={<AddAdminResturant />} />
                <Route path="ourclients" element={<OurClients />} />
                <Route path="admin-resturant" element={<Users />} />
                <Route path="resturant-detail" element={<ResturantDetail />} />
                <Route
                  path="resturant-detail/branch/:id"
                  element={<Branches />}
                />
                <Route
                  path="resturant-detail/camera/:id"
                  element={<Camera />}
                />
                <Route
                  path="resturant-detail/table/:id"
                  element={<TableManagement />}
                />
                <Route path="add-restaurant" element={<AddResturant />} />

                {/* Nested Routes for Restaurant */}
                <Route path="restaurant/:name/:id" element={<Kababjees />}>
                  <Route index element={<HomeTab />} />
                  <Route path="contact" element={<ContactsTab />} />
                  <Route path="branches" element={<BranchesTab />} />
                  <Route path="users" element={<UsersTab />} />
                  <Route path="resturant-table/:id" element={<TableManagement />} />
                </Route>
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </InterceptorWrapper>
    </AuthProvider>
  );
};

export default AppRouter;