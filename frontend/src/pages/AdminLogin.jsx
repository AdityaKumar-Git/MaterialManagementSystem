import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/adminSlice.js";
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

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        phoneNumber: "",
        password: ""
    });

    const [passError, setPassError] = useState("");
    const [loginError, setLoginError] = useState("");

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
        setLoginError("");
        
        try {
            if(passError !== ""){
                console.log("Wrong Pass:", formData);
                return;
            }

            const response = await axios.post("admins/login", formData);
            console.log("Login response:", response);

            if (response?.data?.data) {
                const { admin, accessToken } = response.data.data;
                
                if (!admin || !accessToken) {
                    setLoginError("Invalid response from server");
                    return;
                }

                dispatch(login({
                    admin,
                    accessToken
                }));

                console.log("Login successful");
                navigate('/adminHome');
            } else {
                setLoginError("Invalid response from server");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setLoginError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4"><p className=" text-red-600 inline">Admin </p>Sign In</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Email Address or Phone Number" 
                        onChange={handleUsername} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handlePassword} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    {passError && (
                        <p className="text-red-500 text-sm">{passError}</p>
                    )}
                    {loginError && (
                        <p className="text-red-500 text-sm">{loginError}</p>
                    )}
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700">
                        Login
                    </button>
                </form>
                <p className="text-gray-600 mt-4">
                    Login as User? <Link to="/login" className="text-blue-600 hover:underline">Click Here</Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
