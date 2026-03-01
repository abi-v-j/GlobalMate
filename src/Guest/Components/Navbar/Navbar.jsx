import React from 'react'
import { Link } from 'react-router'


const Navbar = () => {
  return (
    <>
    <div>
        <div><Link to='/userregistration'>User Registration</Link></div>
        <div><Link to='/login'>Login</Link></div>

    </div>
    </>
  )
}

export default Navbar