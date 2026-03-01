

import React from 'react'

const EditProfile = () => {
  return (
     <>
    <table border='2'>
        <tr>
            <th colSpan='2'>Edit Profile</th>
        </tr>
        <tr>
            <th>Name</th>
            <th><input type="txt"/></th>
        </tr>
        <tr>
            <th>Email</th>
            <th><input type="txt"/></th>
        </tr>
        <tr>
            <th>Contact</th>
            <th><input type="txt"/></th>
        </tr>
        <tr>
            <th>Address</th>
            <th><textarea name="adrs"></textarea></th>
        </tr>
        <tr>
            <th>Country</th>
            <th><input type="txt"/></th>
        </tr>
        <tr>
            <td colSpan='2' align='center'><input type="button" value="EDIT"/></td>
        </tr>
    </table>
    </>
  )
}

export default EditProfile