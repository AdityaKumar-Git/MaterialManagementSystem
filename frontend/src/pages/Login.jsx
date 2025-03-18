import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import axios from "../axios.js";

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        phoneNumber: "",
        password: ""
    });

    const [passError, setPassError] = useState("");

    const handleUsername = (e) => {
        const username = e.target.value;
        
        setFormData((prev) => ({
            ...prev,
            email: (isValidEmail(username))? username : "",
            phoneNumber: (isValidPhoneNumber(username)) ? username : ""
        }))
    };

    const handlePassword = (e) => {
        const pass = e.target.value;
        if (pass.length < 8) {
            setPassError("Password must be at least 8 characters");
        }
        else{
            setPassError("");
            setFormData({...formData, password: pass});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(passError !== ""){
                console.log("Wrong Pass:", formData);
            }
            else{
                // console.log("Correct Pass:", formData);
                
                const response = await axios.post("users/login", formData)
                .catch(error => {
                    console.log("Axios caught error:", error);
                    // throw error; // Re-throw the error so it reaches catch block
                });
                

                console.log(response);
                if (response?.data?.success) {
                    dispatch(
                      login({
                        user: response.data.user,
                        accessToken: response.data.token,
                      })
                    );
                    console.log(response?.data?.message);
                    navigate('/');
                }
                else{
                    console.log("Failed to Login:", response.data);
                }
            }
        } catch (error){
            console.log("Login Error in Login.jsx:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Sign In</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Email Address or Phone Number" 
                        // value={formData.email} 
                        onChange={handleUsername} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        // value={formData.password} 
                        onChange={handlePassword} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    {
                        passError && <div>
                            <p className="text-red-500 text-sm">{passError}</p>
                        </div>
                    }
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700">
                        Login
                    </button>
                </form>
                <p className="text-gray-600 mt-4">
                    Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
