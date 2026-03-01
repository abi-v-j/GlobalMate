import { Card, CardActionArea, CardContent } from '@mui/material'
import React from 'react'
import style from "./ViewFeedback.module.css";


const ViewFeedback = () => {
  return (
    <>

      {/* <table border="2">
                <tr>
                    <th>SL NO</th>
                    <th>Content</th>
                    <th>User Details</th>
                    <th>Action</th>
                </tr>
                <tr>
                </tr>
     </table> */}
     <div className={style.main}>
     <div className={style.card1}>
      <Card
         sx={{
            backgroundColor: "transparent",
            backgroundImage: "linear-gradient(180deg, #0a3250c3, #0A3250)",
            boxShadow: "0 0 20px 5px #909198ff",
            width: "400px",
            color: "white",
            borderRadius:"20px"
            // backdropFilter: "blur(4px)", // optional frosted-glass effect
          }}
      >
        <CardActionArea>
          <CardContent>
            <table border="2" style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>SL NO</th>
                  <th>Content</th>
                  <th>Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              {/* <tbody>
                              {
                                expCategoryData.map((data, index) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{data.Category_name}</td>
                                    <td><button onClick={() => handleDelete(data.id)}>Delete</button></td>
                                  </tr>
                                ))
                              }
            
                            </tbody> */}
            </table>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
    </div>


    </>
  )
}

export default ViewFeedback