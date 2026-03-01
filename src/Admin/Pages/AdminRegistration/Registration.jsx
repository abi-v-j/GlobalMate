// src/components/Registration.jsx
import React, { useState } from "react";
import supabase from "../../../global/Supabase";

const Registration = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // 1) SIGN UP (Auth)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (signUpError) throw signUpError;

      const user = authData?.user;
      if (!user) {
        // Sometimes Supabase requires email confirmation; still user object often exists.
        throw new Error("User not created. Check email confirmation settings.");
      }

      // 2) INSERT INTO tbl_admin
      const { error: dbError } = await supabase.from("tbl_admin").insert([
        {
          id: user.id, // UUID from Auth
          admin_name: fullName.trim(),
          admin_email: email.trim(),

          // ❌ NOT recommended to store password in DB
          // admin_password: password.trim(),
        },
      ]);

      if (dbError) throw dbError;

      alert("Registration successful");

      // reset
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Admin Registration</h3>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter name"
              />
            </td>
          </tr>

          <tr>
            <td>Email</td>
            <td>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </td>
          </tr>

          <tr>
            <td>Password</td>
            <td>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </td>
          </tr>

          <tr>
            <td colSpan="2" align="center">
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Registration;