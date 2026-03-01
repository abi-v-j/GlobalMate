import React, { useState } from 'react'
const Reply = () => {
    const [replyContent,setReplyContent] = useState("")
     const handleSubmit = () => {
        console.log(replyContent)
    }
  return (
    <>
    {replyContent}
     <table border='2'>
        <tr>
            <th colSpan='2'>Title</th>
        </tr>
        <tr>
            <th>Content</th>
        <textarea name="content" id="content" onChange={(e) => setReplyContent(e.target.value) }></textarea>
        </tr>
        <tr>
            <th>Reply</th>
            <textarea name="reply" id="reply"></textarea>
        </tr>
        <tr>
            <td colSpan='2'><input type='submit' value='SUBMIT' onClick={handleSubmit}/></td>
        </tr>
     </table>
    </>
  )
}

export default Reply