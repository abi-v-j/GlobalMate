
const ChangePassword = () => {
  return (
    <>
    <table border='2'>
        <tr>
            <th colSpan='2'>Change Password</th>
        </tr>
        <tr>
            <th>Old Password</th>
            <th><input type="txt"/></th>
        </tr>
        <tr>
            <th>New Password</th>
            <th><input type="txt"/></th>
        </tr>
        <tr>
            <th>Confirm Password</th>
            <th><input type="txt"/></th>
        </tr>
        <tr>
            <td colSpan='2' align='center'><input type="button" value="CHANGE"/></td>
        </tr>
        
    </table>
    </>
  )
}

export default ChangePassword