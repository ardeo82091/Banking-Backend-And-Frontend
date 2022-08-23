import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../navigation/navigation";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


function AllBank() {
    const User = useParams().userName
    const [allBanks, updateallBanks] = useState({});
    const [pageNumber, updatePageNumber] = useState(1);
    const [limit, updateLimit] = useState(5);
    const [loginStatus, updateloginStatus] = useState("")
    const [allBankCount, updateallBankCount] = useState(0);
    let navigate = new useNavigate();
    const navToLogin = () => {
      navigate('/');
    };

    function getNumberOfBanks() {
      axios
        .get("http://localhost:8082/api/v1/numberOfBank")
        .then((resp) => {
          updateallBankCount(parseInt(resp.data));
        })
        .catch((error) => {});
    }

    useEffect(() => {
      axios.post("http://localhost:8082/api/v1/isBankerLogin",{})
        .then((resp) => {
          updateloginStatus(true);
        })
        .catch((error) => {
          updateloginStatus(false);
        });
        getBank();
        getNumberOfBanks();
    }, [pageNumber, limit, allBanks]);
  
    function getBank(){
      axios
        .post(`http://localhost:8082/api/v1/getAllBank/${User}`, { limit, pageNumber })
        .then((resp) => {
          updateallBanks(resp.data);
          updateloginStatus(true);
        })
        .catch((error) => {
        });
      }
    
    let rowOfUser;
    if (allBanks != null) {
      let index=0;
        rowOfUser = Object.values(allBanks).map((u) => {
          index+=1;
            return (
              <tr id={u.bankId} style ={{background : "CadetBlue"}}>
                <td>{index}</td>
                <td>{u.bankname}</td>
                <td>{u.bankAbbrevation}</td>
              </tr>
            );
          });
        }
    if (!loginStatus) {
        return (
          <>
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <p style={{ color: "white", fontSize: "30px" , background : "red"}}>
                User not logged in, Click Below to login :
              </p>
              <button onClick={navToLogin} type="submit" className="btn btn-primary" style={{ backgroundColor: "green" ,fontSize : "30px"}}>Login</button><br />
            </div>
          </>
        );
      }
      return (
        <>
          <NavBar userName={User} role={"banker"} />
          <div>
            <div className="pagination">
              <label className="fw-bold">limit:</label>
              <select
                id="role"
                onChange={(e) => {
                  updateLimit(e.target.value);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="pagination">
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(allBankCount/limit)}
                  color="primary"
                  onChange={(e, value) => updatePageNumber(value)}
                />
              </Stack>
            </div>
          </div>
          <div>
            <table className ="table table-striped">
              <thead style ={{background : "Tomato"}}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Bank Name</th>
                  <th scope="col">Bank Abbrevation</th>
                </tr>
              </thead>
              <tbody>{rowOfUser}</tbody>
            </table>
          </div>
        </>
      );
}
export default AllBank;