import React from "react";
import style from "./ManageExpense.module.css";

const ManageExpense = () => {
  return (
    <div className={style.Page}>

      {/* Animated Background */}
      <div className={style.AnimatedBackground}>
        <span></span><span></span><span></span>
        <span></span><span></span>
      </div>

      {/* Card */}
      <div className={style.Card}>
        <h2 className={style.Title}>Expense</h2>

        <div className={style.Group}>
          <label>Amount</label>
          <input type="text" />
        </div>

        <div className={style.Group}>
          <label>Date</label>
          <input type="date" />
        </div>

        <div className={style.Group}>
          <label>Category</label>
          <select>
            <option>--select--</option>
          </select>
        </div>

        <button className={style.Button}>SAVE</button>
      </div>

    </div>
  );
};

export default ManageExpense;