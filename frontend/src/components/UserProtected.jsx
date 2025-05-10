import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserAuth } from "../store/authSlice.js";

function UserProtected({children, authentication=true}){
    const navigate = useNavigate();
    // const [loader, setLoader] = useState(true);
    const authStatus = useSelector(selectUserAuth)
    useEffect(() => {
        if(authentication && authStatus !==  authentication) {
            // console.log("You must login to add products...")
            navigate('/login')
        } 
        else if (!authentication && authStatus !==  authentication){
            navigate('/')
        }else{
            // setLoader(false)
        }
    }, [authStatus, navigate, authentication])


    // return loader ? <h1>Loading...</h1> : <>{children}</>;
    return(
        <>
        {children}
        </>
    )
}

export default UserProtected