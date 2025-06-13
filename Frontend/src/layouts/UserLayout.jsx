import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

const UserLayout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const location = useLocation()
  
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user]);

  // console.log(location.pathname, 'location path')

  return (
   <>
    {
        location.pathname !== '/login' && (
          <Header/>
        )
    }
      <main>
     
      <Outlet/>
      
      </main>

      {
        location.pathname !== '/login' && (
          <Footer/>
        )
      }


      </>
   
  )
}

export default UserLayout
