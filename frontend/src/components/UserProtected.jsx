import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserAuth, login } from "../store/authSlice.js";

function UserProtected({ children, authentication = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const authStatus = useSelector(selectUserAuth);

  useEffect(() => {
    // Check localStorage for user data
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      // If we have user data in localStorage but not in Redux state, restore it
      if (!authStatus) {
        dispatch(login({
          user: JSON.parse(user),
          accessToken: token
        }));
      }
    }

    if (authentication && !authStatus) {
      navigate('/login');
    } else if (!authentication && authStatus) {
      navigate('/');
    }
    
    setIsLoading(false);
  }, [authStatus, navigate, authentication, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default UserProtected;