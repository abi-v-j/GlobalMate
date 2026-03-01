
import React from 'react'
import UserRouters from '../../../Routers/UserRouters'
import Navbar from '../../Components/Navbar/Navbar'
import style from './UserHomePage.module.css'


const UserHomePage = () => {
  return (
    <div className={style.Navbar}>
      <div><Navbar/></div>
     
      <div><UserRouters/></div>
    </div>
  )
}
export default UserHomePage