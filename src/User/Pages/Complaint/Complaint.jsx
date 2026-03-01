import React, { useState } from 'react'

const Complaint = () => {
    const [complaintContent,setComplaintContent] = useState("")
    const handleSubmit = () => {
        console.log(complaintContent)
    }
  return (
    <>
    {complaintContent}
        <table border='2'>
            <tr>
                <th>Title</th>
                <td><input type="txt" onChange={(e) => setComplaintContent(e.target.value) }/></td>
            </tr>
            <th>Content</th>
            <textarea name="content" id="content"></textarea>
            <tr>
                <td><input type="button" value="SUBMIT" onClick={handleSubmit}/></td>
                <td><input type="button" value="CANCEL"/></td>
            </tr>
        </table>
        <table border='2'>
            <tr>
                <th>SL NO</th>
                <th>Title</th>
                <th>Content</th>
                <th>Action</th>
            </tr>
            <tr>

            </tr>
        </table>
    </>
  )
}

export default Complaint