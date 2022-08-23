import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../navigation/navigation";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


function AllAccount1() {
    const User = useParams().user
    const UserName = useParams().userName
    const [allAccount, updateallAccount] = useState({});
    const [pageNumber, updatePageNumber] = useState(1);
    const [limit, updateLimit] = useState(5);
    const [loginStatus, updateloginStatus] = useState("")
    const [allAccountCount, updateallAccountCount] = useState(0);
    let navigate = new useNavigate();
    const navToLogin = () => {
      navigate('/');
    };

    function getNumberOfBanks() {
      axios
        .get(`http://localhost:8082/api/v1/numberOfAccounts/${UserName}`)
        .then((resp) => {
          updateallAccountCount(parseInt(resp.data));
        })
        .catch((error) => {});
    }

    useEffect(() => {
      axios.post(`http://localhost:8082/api/v1/isBankerLogin`,{})
        .then((resp) => {
          updateloginStatus(true);
        })
        .catch((error) => {
          updateloginStatus(false);
        });
        getBank();
        getNumberOfBanks();
    }, [pageNumber, limit, allAccount]);
  
    function getBank(){
      axios
        .post(`http://localhost:8082/api/v1/UserAllAccount/${UserName}`, { limit, pageNumber })
        .then((resp) => {
          updateallAccount(resp.data);
          updateloginStatus(true);
        })
        .catch((error) => {
        });
      }
    
    let rowOfUser;
    if (allAccount != null) {
      let index=0;
        rowOfUser = Object.values(allAccount).map((u) => {
          index+=1;
            return (
              <tr id={u.bankId} style ={{background : "CadetBlue"}}>
                <td>{index}</td>
                <td>{u.bankAbbrevation}</td>
                <td>{u.balance}</td>
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
                  count={Math.ceil(allAccountCount/limit)}
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
                  <th scope="col">Bank Abbrevation</th>
                  <th scope="col">balance</th>
                </tr>
              </thead>
              <tbody>{rowOfUser}</tbody>
            </table>
          </div>
        </>
      );
}
export default AllAccount1;