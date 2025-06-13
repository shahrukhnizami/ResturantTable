import React from 'react';
import { useGetSidebarDataQuery } from '../../../redux/api/commonApi';
import { useAuth } from '../../../context/AuthContext';

const HomeTab = () => {
  const { user } = useAuth();
  const { data: restaurantData } = useGetSidebarDataQuery(user?.accessToken);

  if (restaurantData && restaurantData.data && restaurantData.data.length > 0) {
    console.log('All Restaurant Data:', restaurantData);
    console.log('Restaurant Name:', restaurantData.data[0].restaurantName);
  } else {
    console.log('No restaurant data found.');
  }

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Kababjees</h2>
        <p className="text-gray-600">
          Kababjees is your go-to destination for delicious food and a cozy dining experience. We pride ourselves on
          serving fresh, high-quality meals in a warm and welcoming atmosphere.
        </p>
      </div>
    </>
  );
};

export default HomeTab;