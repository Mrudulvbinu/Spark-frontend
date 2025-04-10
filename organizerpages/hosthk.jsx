import React, { useState, useEffect } from "react";
import Headerbar from "/components/headerbar.jsx";
import Navbar from "/components/navbar.jsx";
import Footer from "/components/footer.jsx";
import axiosInstance from "/axiosinstance";
import { useNavigate } from "react-router-dom";


const Hosthk = () => {
    const navigate = useNavigate();
    const [typeofhk, setTypeofhk] = useState('Team Hackathon (offline)');
    const [formData, setFormData] = useState({
        typeofhk: "Team Hackathon (offline)",
        ename: "",
        venue: "",
        date: "",
        regstart: "",
        regend: "",
        details: "",
        durofhk: "",
        prize: "",
        isTeamHackathon: true,
    });

    const [venueLabel, setVenueLabel] = useState("Event Venue");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value,
            isTeamHackathon: (name === "typeofhk" ? value : prev.typeofhk).includes("Team"),         }));

        if (name === "typeofhk") {
            setVenueLabel(value === "Virtual Solo Hackathon (online)" ? "Event Platform" : "Event Venue");
            setTypeofhk(value); 
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication error: No token found. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            console.log(" Sending request with data:", formData);
            const response = await axiosInstance.post("/hackathons/add",formData ,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(response.data.message || "Hackathon added successfully!");

            setFormData({
                typeofhk: "Team Hackathon (offline)", 
                ename: "",
                venue: "",
                date: "",
                regstart: "",
                regend: "",
                details: "",
                durofhk: "",
                prize: "",
                isTeamHackathon: true,
            });
            setVenueLabel("Event Venue");
            setTypeofhk("Team Hackathon (offline)"); 

        } catch (error) {
            console.error(" Error submitting form:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to host hackathon. Please try again.");
        }
    };

    return (
        <div className="relative">

            <Headerbar />
            <Navbar />

            <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-orange-400 to-rose-600 bg-clip-text text-transparent animate-pulse mt-2 mb-0">Host Hackathon</h2>

            <form onSubmit={handleSubmit} className="transform scale-85 bg-white shadow-xl rounded-lg p-8 space-y-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-semibold text-center text-black mb-6">Register Hackathon</h1>

                <div className="flex items-center space-x-4">
    <label className="w-1/3 font-bold text-lg text-gray-700 text-right">Type of Hackathon:</label>
    <select
        id="typeofhk"
        name="typeofhk"
        value={formData.typeofhk}
        onChange={handleChange}
        className="w-2/3 p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        required
    >
        <option value="Team Hackathon (offline)">Team Hackathon (offline)</option>
        <option value="Virtual Solo Hackathon (online)">Virtual Solo Hackathon (online)</option>
    </select>
</div>


                {["ename", "venue", "date", "regstart", "regend", "details", "prize"].map((field) => (
    <div key={field} className="flex items-center space-x-4">
        <label htmlFor={field} className="w-1/3 font-bold text-lg text-gray-700 text-right">
        {field === 'venue' ? venueLabel :
                                field === 'ename' ? 'Event Name' :
                                field === 'regstart' ? 'Registration Start Date' :
                                field === 'regend' ? 'Registration End Date' :
                                field.charAt(0).toUpperCase() + field.slice(1)}:
        </label>
        <input
            type={["date", "regstart", "regend"].includes(field) ? "date" : "text"}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-2/3 p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>
))}

<div className="flex items-center space-x-4">
                        <label className="w-1/3 font-bold text-lg text-gray-700 text-right">
                            Duration of Hackathon:
                        </label>
                        <input
    type="text"
    id="durofhk"
    name="durofhk"
    value={formData.durofhk}
    onChange={handleChange}
    placeholder="Enter Duration (e.g., 24 Hour, 12 Hour, 1 Hour)"
    className="w-2/3 p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
    required
/>
                    </div>


                    <div className="flex justify-center">
                    <button type="submit" className="w-1/2 bg-gradient-to-r from-orange-400 to-rose-600  text-white py-2 px-4 rounded-md cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-110">
                        Host
                    </button>
                </div>

            </form>

            <Footer />
        </div>
    );
};

export default Hosthk;
