import { Routes, Route, Navigate } from "react-router-dom";
import ExpenseManager from "../User/Pages/ExpenseManager/ExpenseManager";
import UserDashboard from "../User/Pages/UserDashboard/UserDashboard";
import ManageIncome from "../User/Pages/ManageIncome/ManageIncome";
import ManageExpense from "../User/Pages/ManageExpense/ManageExpense";
import JobPortal from "../User/Pages/JobPortal/JobPortal";

const UserRouters = () => {
  return (
    <Routes>

      <Route path="" element={<UserDashboard />} />
      <Route path="expensemanager" element={<ExpenseManager />} />
      <Route path="expensemanager/manageincome" element={<ManageIncome />} />
      <Route path="manageexpense" element={<ManageExpense />} />
      <Route path="jobportal" element={<JobPortal />} />
    </Routes>
  );
};

export default UserRouters;