import React from 'react'

import Login from '../Guest/Pages/Login/Login'
import { Route, Routes } from 'react-router'
import Registration from '../Guest/Pages/UserRegistration/Registration'

const GuestRouters = () => {
  return (
  
    <Routes>
      <Route path="userregistration" element={<Registration />} />
      <Route path="" element={<Login />} />
      </Routes>
  
  )
}

export default GuestRouters