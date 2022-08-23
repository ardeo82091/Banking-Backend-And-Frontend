import React, { useState,useEffect} from "react";
import axios from "axios";
import {useParams,useNavigate } from "react-router-dom";
import Navigation from '../navigation/navigation.js'
function CreateBank() 
{
    const roleOfBanker = "banker"
    const userNameofBanker = useParams().userName;
    const [bankname,updateBankName] = useState("");
    const [bankAbbrevation,updateBankAbbrevation] = useState("");
    const [loginStatus, updateloginStatus] = useState("")
    const [StatusOfUser,updateStatusOfUser] = useState("");
    
    let navigate = new useNavigate();
    const navToLogin = () => {
        navigate('/');
      };

      useEffect(() => {
        axios.post("http://localhost:8082/api/v1/isBankerLogin",{})
          .then((resp) => {
            updateloginStatus(true);
          })
          .catch((error) => {
            updateloginStatus(false);
          });
    }, []);

    const handleMySubmit = async (e) => {
            e.preventDefault();
            
            await axios.post("http://localhost:8082/api/v1/createBank",{bankname,bankAbbrevation})
            .then((resp)=>{
                alert("Successfully Created");
                console.log(resp)
                updateStatusOfUser("Created");
            })
            .catch((error)=>{
                alert(`Error ${error.response.data}`);
                updateStatusOfUser(error.response.message);
            })            
    }
    if (loginStatus === false) {
        console.log(loginStatus)
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
        )
    }
    else {
        return (
            <div>
                <div >
                    <Navigation userName={userNameofBanker} role={roleOfBanker} />
                </div> 
                    <div className="container">
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: "tomato" }}>
                            <h5 style={{"textAlign": "center"}}>CREATE BANK</h5>
                            </div>
                            <div className="card-body" style={{ backgroundColor: "CadetBlue" }}>
                                <form onSubmit={handleMySubmit}>
                                    <label  className="form-group">BankName :</label>
                                    <input type= "text" className="form-control" value = {bankname}
                                    onChange={(e) => updateBankName(e.target.value)} ></input><br />
                                    <label  className="form-group">BankAbbrevation :</label>
                                    <input type= "text" className="form-control" value = {bankAbbrevation}
                                    onChange={(e) => updateBankAbbrevation(e.target.value)} ></input><br />
                                    
                                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "DarkSLateGray" }}>Create Bank</button><br />
                                    {StatusOfUser}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

}
export default CreateBank