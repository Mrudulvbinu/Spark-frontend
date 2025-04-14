import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import vid1 from "/assets/vid1.mp4";
import logo from "/assets/sparkventure.svg";
import axiosInstance from "/axiosinstance";
import Header from "/components/header.jsx";

const Regist = () => {
  const [name1, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState("student");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
    const regContainer = document.getElementById("registration-container");
    if (regContainer) {
      regContainer.classList.add("opacity-0", "translate-y-20");
      setTimeout(() => {
        regContainer.classList.remove("opacity-0", "translate-y-20");
        regContainer.classList.add(
          "transition-all",
          "duration-1000",
          "opacity-100",
          "translate-y-0"
        );
      }, 700);
    }
  }, []);


  const password_validate = (p) => {
    return /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[@$%&*!^()#]/.test(p) && p.length >= 8;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUserTypeChange = (type) => {
    // Clear all form fields when switching types
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setAddress("");
    setErrorMessage("");
    setSuccessMessage("");
    setShowPassword(false);
    setUserType(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!password_validate(password)) {
      setErrorMessage("Password must have at least 8 characters, should include uppercase, lower case, special characters, and numbers.");
      return;
    }

    const userData = {
      name: name1,
      email: email,
      username: username,
      password: password,
      userType: userType,
      address: address,
    };

    try {
      const endpoint = userType === "student" ? "/user/register/student" : "/user/register/organizer";
      const response = await axiosInstance.post(endpoint, userData);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${vid1})` }}>
      <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline>
        <source src={vid1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-2 flex flex-col items-center justify-center w-full text-center px-4 py-6 sm:px-8 sm:py-10">
        <div className="w-full">
          <Header />
        </div>

        <div id="registration-container" className="relative z-20 w-full max-w-xs md:max-w-sm px-6 py-8 bg-white rounded-lg shadow-xl transition-all">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-rose-600 to-orange-400 bg-clip-text text-transparent mb-3">
              {userType === "student" ? "Student Registration" : "Organizer Registration"}
            </h1>
            <div className="text-center mb-2">
              <button
                type="button"
                onClick={() => handleUserTypeChange("student")}
                className={`px-2 py-2 mr-4 ${userType === "student" ? "text-black font-semibold" : "text-gray-700"}`}
              >
                Student
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => handleUserTypeChange("organizer")}
                className={`px-4 py-2 ml-4 ${userType === "organizer" ? "text-black font-semibold" : "text-gray-700"}`}
              >
                Organizer
              </button>
            </div>

            <div className="space-x-4 flex items-center">
              <label className="w-1/3 text-lg font-semibold text-gray-700" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-2/3 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>

            <div className="space-x-4 flex items-center">
              <label className="w-1/3 text-lg font-semibold text-gray-700" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-2/3 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-lg font-semibold text-gray-700 w-1/3" htmlFor="password">Password</label>
              <div className="relative w-2/3">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10 10 0 0112 20c-5 0-9.27-3.11-11-7.5 1.72-4.39 6-7.5 11-7.5a10 10 0 015.94 2.06"/>
                      <path d="M3 3l18 18"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {userType === "organizer" && (
              <div className="space-x-4 flex items-center">
                <label className="w-1/3 text-lg font-semibold text-gray-700" htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="w-2/3 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
            )}

            {errorMessage && <div className="text-red-500 text-center mt-2">{errorMessage}</div>}

            {successMessage && <div className="text-green-600 text-lg text-center mt-2 font-bold">{successMessage}</div>}

            <div className="text-center">
              <button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-rose-600 text-white py-3 px-6 rounded-lg font-bold text-lg cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-105">
                {userType === "student" ? "Register Student" : "Register Organizer"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <img src={logo} alt="Logo" className="absolute bottom-5 right-5 w-45 h-auto" />      
    </div>
  );
};

export default Regist;