import React, { useEffect, useState } from "react";
import supabase from "../../../global/Supabase";
import styles from "./ManageIncome.module.css";

const ManageIncome = () => {
  const [sources, setSources] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchIncomeSources();
    fetchIncomeList();
  }, []);

  /* ================= FETCH ================= */

  const fetchIncomeSources = async () => {
    const { data } = await supabase
      .from("tbl_incSource")
      .select("id, incSource_name")
      .order("incSource_name");

    setSources(data || []);
  };

  const fetchIncomeList = async () => {
    const { data } = await supabase
      .from("tbl_income")
      .select(`
        id,
        income_amount,
        income_date,
        tbl_incSource ( incSource_name )
      `)
      .order("income_date", { ascending: false });

    setIncomes(data || []);
  };

  /* ================= INSERT / UPDATE ================= */

  const handleSubmit = async () => {
    if (!amount || !date || !sourceId) {
      alert("Fill all fields");
      return;
    }

    if (editId) {
      // UPDATE
      await supabase
        .from("tbl_income")
        .update({
          income_amount: amount,
          income_date: date,
          incomeSource_id: sourceId,
        })
        .eq("id", editId);
    } else {
      // INSERT
      await supabase.from("tbl_income").insert([
        {
          income_amount: amount,
          income_date: date,
          incomeSource_id: sourceId,
        },
      ]);
    }

    resetForm();
    fetchIncomeList();
  };

  /* ================= EDIT ================= */

  const handleEdit = (row) => {
    setEditId(row.id);
    setAmount(row.income_amount);
    setDate(row.income_date);
    setSourceId(row.incomeSource_id);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income?")) return;

    await supabase.from("tbl_income").delete().eq("id", id);
    fetchIncomeList();
  };

  const resetForm = () => {
    setEditId(null);
    setAmount("");
    setDate("");
    setSourceId("");
  };

  return (
  <div className={styles.Page}>

    {/* Animated Background (from UserDashboard) */}
    <div className={styles.AnimatedBackground}>
      <span></span><span></span><span></span>
      <span></span><span></span><span></span>
    </div>

    {/* CONTENT GRID */}
    <div className={styles.Grid}>

      {/* FORM CARD */}
      <div className={styles.Card}>
        <h2 className={styles.Title}>Income</h2>

        <div className={styles.Group}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className={styles.Group}>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.Group}>
          <label>Source</label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
          >
            <option value="">--select--</option>
            {sources.map((src) => (
              <option key={src.id} value={src.id}>
                {src.incSource_name}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.Button} onClick={handleSubmit}>
          {editId ? "UPDATE" : "SUBMIT"}
        </button>
      </div>

      {/* LIST */}
      <div className={styles.ListCard}>
        <h3 className={styles.ListTitle}>Income List</h3>

        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Source</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {incomes.map((row) => (
              <tr key={row.id}>
                <td>{row.income_date}</td>
                <td>₹ {row.income_amount}</td>
                <td>{row.tbl_incSource?.incSource_name}</td>
                <td>
                  <button onClick={() => handleEdit(row)}>Edit</button>
                  <button onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
);
};

export default ManageIncome;