import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice.js';



const SignUp = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [passError, setPassError] = useState("");


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                const response = await axios.post("users/register", formData);
                // console.log(response);
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
                    console.log("Failed to register:", response.data);
                }
            }
        } catch (error){
            console.log("Signup Error in signup.jsx:", error);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Create an Account</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        placeholder="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
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
                        Sign Up
                    </button>
                </form>
                <p className="text-gray-600 mt-4">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
