// src/components/MyProfile.jsx
import React, { useEffect, useState } from 'react';
import supabase from '../../../global/Supabase';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const uid = sessionStorage.getItem('uid');
      if (!uid) return;

const { data, error } = await supabase
  .from('tbl_student')
  .select('student_name, student_email, student_photo')
  .eq('auth_uid', uid) // CHANGE THIS if needed
  .maybeSingle();

if (error) {
  console.error('Supabase error:', error);
  return;
}

if (!data) return;

setProfile(data);





      /*  joined select: users → places → districts  */
 
    })();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h3>My Profile</h3>
      <table border="1" cellPadding="8">
        <tbody>
          <tr>
            <td>Photo</td>
            <td>
              {profile.student_photo ? (
         <img src={profile.student_photo_url} alt="user" width="120" />

              ) : (
                <span>No photo</span>
              )}
            </td>
          </tr>
          <tr><td>Name</td><td>{profile.student_name}</td></tr>
          <tr><td>Email</td><td>{profile.student_email}</td></tr>
         
        </tbody>
      </table>
    </div>
  );
};

export default MyProfile;