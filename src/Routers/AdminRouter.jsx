import React from "react";
import AdminDashboard from "../Admin/Pages/AdminDashboard/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import ExpenseCategory from "../Admin/Pages/ExpenseCategory/ExpenseCategory";

import AddJob from "../Admin/Pages/AddJob/AddJob";
import JobType from "../Admin/Pages/JobType/JobType";
import ViewFeedback from "../Admin/Pages/Feedback/ViewFeedback";
import Reply from "../Admin/Pages/Reply/Reply";
import ViewComplaint from "../Admin/Pages/ViewComplaint/ViewComplaint";
import Registration from "../Admin/Pages/AdminRegistration/Registration";
import IncomeSource from "../Admin/Pages/IncomeSource/IncomeSource";


const AdminRouter = () => {
    return (

        <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="expcategory" element={<ExpenseCategory />} />
            <Route path="incsource" element={<IncomeSource />} />
            <Route path="addjob" element={<AddJob />} />
            <Route path="jobtype" element={<JobType />} />
            <Route path="feedback" element={<ViewFeedback />} />
            <Route path="reply" element={<Reply />} />
            <Route path="viewcomplaint" element={<ViewComplaint />} />
            <Route path="registration" element={<Registration />} />



        </Routes>
    )
}
export default AdminRouter