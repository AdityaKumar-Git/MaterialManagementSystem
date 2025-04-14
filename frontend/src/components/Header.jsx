import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import axios from "../axios.js";

import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUserAuth, selectUser } from '../store/authSlice.js';
import { selectAdminAuth, selectAdmin, logout as adminlogout } from "../store/adminSlice.js";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userAuth = useSelector(selectUserAuth);
    const adminAuth = useSelector(selectAdminAuth);
    const user = useSelector(selectUser);
    const admin = useSelector(selectAdmin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-md px-6 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    <img src="../../logo.svg" alt="logo" className=" h-8 mr-2 inline" />
                    HiBuy
                </Link>
                
                <nav className="hidden md:flex gap-6">
                    <Link to={`${adminAuth? "adminHome" : "/"}`} className="text-gray-700 hover:text-blue-600">
                        Home
                    </Link>
                    <Link to="/products" className={`text-gray-700 hover:text-blue-600`}>
                        Products
                    </Link>
                    {/* <Link to="/about" className="text-gray-700 hover:text-blue-600">
                        About
                    </Link> */}
                    <Link to="/contact" className={`text-gray-700 hover:text-blue-600 ${adminAuth ? "hidden" : ""}`}>
                        Contact
                    </Link>
                </nav>

                {/* Profile / Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    {/* <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                        Profile
                    </Link> */}
                    <Link to="/login" className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center ${userAuth || adminAuth ? "hidden" : ""}`}>
                        Login
                    </Link>
                    {/* <Link to="/signup" className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center ${userAuth ? "hidden" : ""}`}>
                        Signup
                    </Link> */}
                    <div className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-center ${userAuth || adminAuth ? "" : "hidden"}`} 
                        onClick={async () => {
                            setIsOpen(false); 
                            if(userAuth) dispatch(logout());
                            if(adminAuth) dispatch(adminlogout());
                            navigate("/")
                        }}>
                            Signout
                        </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md p-4">
                    <nav className="flex flex-col gap-3">
                        <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                            Products
                        </Link>
                        <Link to="/about" className={`text-gray-700 hover:text-blue-600 ${adminAuth ? "hidden" : ""}`} onClick={() => setIsOpen(false)}>
                            About
                        </Link>
                        <Link to="/contact" className={`text-gray-700 hover:text-blue-600 ${adminAuth ? "hidden" : ""}`} onClick={() => setIsOpen(false)}>
                            Contact
                        </Link>
                        <Link to="/login" className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center ${(userAuth || adminAuth) ? "hidden" : ""}`} onClick={() => setIsOpen(false)}>
                            Login
                        </Link>
                        {/* <Link to="/signup" className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center ${userAuth ? "hidden" : ""}`} onClick={() => setIsOpen(false)}>
                            Signup
                        </Link> */}
                        <div className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-center ${(userAuth || adminAuth) ? "" : "hidden"}`} 
                        onClick={async () => {
                            setIsOpen(false); 
                            if(userAuth) dispatch(logout());
                            if(adminAuth) dispatch(adminlogout());
                            navigate("/")
                        }}>
                            Signout
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
