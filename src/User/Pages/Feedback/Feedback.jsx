import React, { useState } from "react";
import style from "./Feedback.module.css"
import supabase from "../../../global/Supabase";
const Feedback = () => {
    
    const [addFeedback,setAddFeedback] = useState("")

   const handleSubmit = async () => {
        const { error } = await supabase
        .from('tbl_feedback')
        .insert({ feedback_content: addFeedback })  
      }
  return (
   <>
   {addFeedback}
    <table border='2'>
        <tr>
            <th colSpan='2'>Add Feedback</th>
        </tr>
        <tr>
            <th>Content</th>
             <th><textarea onChange={(e) => setAddFeedback(e.target.value)}/></th>
        </tr>
        
        <tr ><div className={style.Feedback}>
            <td><input type="button" value="SUBMIT" onClick={handleSubmit}/></td>
            <td><input type="button" value="CANCEL" /></td>
            </div>
        </tr>
        
    </table>
    
     <table border="2">
                <tr>
                    <th>SL NO</th>
                    <th>Content</th>
                    <th>Action</th>
                </tr>
                <tr>
                </tr>
     </table>
   
   
   </>
  )
}

export default Feedback