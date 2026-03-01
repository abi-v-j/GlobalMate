import React from "react";
import { Route, Routes } from "react-router";
import AdminHomePage from "../Admin/Pages/AdminHomePage/AdminHomePage";
import UserHomePage from "../User/Pages/UserHomePage/UserHomePage";

import GuestHomePage from "../Guest/Pages/GuestHomePage/GuestHompage";

const MainRouter = () =>{
    return(
        <>
        <Routes>
            <Route path='admin/*' element={<AdminHomePage/>}/>
             <Route path='user/*' element={<UserHomePage/>}/>
             <Route path='/*' element={<GuestHomePage/>}/>
        </Routes>
        </>
    )
}
export default MainRouter